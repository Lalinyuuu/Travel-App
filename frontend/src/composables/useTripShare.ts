import { useI18n } from 'vue-i18n'
import { useToast } from './useToast'
import type { TripSummary } from '../types'

export function useTripShare() {
  const { t } = useI18n()
  const toast = useToast()

  const handleShare = (trip: TripSummary): void => {
    const url = `${window.location.origin}/trips/${trip.id}`
    if (navigator.share) {
      navigator.share({
        title: trip.title,
        text: trip.shortDescription,
        url: url
      }).catch(() => {
      })
    } else {
      navigator.clipboard.writeText(url).then(() => {
        toast.success(t('allTrips.linkCopied'))
      }).catch(() => {
      })
    }
  }

  return {
    handleShare
  }
}

