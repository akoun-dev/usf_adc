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
  
  if (typeof content === "string") return content;
  if (typeof content !== 'object') return String(content);

  const specificLang = lang.split("-")[0];
  let value = content[specificLang];
  
  if (value === undefined || value === null) {
    value = content["fr"] || content["en"];
  }
  
  if (value === undefined || value === null) {
    const keys = Object.keys(content);
    if (keys.length > 0) value = content[keys[0]];
  }

  if (value !== null && typeof value === 'object') {
    return getLangValue(value, lang);
  }
  
  return value !== undefined && value !== null ? String(value) : "";
};
