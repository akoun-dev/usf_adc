import { supabase } from "@/integrations/supabase/client"

export interface AISettings {
    provider: "openai" | "mistral" | "anthropic" | "other" | "libretranslate"
    model: string
    apiKey: string
    systemPrompt: string
    temperature: number
    enabled: boolean
    localUrl?: string
}

export async function translateText(
    text: string,
    targetLangs: string[],
    sourceLang: string = "fr"
): Promise<Record<string, string>> {
    try {
        // 1. Fetch AI settings
        const { data: settings } = await supabase
            .from("platform_settings")
            .select("value")
            .eq("key", "ai_settings")
            .single()

        const aiSettings = settings?.value as unknown as AISettings

        if (!aiSettings || !aiSettings.enabled || !aiSettings.apiKey) {
            console.warn("AI Translation is disabled or not configured.")
            // Fallback: return empty object so we don't overwrite existing translations with source text
            return {}
        }

        // 3. Call AI Provider
        if (aiSettings.provider === "openai") {
            const prompt = `You are a professional translator for USF-ADC (Universal Service Fund - Digital Development).
Translate the following text from ${sourceLang} to these languages: ${targetLangs.join(", ")}.

INSTRUCTIONS:
1. Provide a natural and accurate translation for each language.
2. For events or proper names like "Spectrum 2026 Conference", translate the descriptive parts (e.g. "Conférence Spectrum 2026" in French, "Conferência Spectrum 2026" in Portuguese).
3. Do NOT simply repeat the source text unless it's a brand name that remains identical globally.
4. Output ONLY a JSON object where keys are language codes and values are the translated strings.
5. Ensure the tone is professional and suitable for a government/international agency.

Format: {"en": "...", "pt": "...", "ar": "..."}

Text to translate: ${text}`

            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${aiSettings.apiKey}`,
                },
                body: JSON.stringify({
                    model: aiSettings.model || "gpt-4o",
                    messages: [
                        { role: "system", content: aiSettings.systemPrompt || "You are a professional translator." },
                        { role: "user", content: prompt },
                    ],
                    temperature: 0.3,
                }),
            })

            if (!response.ok) {
                throw new Error(`OpenAI API error: ${response.statusText}`)
            }

            const data = await response.json()
            const content = data.choices[0].message.content
            
            const jsonMatch = content.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0])
            }
            return JSON.parse(content)
        }

        if (aiSettings.provider === "libretranslate") {
            const baseUrl = aiSettings.localUrl || "http://localhost:5001"
            const results: Record<string, string> = {}

            // Helper for LibreTranslate API
            const ltTranslate = async (q: string, src: string, target: string) => {
                const res = await fetch(`${baseUrl}/translate`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        q,
                        source: src,
                        target,
                        format: "text",
                        api_key: aiSettings.apiKey || ""
                    })
                })
                if (!res.ok) throw new Error(`LibreTranslate error: ${res.statusText}`)
                const data = await res.json()
                return data.translatedText
            }

            // Logic: English as transition
            let pivotText = text
            if (sourceLang !== "en") {
                pivotText = await ltTranslate(text, sourceLang, "en")
                results["en"] = pivotText
            }

            // Translate from English (pivot) to other target languages
            for (const lang of targetLangs) {
                if (lang === sourceLang || lang === "en") continue
                results[lang] = await ltTranslate(pivotText, "en", lang)
            }

            // If source was EN, we still need to translate to others (including original targetLangs if they were not all handled)
            if (sourceLang === "en") {
                for (const lang of targetLangs) {
                    if (lang === "en") continue
                    results[lang] = await ltTranslate(text, "en", lang)
                }
            }

            return results
        }

        throw new Error(`Provider ${aiSettings.provider} not yet implemented for auto-translation.`)

    } catch (error) {
        console.error("Translation error:", error)
        // Fallback: return empty object
        return {}
    }
}
