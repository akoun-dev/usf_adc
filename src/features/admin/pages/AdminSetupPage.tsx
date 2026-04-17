import { supabase } from "@/integrations/supabase/client"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function AdminSetupPage() {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")

    const setupAdmin = async () => {
        setLoading(true)
        setMessage("Calling setup function...")
        setError("")

        try {
            // Call the Edge Function
            const response = await fetch(
                `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/setup-admin-user`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
                    },
                    body: JSON.stringify({}),
                }
            )

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Setup failed")
            }

            setMessage(
                `✅ Admin user configured successfully!\n` +
                    `ID: ${data.adminId}\n` +
                    `Email: ${data.email}\n` +
                    `Role: super_admin\n\n` +
                    `You can now login with:\n` +
                    `Email: admin@test.local\n` +
                    `Password: Admin123!`
            )
        } catch (err: any) {
            setError(err.message || "Unknown error occurred")
            setMessage("")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-sm">
                <h1 className="text-2xl font-bold mb-4">Setup Admin User</h1>

                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Click the button below to configure the admin@test.local
                        account with a profile and super_admin role.
                    </p>

                    <Button
                        onClick={setupAdmin}
                        disabled={loading}
                        className="w-full"
                    >
                        {loading ? "Setting up..." : "Setup Admin"}
                    </Button>

                    {message && (
                        <div className="rounded-md bg-green-950/20 p-3 text-sm whitespace-pre-wrap font-mono text-green-700">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                            {error}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AdminSetupPage
