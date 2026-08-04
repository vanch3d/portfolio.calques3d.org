// next-intl global type augmentation.
// Provides compile-time type checking for all message keys used with
// getTranslations() / useTranslations(). Add all supported locales here
// once multi-language support is introduced.

import en from "../../messages/en.json";

declare global {
  type IntlMessages = typeof en;
}
