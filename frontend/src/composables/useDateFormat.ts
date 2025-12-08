import { useI18n } from 'vue-i18n'

export function useDateFormat() {
  const { t, locale } = useI18n()

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) {
      return t('common.justNow')
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return t('common.minutesAgo', { count: minutes })
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return t('common.hoursAgo', { count: hours })
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400)
      return t('common.daysAgo', { count: days })
    } else {
      const dateLocale = locale.value === 'th' ? 'th-TH' : 'en-US'
      return date.toLocaleDateString(dateLocale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }
  }

  const formatDateFull = (dateString: string | null | undefined): string => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const dateLocale = locale.value === 'th' ? 'th-TH' : 'en-US'
    
    return date.toLocaleString(dateLocale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return {
    formatDate,
    formatDateFull
  }
}

