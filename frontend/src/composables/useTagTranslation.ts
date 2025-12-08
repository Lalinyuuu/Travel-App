import { useI18n } from 'vue-i18n'

export function useTagTranslation() {
  const { tm } = useI18n()

  const translateTag = (tag: string | null | undefined): string => {
    if (!tag) return tag || ''
    
    const messages = tm('tags') as Record<string, string> | undefined
    if (messages && messages[tag]) {
      return messages[tag]
    }
    
    return tag
  }

  return {
    translateTag
  }
}

