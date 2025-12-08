import { ref, computed, watch, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'

export function useTranslation() {
  const { locale } = useI18n()
  const translating: Ref<boolean> = ref(false)

  const translate = async (text: string, sourceLang: string = 'th'): Promise<string> => {
    if (locale.value === 'en' && sourceLang === 'th') {
      translating.value = true
      try {
        return text
      } finally {
        translating.value = false
      }
    }
    return text
  }

  const translateMultiple = async (texts: string[], sourceLang: string = 'th'): Promise<string[]> => {
    if (locale.value === 'en' && sourceLang === 'th') {
      translating.value = true
      try {
        return texts
      } finally {
        translating.value = false
      }
    }
    return texts
  }

  const translated = (textRef: Ref<string>, sourceLang: string = 'th') => {
    const translatedText: Ref<string> = ref('')
    const isLoading: Ref<boolean> = ref(false)

    const updateTranslation = async (): Promise<void> => {
      if (!textRef.value) {
        translatedText.value = ''
        return
      }

      if (locale.value === 'en' && sourceLang === 'th') {
        isLoading.value = true
        try {
          translatedText.value = textRef.value
        } finally {
          isLoading.value = false
        }
      } else {
        translatedText.value = textRef.value
      }
    }

    updateTranslation()
    watch(() => locale.value, updateTranslation)
    watch(() => textRef.value, updateTranslation)

    return computed(() => translatedText.value)
  }

  return {
    translate,
    translateMultiple,
    translated,
    translating: computed(() => translating.value)
  }
}

