"use client"

import { useLanguage } from "@/contexts/LanguageContext"
import { Globe } from "lucide-react"

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage()

  return (
    <div className="flex items-center gap-1.5 bg-white/8 border border-white/10 rounded-full px-1 py-1">
      <Globe className="w-3.5 h-3.5 text-white/40 ml-1" />
      <button
        onClick={() => setLang("ru")}
        className={`w-8 py-1 text-xs font-semibold rounded-full transition-all duration-200 text-center ${
          lang === "ru"
            ? "bg-white text-black shadow-sm"
            : "text-white/50 hover:text-white/80"
        }`}
      >
        RU
      </button>
      <button
        onClick={() => setLang("kk")}
        className={`w-8 py-1 text-xs font-semibold rounded-full transition-all duration-200 text-center ${
          lang === "kk"
            ? "bg-white text-black shadow-sm"
            : "text-white/50 hover:text-white/80"
        }`}
      >
        KZ
      </button>
    </div>
  )
}
