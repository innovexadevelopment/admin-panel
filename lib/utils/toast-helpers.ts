/**
 * Helper functions to easily show toast notifications
 * These can be used instead of alert() throughout the admin panel
 */

import { toast as showToast } from '../hooks/use-toast'

export const showSuccessToast = (message: string, title: string = 'Success') => {
  showToast({
    variant: 'success',
    title,
    description: message,
  })
}

export const showErrorToast = (message: string, title: string = 'Error') => {
  showToast({
    variant: 'error',
    title,
    description: message,
  })
}

export const showWarningToast = (message: string, title: string = 'Warning') => {
  showToast({
    variant: 'warning',
    title,
    description: message,
  })
}

export const showInfoToast = (message: string, title: string = 'Info') => {
  showToast({
    variant: 'info',
    title,
    description: message,
  })
}

