import { createI18n, type I18n } from 'vue-i18n'
import en from './locales/en.json'
import th from './locales/th.json'

const messages = {
  en,
  th
}

const savedLocale = localStorage.getItem('locale') || 'th'

const i18n: I18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'th',
  messages
})

export default i18n

