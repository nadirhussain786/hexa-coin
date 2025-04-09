"use client"

import type { ChangeEvent } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface FormFieldProps {
  id: string
  label: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  type?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  className?: string
  labelClassName?: string
  inputClassName?: string
}

export function FormField({
  id,
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  required = false,
  disabled = false,
  className = "space-y-2",
  labelClassName = "text-cosmic-text",
  inputClassName = "bg-cosmic-bg/50 border-cosmic-accent/20 text-cosmic-text",
}: FormFieldProps){
  return (
    <div className={className}>
      <Label htmlFor={id} className={labelClassName}>
        {label}
      </Label>
      <Input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={inputClassName}
      />
    </div>
  )
}
