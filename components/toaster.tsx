'use client'

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  getIcon,
} from './toast'
import { useToast } from '../lib/hooks/use-toast'
import { motion, AnimatePresence } from 'framer-motion'

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      <AnimatePresence>
        {toasts.map(function ({ id, title, description, action, variant = 'default', ...props }) {
          const icon = variant !== 'default' ? getIcon(variant) : null

          return (
            <Toast key={id} variant={variant} {...props}>
              <motion.div
                initial={{ opacity: 0, x: 100, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 100, scale: 0.8 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="flex items-start gap-3 w-full"
              >
                {icon && <div className="flex-shrink-0 mt-0.5">{icon}</div>}
                <div className="flex-1 grid gap-1">
                  {title && <ToastTitle>{title}</ToastTitle>}
                  {description && (
                    <ToastDescription>{description}</ToastDescription>
                  )}
                </div>
                {action}
                <ToastClose />
              </motion.div>
            </Toast>
          )
        })}
      </AnimatePresence>
      <ToastViewport />
    </ToastProvider>
  )
}

