'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface FormInputProps {
  label: string
  name: string
  type?: 'text' | 'email' | 'tel' | 'number' | 'url' | 'password'
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  helperText?: string
  className?: string
}

export function FormInput({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  helperText,
  className = '',
}: FormInputProps) {
  const [focused, setFocused] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`space-y-2 ${className}`}
    >
      <label
        htmlFor={name}
        className={`block text-sm font-semibold transition-colors ${
          focused ? 'text-primary' : error ? 'text-destructive' : 'text-foreground'
        }`}
      >
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      <motion.div
        whileFocus={{ scale: 1.01 }}
        className="relative"
      >
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 bg-background ${
            error
              ? 'border-destructive focus:border-destructive focus:ring-2 focus:ring-destructive/20'
              : focused
              ? 'border-primary focus:border-primary focus:ring-2 focus:ring-primary/20'
              : 'border-border hover:border-primary/50'
          } disabled:opacity-50 disabled:cursor-not-allowed outline-none shadow-sm hover:shadow-md focus:shadow-lg`}
        />
        {focused && !error && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary origin-left"
          />
        )}
      </motion.div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-destructive"
        >
          {error}
        </motion.p>
      )}
      {helperText && !error && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
    </motion.div>
  )
}

interface FormTextareaProps {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  placeholder?: string
  required?: boolean
  disabled?: boolean
  rows?: number
  error?: string
  helperText?: string
  className?: string
}

export function FormTextarea({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  rows = 4,
  error,
  helperText,
  className = '',
}: FormTextareaProps) {
  const [focused, setFocused] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`space-y-2 ${className}`}
    >
      <label
        htmlFor={name}
        className={`block text-sm font-semibold transition-colors ${
          focused ? 'text-primary' : error ? 'text-destructive' : 'text-foreground'
        }`}
      >
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      <motion.div
        whileFocus={{ scale: 1.01 }}
        className="relative"
      >
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          rows={rows}
          className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 bg-background resize-none ${
            error
              ? 'border-destructive focus:border-destructive focus:ring-2 focus:ring-destructive/20'
              : focused
              ? 'border-primary focus:border-primary focus:ring-2 focus:ring-primary/20'
              : 'border-border hover:border-primary/50'
          } disabled:opacity-50 disabled:cursor-not-allowed outline-none shadow-sm hover:shadow-md focus:shadow-lg`}
        />
        {focused && !error && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary origin-left"
          />
        )}
      </motion.div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-destructive"
        >
          {error}
        </motion.p>
      )}
      {helperText && !error && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
    </motion.div>
  )
}

interface FormSelectProps {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: { value: string; label: string }[]
  required?: boolean
  disabled?: boolean
  error?: string
  helperText?: string
  className?: string
}

export function FormSelect({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
  disabled = false,
  error,
  helperText,
  className = '',
}: FormSelectProps) {
  const [focused, setFocused] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`space-y-2 ${className}`}
    >
      <label
        htmlFor={name}
        className={`block text-sm font-semibold transition-colors ${
          focused ? 'text-primary' : error ? 'text-destructive' : 'text-foreground'
        }`}
      >
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      <motion.div
        whileFocus={{ scale: 1.01 }}
        className="relative"
      >
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required={required}
          disabled={disabled}
          className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 bg-background appearance-none cursor-pointer ${
            error
              ? 'border-destructive focus:border-destructive focus:ring-2 focus:ring-destructive/20'
              : focused
              ? 'border-primary focus:border-primary focus:ring-2 focus:ring-primary/20'
              : 'border-border hover:border-primary/50'
          } disabled:opacity-50 disabled:cursor-not-allowed outline-none shadow-sm hover:shadow-md focus:shadow-lg`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <motion.div
          className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
          animate={{ rotate: focused ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg
            className="w-5 h-5 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </motion.div>
      </motion.div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-destructive"
        >
          {error}
        </motion.p>
      )}
      {helperText && !error && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
    </motion.div>
  )
}

interface FormCheckboxProps {
  label: string
  name: string
  checked: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
  className?: string
}

export function FormCheckbox({
  label,
  name,
  checked,
  onChange,
  disabled = false,
  className = '',
}: FormCheckboxProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex items-center gap-3 ${className}`}
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="relative"
      >
        <input
          id={name}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
        />
        <motion.label
          htmlFor={name}
          className={`flex items-center justify-center w-6 h-6 border-2 rounded-md cursor-pointer transition-all ${
            checked
              ? 'bg-primary border-primary'
              : 'bg-background border-border hover:border-primary'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {checked && (
            <motion.svg
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-4 h-4 text-primary-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </motion.svg>
          )}
        </motion.label>
      </motion.div>
      <label
        htmlFor={name}
        className={`text-sm font-medium cursor-pointer ${disabled ? 'opacity-50' : ''}`}
      >
        {label}
      </label>
    </motion.div>
  )
}

interface FormButtonProps {
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
  variant?: 'primary' | 'secondary' | 'danger' | 'outline'
  children: React.ReactNode
  className?: string
  icon?: React.ReactNode
}

export function FormButton({
  type = 'button',
  onClick,
  disabled = false,
  loading = false,
  variant = 'primary',
  children,
  className = '',
  icon,
}: FormButtonProps) {
  const baseStyles = 'px-6 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg'
  
  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-xl',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90 hover:shadow-xl',
    danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-xl',
    outline: 'border-2 border-border bg-background hover:bg-muted hover:shadow-xl',
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled || loading ? 1 : 1.02, y: -2 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {loading ? (
        <>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
          />
          Loading...
        </>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </motion.button>
  )
}

