import { hfClient } from "../i18n";
import i18n from "../i18n";

export const translationService = {

  getCurrentLanguage: () => {
    return i18n.language || "en";
  },

  
  changeLanguage: (languageCode) => {
    return i18n.changeLanguage(languageCode);
  },

  
  translate: (key, defaultValue = "") => {
    const translation = i18n.t(key);
    return translation || defaultValue || key;
  },


  translateWithHuggingFace: async (text, targetLanguage) => {
    if (!hfClient) {
      console.warn(
        "Hugging Face client not available. Set NEXT_PUBLIC_HF_TOKEN in environment.",
      );
      return text;
    }

    try {
         
      const modelMap = {
        hi: "Helsinki-NLP/opus-mt-en-hi", 
        ta: "Helsinki-NLP/opus-mt-en-ta", // English to Tamil
        te: "Helsinki-NLP/opus-mt-en-te", // English to Telugu
        ml: "Helsinki-NLP/opus-mt-en-mal", // English to Malayalam
        kn: "Helsinki-NLP/opus-mt-en-kn", // English to Kannada
        bn: "Helsinki-NLP/opus-mt-en-bn", // English to Bengali
        gu: "Helsinki-NLP/opus-mt-en-gu", // English to Gujarati
        pa: "Helsinki-NLP/opus-mt-en-pa", // English to Punjabi
        mr: "Helsinki-NLP/opus-mt-en-mr", // English to Marathi
        ur: "Helsinki-NLP/opus-mt-en-ur", // English to Urdu
      };

      const model = modelMap[targetLanguage];
      if (!model) {
        console.warn(
          `No translation model available for language: ${targetLanguage}`,
        );
        return text;
      }

      const result = await hfClient.translation({
        model,
        inputs: text,
      });

      return result[0]?.translation_text || text;
    } catch (error) {
      console.error("Hugging Face translation error:", error);
      return text;
    }
  },

  /**
   * Batch translate multiple texts
   */
  batchTranslate: async (texts, targetLanguage) => {
    const results = [];
    for (const text of texts) {
      const translated = await translationService.translateWithHuggingFace(
        text,
        targetLanguage,
      );
      results.push(translated);
    }
    return results;
  },

  /**
   * Get available languages
   */
  getAvailableLanguages: () => {
    return i18n.options.supportedLngs || [];
  },

  /**
   * Initialize i18n if not already initialized
   */
  initializeI18n: async () => {
    if (!i18n.isInitialized) {
      try {
        await i18n.init();
        console.log("i18n initialized successfully");
      } catch (error) {
        console.error("Failed to initialize i18n:", error);
      }
    }
  },
};

export default translationService;
