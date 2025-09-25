"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Globe } from "lucide-react"

interface LanguageSelectorProps {
  onLanguageChange?: (language: string) => void
  className?: string
}

export function LanguageSelector({ onLanguageChange, className }: LanguageSelectorProps) {
  const [language, setLanguage] = useState("en")

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage)
    onLanguageChange?.(newLanguage)
  }

  return (
    <Select value={language} onValueChange={handleLanguageChange}>
      <SelectTrigger className={`w-32 ${className}`}>
        <Globe className="w-4 h-4 mr-2" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="hi">हिंदी</SelectItem>
      </SelectContent>
    </Select>
  )
}
