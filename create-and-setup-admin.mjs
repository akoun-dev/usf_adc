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

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
})

const ADMIN_ACCOUNTS = [
    {
        email: "admin@test.local",
        password: "Admin123!",
        full_name: "Administrator",
        role: "super_admin",
        country_iso: null,
    },
    {
        email: "togo-admin@test.local",
        password: "Admin123!",
        full_name: "Admin Togo",
        role: "country_admin",
        country_iso: "tg",
    },
    {
        email: "togo-pointfocal@test.local",
        password: "Admin123!",
        full_name: "Point Focal Togo",
        role: "point_focal",
        country_iso: "tg",
    },
    {
        email: "civ-admin@test.local",
        password: "Admin123!",
        full_name: "Admin Cote d'Ivoire",
        role: "country_admin",
        country_iso: "ci",
    },
    {
        email: "civ-pointfocal@test.local",
        password: "Admin123!",
        full_name: "Point Focal Cote d'Ivoire",
        role: "point_focal",
        country_iso: "ci",
    },
];

async function getCountries() {
    const { data, error } = await supabase.from("countries").select("id, name_fr, code_iso");
    if (error) {
        console.warn("Impossible de recuperer les pays:", error.message);
        return [];
    }
    return data || [];
}

async function createUserAccount(account) {
    console.log(`\n📧 Creation de l'utilisateur: ${account.email}...`);

    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
        email: account.email,
        password: account.password,
        email_confirm: true,
        user_metadata: {
            full_name: account.full_name,
        }
    });

    if (userError) {
        if (userError.message.includes("already exists") ||
            userError.message.includes("duplicate") ||
            userError.message.includes("been registered")) {
            console.log(`  ⚠️  L'utilisateur existe deja, recuperation...`);
            const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
            if (listError) throw listError;
            userData.user = users.find(u => u.email === account.email);
            if (!userData.user) {
                throw new Error(`Utilisateur ${account.email} non trouve`);
            }
        } else {
            throw userError;
        }
    }

    console.log(`  ✅ Utilisateur cree/trouve: ${userData.user.id}`);

    console.log(`  👤 Configuration du profil...`);
    const { error: profileError } = await supabase.from("profiles").upsert(
        {
            id: userData.user.id,
            full_name: account.full_name,
            avatar_url: null,
            language: "fr",
            is_active: true,
            country_id: account.country_id,
            mfa_method: "email",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
    );

    if (profileError) {
        throw profileError;
    }
    console.log(`  ✅ Profil configure`);

    console.log(`  🔐 Attribution du role ${account.role}...`);
    const { error: roleError } = await supabase.from("user_roles").upsert(
        {
            user_id: userData.user.id,
            role: account.role,
            created_at: new Date().toISOString(),
        },
        { onConflict: "user_id,role" }
    );

    if (roleError) {
        throw roleError;
    }
    console.log(`  ✅ Role ${account.role} attribue`);

    return { ...account, user_id: userData.user.id };
}

async function createAndSetupAdmin() {
    try {
        console.log("🔧 Configuration des comptes administrateur...\n");

        // Verify admin API access
        console.log("🔑 Verification de l'acces admin...");
        const { data: { users: existingUsers }, error: listError } = await supabase.auth.admin.listUsers();
        if (listError) {
            console.error("❌ Admin API non accessible:", listError.message);
            console.error("   Vérifiez votre SUPABASE_SERVICE_ROLE_KEY dans le fichier .env");
            process.exit(1);
        }
        console.log(`  ✅ Admin API OK (${existingUsers?.length || 0} utilisateurs existants)`);

        console.log("🌍 Recuperation des pays...");
        const countries = await getCountries();

        // Build country map by code_iso
        const countryByIso = {};
        countries.forEach(c => {
            countryByIso[c.code_iso] = c.id;
        });

        console.log(`  Trouve ${countries.length} pays`);
        if (countries.length > 0) {
            console.log(`  Pays disponibles:`, countries.map(c => `${c.name_fr} (${c.code_iso})`).join(", "));
        }

        const results = [];

        for (const account of ADMIN_ACCOUNTS) {
            // Resolve country_id from country_iso code
            if (account.country_iso && !account.country_id) {
                account.country_id = countryByIso[account.country_iso] || null;

                if (!account.country_id) {
                    console.warn(`  ⚠️  Pays avec code_iso '${account.country_iso}' non trouve dans la base`);
                }
            }

            try {
                const result = await createUserAccount(account);
                results.push(result);
            } catch (error) {
                console.error(`  ❌ Erreur: ${error.message}`);
            }
        }

        console.log("\n" + "━".repeat(65));
        console.log("✅ Configuration terminee avec succes!");
        console.log("━".repeat(65));

        results.forEach(r => {
            console.log(`\n📧 ${r.full_name} (${r.role})`);
            console.log(`   Email:    ${r.email}`);
            console.log(`   Password: ${r.password}`);
            console.log(`   ID:       ${r.user_id}`);
            if (r.country_id) {
                console.log(`   Pays ID:  ${r.country_id}`);
            }
        });

        console.log("\n" + "━".repeat(65));
        console.log(`🔗 Studio:   http://127.0.0.1:54323`);
        console.log("━".repeat(65));

    } catch (error) {
        console.error("\n❌ Erreur:", error.message);
        process.exit(1);
    }
}

createAndSetupAdmin()
