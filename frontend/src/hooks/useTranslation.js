import { useState, useEffect, useCallback } from "react";
import i18n from "../i18n";


export function useTranslation() {
  const [language, setLanguage] = useState(i18n.language || "en");
  const [, forceUpdate] = useState();

  useEffect(() => {
    // Initialize i18n on component mount
    if (!i18n.isInitialized) {
      i18n.init().catch((err) => console.error("i18n init error:", err));
    }

    // Listen for language changes
    const handleLanguageChange = (lng) => {
      setLanguage(lng);
      forceUpdate({}); // Force re-render
    };

    i18n.on("languageChanged", handleLanguageChange);

    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, []);

  // Translation function
  const t = useCallback(
    (key, defaultValue = "") => {
      const translation = i18n.t(key);
      return translation || defaultValue || key;
    },
    [language],
  );

  // Change language function
  const changeLanguage = useCallback((lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("i18nextLng", lng);
  }, []);

  return {
    t,
    i18n: {
      language: i18n.language || language,
      changeLanguage,
      getFixedT: (lng, ns) => (key) => i18n.t(key, { lng, ns }),
    },
  };
}

export default useTranslation;
