"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { translations, type Lang, type Translations } from "@/lib/translations"

interface LanguageContextType {
  lang: Lang
  setLang: (lang: Lang) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "ru",
  setLang: () => {},
  t: translations.ru,
})

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLangState] = useState<Lang>("ru")

  useEffect(() => {
    const saved = localStorage.getItem("lang") as Lang | null
    if (saved === "ru" || saved === "kk") setLangState(saved)
  }, [])

  const setLang = (l: Lang) => {
    setLangState(l)
    localStorage.setItem("lang", l)
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
