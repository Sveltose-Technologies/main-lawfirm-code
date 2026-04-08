import { useEffect } from "react";
import { useTranslation } from "./useTranslation";


export function usePageTitle(
  titleKey,
  descriptionKey = null,
  siteTitle = "Law Firm",
) {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (!titleKey) return;

    // Get translations
    const pageTitle = t(titleKey);
    const pageDescription = descriptionKey ? t(descriptionKey) : null;

    // Update document title
    document.title = `${pageTitle} | ${siteTitle}`;

    // Update meta description if provided
    if (pageDescription) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement("meta");
        metaDescription.name = "description";
        document.head.appendChild(metaDescription);
      }
      metaDescription.content = pageDescription;
    }
  }, [titleKey, descriptionKey, i18n.language, siteTitle, t]);

  return {
    title: t(titleKey),
    description: descriptionKey ? t(descriptionKey) : null,
  };
}

export default usePageTitle;
