import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { HfInference } from "@huggingface/inference";

import en from "./locales/en.json";
import hi from "./locales/hi.json";
import ta from "./locales/ta.json";
import ml from "./locales/ml.json";
import kn from "./locales/kn.json";
import te from "./locales/te.json";
import mr from "./locales/mr.json";
import bn from "./locales/bn.json";
import gu from "./locales/gu.json";
import pa from "./locales/pa.json";
import ur from "./locales/ur.json";

export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi (हिंदी)" },
  { code: "ta", label: "Tamil (தமிழ்)" },
  { code: "ml", label: "Malayalam (മലയാളം)" },
  { code: "kn", label: "Kannada (ಕನ್ನಡ)" },
  { code: "te", label: "Telugu (తెలుగు)" },
  { code: "mr", label: "Marathi (मराठी)" },
  { code: "bn", label: "Bengali (বাংলা)" },
  { code: "gu", label: "Gujarati (ગુજરાતી)" },
  { code: "pa", label: "Punjabi (ਪੰਜਾਬੀ)" },
  { code: "ur", label: "Urdu (اردو)" },
];

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  ta: { translation: ta },
  ml: { translation: ml },
  kn: { translation: kn },
  te: { translation: te },
  mr: { translation: mr },
  bn: { translation: bn },
  gu: { translation: gu },
  pa: { translation: pa },
  ur: { translation: ur },
};

// Initialize Hugging Face client for translations
export const hfClient =
  typeof window !== "undefined" && process.env.NEXT_PUBLIC_HF_TOKEN
    ? new HfInference(process.env.NEXT_PUBLIC_HF_TOKEN)
    : null;

if (!i18n.isInitialized) {
  i18n.use(LanguageDetector).init({
    resources,
    fallbackLng: "en",
    supportedLngs: SUPPORTED_LANGUAGES.map((l) => l.code),
    nonExplicitSupportedLngs: true,
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });
}

export default i18n;
