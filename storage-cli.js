#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const command = process.argv[2]

// ---------------- LOAD ENV ----------------
function loadEnvFile() {
    try {
        const envPath = path.join(process.cwd(), '.env')
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf-8')
            envContent.split('\n').forEach(line => {
                const [key, ...valueParts] = line.split('=')
                if (key && valueParts.length > 0 && !line.startsWith('#')) {
                    let value = valueParts.join('=').trim()
                    if ((value.startsWith('"') && value.endsWith('"')) ||
                        (value.startsWith("'") && value.endsWith("'"))) {
                        value = value.slice(1, -1)
                    }
                    process.env[key] = value
                }
            })
        }
    } catch (error) {
        // Continue if .env fails to load
    }
}

loadEnvFile()

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321'
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!SUPABASE_URL || !SERVICE_KEY) {
    console.error('❌ Missing env variables')
    console.error('   Vérifiez que SUPABASE_SERVICE_ROLE_KEY est défini dans votre fichier .env')
    process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

// ---------------- GET BUCKETS ----------------
async function getBuckets() {
    const { data, error } = await supabase.storage.listBuckets()

    if (error) {
        console.error('❌ Error fetching buckets:', error.message)
        process.exit(1)
    }

    return data
}

// ---------------- BACKUP ----------------
async function downloadFolder(bucket, prefix = '') {
    const { data, error } = await supabase.storage
        .from(bucket)
        .list(prefix, { limit: 1000 })

    if (error) {
        console.error(`❌ [${bucket}]`, error.message)
        return
    }

    for (const item of data) {
        const filePath = prefix ? `${prefix}/${item.name}` : item.name

        if (!item.id) {
            // 📁 dossier
            await downloadFolder(bucket, filePath)
        } else {
            try {
                // 📥 Télécharger fichier
                const { data: fileData, error: downloadError } = await supabase.storage
                    .from(bucket)
                    .download(filePath)

                if (downloadError) {
                    console.error(`❌ Download error:`, downloadError.message)
                    continue
                }

                const buffer = Buffer.from(await fileData.arrayBuffer())

                const localPath = path.join('backup', bucket, filePath)
                fs.mkdirSync(path.dirname(localPath), { recursive: true })
                fs.writeFileSync(localPath, buffer)

                // 💾 Sauvegarder metadata
                const metaPath = localPath + '.json'
                fs.writeFileSync(metaPath, JSON.stringify(item, null, 2))

                console.log(`⬇️ [${bucket}] ${filePath}`)
            } catch (err) {
                console.error(`❌ Error processing ${filePath}:`, err.message)
            }
        }
    }
}

async function backupAll() {
    const buckets = await getBuckets()

    for (const bucket of buckets) {
        console.log(`\n📦 Bucket: ${bucket.name}`)
        await downloadFolder(bucket.name)
    }
}

// ---------------- RESTORE ----------------
async function createBucketIfNotExists(bucket) {
    const { data } = await supabase.storage.listBuckets()

    const exists = data.find(b => b.name === bucket)

    if (!exists) {
        console.log(`🆕 Creating bucket: ${bucket}`)
        await supabase.storage.createBucket(bucket, {
            public: false
        })
    }
}

async function uploadFolder(bucket, dir) {
    const items = fs.readdirSync(dir)

    for (const item of items) {
        const fullPath = path.join(dir, item)

        if (fs.lstatSync(fullPath).isDirectory()) {
            await uploadFolder(bucket, fullPath)
        } else if (!item.endsWith('.json')) {

            // ✅ chemin relatif propre
            const storagePath = path
                .relative(path.join('backup', bucket), fullPath)
                .replace(/\\/g, '/') // important pour Windows

            try {
                let contentType = 'application/octet-stream'
                let cacheControl = '3600'

                const metaFile = fullPath + '.json'
                if (fs.existsSync(metaFile)) {
                    const meta = JSON.parse(fs.readFileSync(metaFile, 'utf-8'))

                    contentType = meta.metadata?.mimetype || contentType
                    cacheControl = meta.metadata?.cacheControl || cacheControl
                }

                const { error } = await supabase.storage
                    .from(bucket)
                    .upload(storagePath, fs.readFileSync(fullPath), {
                        contentType,
                        cacheControl,
                        upsert: true
                    })

                if (error) {
                    console.error(`❌ [${bucket}] ${storagePath}:`, error.message)
                } else {
                    console.log(`⬆️ [${bucket}] ${storagePath}`)
                }
            } catch (err) {
                console.error(`❌ Upload error ${storagePath}:`, err.message)
            }
        }
    }
}

async function restoreAll() {
    if (!fs.existsSync('backup')) {
        console.error('❌ backup folder not found')
        process.exit(1)
    }

    const buckets = fs.readdirSync('backup')

    for (const bucket of buckets) {
        const bucketPath = path.join('backup', bucket)

        if (!fs.lstatSync(bucketPath).isDirectory()) continue

        await createBucketIfNotExists(bucket)

        console.log(`\n📦 Restoring bucket: ${bucket}`)
        await uploadFolder(bucket, bucketPath)
    }
}

// ---------------- CLI ----------------
if (command === 'backup') {
    console.log('🚀 Multi-bucket backup...')
    backupAll()
} else if (command === 'restore') {
    console.log('🚀 Multi-bucket restore...')
    restoreAll()
} else {
    console.log(`
Usage:
  node storage-cli.js backup
  node storage-cli.js restore
`)
}