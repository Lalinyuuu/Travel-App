import type { ToastType } from '../types'

export function useToast() {
  const showToast = (message: string, type: ToastType = 'info', duration: number = 3000): void => {
    if (window.toast && window.toast[type]) {
      window.toast[type](message, duration)
    }
  }

  return {
    success: (message: string, duration?: number) => showToast(message, 'success', duration),
    error: (message: string, duration?: number) => showToast(message, 'error', duration),
    warning: (message: string, duration?: number) => showToast(message, 'warning', duration),
    info: (message: string, duration?: number) => showToast(message, 'info', duration)
  }
}

