"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { Eye, EyeOff, X } from "lucide-react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { useUserStore } from "@/stores/useUserStore"
import Image from "next/image"
import Link from "next/link"
import { Toaster, toast } from "react-hot-toast"
import { safeParseResponse } from "@/lib/api"
import { useLanguage } from "@/contexts/LanguageContext"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4232/api"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberDevice, setRememberDevice] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const { t } = useLanguage()

  const fetchProfile = async (accessToken: string) => {
    const res = await fetch(`${API_URL}/profile`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (res.ok) {
      const parseResult = await safeParseResponse(res)
      if (parseResult.error || !parseResult.isJson) return
      useUserStore.getState().setUser({ email: "", full_name: "", avatar: "", phone: "", description: "", roles: [] })
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await fetch(`${API_URL}/auth/signin`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ username, password }),
      })

      if (res.ok) {
        const parseResult = await safeParseResponse(res)
        if (parseResult.error || !parseResult.isJson) { toast.error(t.login.serverResponseError); return }
        const data = parseResult.data as { token: string }
        toast.success(t.login.loginSuccess)
        Cookies.set("accessToken", data.token, { expires: rememberDevice ? 7 : 1 })
        await fetchProfile(data.token)
        router.push("/")
      } else {
        let message = t.login.loginError
        const parseResult = await safeParseResponse(res)
        if (parseResult.error) message = parseResult.error
        else if (typeof parseResult.data === "string") message = parseResult.data
        else if (parseResult.data && typeof parseResult.data === "object") {
          const err = parseResult.data as Record<string, unknown>
          message = String(err.detail || err.message || err.error || message)
        }
        toast.error(message)
      }
    } catch {
      toast.error(t.login.genericError)
    } finally {
      setIsLoading(false)
    }
  }

  const inputClass = "border-white/10 bg-white/5 focus-visible:border-accent focus-visible:ring-0 h-12 rounded-xl text-white placeholder:text-white/30 transition-colors"

  return (
    <div className="min-h-screen bg-[#070A12] text-white flex">
      <Toaster position="top-center" />

      {/* Left banner */}
      <div className="hidden lg:flex w-[42%] relative overflow-hidden">
        <Image src="/assets/banner.png" alt="Banner" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#070A12]" />
      </div>

      {/* Form side */}
      <div className="flex-1 flex flex-col justify-center pl-8 pr-10 md:pr-16 lg:pr-20 py-10 relative">
        <Link href="/" className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </Link>

        <div className="w-full max-w-md ml-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-1">{t.login.title}</h1>
            <p className="text-white/40 text-sm">
              {t.login.noAccount}{" "}
              <Link href="/register" className="text-accent hover:underline">{t.login.registerLink}</Link>
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username */}
            <div className="space-y-1.5">
              <Label className="text-sm text-white/60">{t.login.nickname}</Label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                required
                className={inputClass}
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label className="text-sm text-white/60">{t.login.password}</Label>
                <a href="#" className="text-xs text-accent hover:underline">{t.login.forgotPassword}</a>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.login.passwordPlaceholder}
                  required
                  className={`${inputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember */}
            <div className="flex items-center gap-3">
              <Checkbox
                id="remember"
                checked={rememberDevice}
                onCheckedChange={(c) => setRememberDevice(!!c)}
              />
              <Label htmlFor="remember" className="text-sm text-white/50 cursor-pointer">
                {t.login.rememberDevice}
              </Label>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-xl bg-accent hover:bg-accent/90 text-white font-semibold text-base disabled:opacity-50 transition-all"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : t.login.submit}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
