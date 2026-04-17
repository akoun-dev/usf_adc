#!/usr/bin/env node
/**
 * Script pour créer l'utilisateur admin et configurer son rôle
 * Usage: node create-and-setup-admin.mjs
 */

import { createClient } from "@supabase/supabase-js"
import { readFileSync } from "fs"
import { dirname, join } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))

// Lire les variables d'environnement depuis .env
function loadEnvFile() {
    try {
        const envPath = join(__dirname, ".env")
        const envContent = readFileSync(envPath, "utf-8")
        envContent.split("\n").forEach(line => {
            const [key, ...valueParts] = line.split("=")
            if (key && valueParts.length > 0 && !line.startsWith("#")) {
                let value = valueParts.join("=").trim()
                // Remove quotes if present
                if ((value.startsWith('"') && value.endsWith('"')) ||
                    (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.slice(1, -1)
                }
                process.env[key] = value
            }
        })
    } catch (error) {
        // .env file might not exist, continue with system env vars
    }
}

loadEnvFile()

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error("❌ Variables manquantes: VITE_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY")
    console.error("   Vérifiez votre fichier .env")
    process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function createAndSetupAdmin() {
    try {
        console.log("🔧 Création et configuration du compte admin...")

        // 1. Créer l'utilisateur dans auth.users
        console.log("📧 Création de l'utilisateur auth...")
        const { data: userData, error: userError } = await supabase.auth.admin.createUser({
            email: "admin@test.local",
            password: "Admin123!",
            email_confirm: true,
            user_metadata: {
                full_name: "Administrator",
            }
        })

        if (userError) {
            // L'utilisateur existe peut-être déjà
            if (userError.message.includes("already exists") ||
                userError.message.includes("duplicate") ||
                userError.message.includes("been registered")) {
                console.log("⚠️  L'utilisateur existe déjà, récupération...")
                const { data: { users } } = await supabase.auth.admin.listUsers()
                userData.user = users.find(u => u.email === "admin@test.local")
                if (!userData.user) {
                    throw new Error("Utilisateur admin non trouvé dans la liste")
                }
            } else {
                throw userError
            }
        }

        console.log(`✅ Utilisateur créé/trouvé: ${userData.user.id}`)

        // 2. Créer ou mettre à jour le profil
        console.log("👤 Configuration du profil...")
        const { error: profileError } = await supabase.from("profiles").upsert(
            {
                id: userData.user.id,
                full_name: "Administrator",
                avatar_url: null,
                language: "fr",
                is_active: true,
                country_id: null,
                mfa_method: "email",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
            { onConflict: "id" }
        )

        if (profileError) {
            console.error("❌ Erreur profil:", profileError)
            throw profileError
        }

        console.log("✅ Profil configuré")

        // 3. Assigner le rôle super_admin
        console.log("🔐 Attribution du rôle super_admin...")
        const { error: roleError } = await supabase.from("user_roles").upsert(
            {
                user_id: userData.user.id,
                role: "super_admin",
                created_at: new Date().toISOString(),
            },
            { onConflict: "user_id,role" }
        )

        if (roleError) {
            console.error("❌ Erreur rôle:", roleError)
            throw roleError
        }

        console.log("✅ Rôle super_admin attribué")

        // 4. Vérification
        const { data: roles } = await supabase
            .from("user_roles")
            .select("*")
            .eq("user_id", userData.user.id)

        console.log("\n✅ Configuration admin terminée avec succès!")
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        console.log(`📧 Email:    admin@test.local`)
        console.log(`🔑 Password: Admin123!`)
        console.log(`🆔 User ID:  ${userData.user.id}`)
        console.log(`👤 Rôle:     super_admin`)
        console.log(`🔗 Studio:   http://127.0.0.1:54323`)
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

    } catch (error) {
        console.error("\n❌ Erreur:", error.message)
        process.exit(1)
    }
}

createAndSetupAdmin()
