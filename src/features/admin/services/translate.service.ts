import { supabase } from "@/integrations/supabase/client";

export const getAISettings = async () => {
    try {
        const { data, error } = await supabase
            .from('platform_settings')
            .select('value')
            .eq('key', 'ai_settings')
            .single();

        if (error) throw error;
        return data.value as any;
    } catch (error) {
        console.error("Failed to fetch AI settings:", error);
        return null;
    }
};

export const translateText = async (text: string, currentLang: string, targetLang: string) => {
    if (!text || currentLang === targetLang) return text;

    try {
        const settings = await getAISettings();
        const baseUrl = settings?.localUrl || "http://localhost:5000";
        const urls = [
            `${baseUrl}/translate`,
            "http://localhost:5000/translate"
        ];

        console.log(`[Translate] Tentative: ${currentLang} -> ${targetLang} | Texte: "${text.substring(0, 30)}..."`);

        for (const url of Array.from(new Set(urls))) {
            try {
                // On essaie d'abord avec la langue source explicite, c'est plus fiable que "auto"
                const res = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({
                        q: text,
                        source: currentLang === 'auto' ? 'auto' : currentLang,
                        target: targetLang,
                        format: "text",
                        alternatives: 3,
                        api_key: settings?.apiKey || ""
                    })
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data.translatedText) {
                        console.log(`[Translate] Succès via ${url}`);
                        return data.translatedText;
                    }
                } else {
                    const errorData = await res.json().catch(() => ({}));
                    console.error(`[Translate] Erreur HTTP ${res.status} sur ${url}:`, errorData);
                }
            } catch (err) {
                console.error(`[Translate] Erreur de connexion à ${url}. Vérifiez le service et le CORS.`, err);
                continue; 
            }
        }

        console.warn(`[Translate] Tous les essais ont échoué pour ${targetLang}. Garde le texte original.`);
        return text; 
    } catch (error) {
        console.error("[Translate] Erreur critique:", error);
        return text; 
    }
};




export async function translateToFourLang(currentLang: string, value: string) {
    const languages = ["fr", "en", "pt", "ar"];
    const result: Record<string, string> = {
        fr: "",
        en: "",
        pt: "",
        ar: ""
    };

    if (!value) {
        languages.forEach(l => result[l] = "");
        return result;
    }

    // Set initial value for all
    languages.forEach(l => result[l] = value);

    // If the current language is one of our target languages, set it
    if (languages.includes(currentLang)) {
        result[currentLang] = value;
    }

    try {
        // Pivot through English for better accuracy if not English
        const pivotLang = "en";
        let pivotText = value;

        if (currentLang !== pivotLang) {
            pivotText = await translateText(value, currentLang, pivotLang);
            result[pivotLang] = pivotText;
        }

        await Promise.all(
            languages
                .filter(lang => lang !== currentLang && lang !== pivotLang)
                .map(async (lang) => {
                    result[lang] = await translateText(pivotText, pivotLang, lang);
                })
        );
    } catch (error) {
        console.error("Batch translation failed:", error);
    }

    return result;
}

