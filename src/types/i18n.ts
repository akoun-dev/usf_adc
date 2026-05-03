/**
 * Interface for multilingual content stored as JSONB in the database.
 * Supports the four official languages of the application.
 */
export interface TranslatedContent {
  fr: string;
  en: string;
  pt: string;
  ar: string;
  [key: string]: string; // Allow for other locale keys if needed
}

/**
 * Helper to check if a value is a valid TranslatedContent object.
 */
export const isTranslatedContent = (value: any): value is TranslatedContent => {
  return (
    value !== null &&
    typeof value === 'object' &&
    (typeof value.fr === 'string' || typeof value.en === 'string')
  );
};

/**
 * Helper to extract language value with fallbacks.
 * Logic: Active Locale -> French (fr) -> English (en) -> First available key -> Empty string.
 */
export const getLangValue = (content: any, lang: string): string => {
  if (!content) return "";
  
  // If it's a string, return it as is (legacy or non-translated)
  if (typeof content === "string") return content;
  
  // If it's the specific language requested
  const specificLang = lang.split("-")[0];
  if (content[specificLang]) return content[specificLang];
  
  // Fallbacks
  if (content["fr"]) return content["fr"];
  if (content["en"]) return content["en"];
  
  // Last resort: any key
  const keys = Object.keys(content);
  if (keys.length > 0) return content[keys[0]];
  
  return "";
};
