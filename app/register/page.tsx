"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { X, Eye, EyeOff, AlertTriangle, Upload, User } from "lucide-react"
import Link from "next/link"
import { Toaster, toast } from "react-hot-toast"
import { useLanguage } from "@/contexts/LanguageContext"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4232/api"

export default function RegisterPage() {
  const router = useRouter()
  const { t } = useLanguage()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [full_name, setFull_name] = useState("")
  const [phone, setPhone] = useState("")
  const [avatar, setAvatar] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [emailTouched, setEmailTouched] = useState(false)
  const [passwordTouched, setPasswordTouched] = useState(false)
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false)
  const [isAgreedWithPolicy, setIsAgreedWithPolicy] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [username, setUsername] = useState("")
  const [gender, setGender] = useState<"M" | "F" | "O">("O")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatar(file)
      setPreview(URL.createObjectURL(file))
    } else {
      setAvatar(null)
      setPreview(null)
    }
  }

  const validateEmail = (email: string) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)

  const validatePassword = (password: string) =>
    /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])(?=.{8,})(?!.*[^a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).*$/.test(password)

  const validatePhone = (phone: string) => /^\+7\d{10}$/.test(phone)
  const validateFullName = (name: string) => name.trim().split(/\s+/).length >= 2

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateEmail(email)) { toast.error(t.register.invalidEmail); return }
    if (!validatePassword(password)) { toast.error(t.register.weakPassword); return }
    if (password !== confirmPassword) { toast.error(t.register.passwordsMismatch); return }
    if (!validateFullName(full_name)) { toast.error(t.register.enterFullName); return }
    if (!validatePhone(phone)) { toast.error(t.register.invalidPhone); return }

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append("register", JSON.stringify({ username, email, password, fullName: full_name, gender, phone, description: "Hello!" }))
      if (avatar) formData.append("profilePicture", avatar)

      const res = await fetch(`${API_URL}/auth/signup`, { method: "POST", body: formData, credentials: "include" })

      if (!res.ok) {
        let message = t.register.registerError
        try {
          const ct = res.headers.get("content-type") || ""
          if (ct.includes("application/json")) {
            const err: any = await res.json()
            if (err?.errors) message = Object.entries(err.errors).map(([f, m]) => `${f}: ${m}`).join("; ")
            else if (err?.error) message = String(err.error)
            else if (err?.message) message = String(err.message)
          } else {
            const text = await res.text()
            if (text) message = text
          }
        } catch {}
        throw new Error(message)
      }

      toast.success(t.register.registerSuccess)
      router.push("/login")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t.register.connectionError)
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
            <h1 className="text-3xl font-bold mb-1">{t.register.title}</h1>
            <p className="text-white/40 text-sm">{t.register.haveAccount} <Link href="/login" className="text-accent hover:underline">{t.register.loginLink}</Link></p>
          </div>

          {/* Warning */}
          <div className="flex gap-3 bg-amber-500/8 border border-amber-500/20 rounded-xl px-4 py-3 mb-8">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-300/80 leading-relaxed">
              {t.register.dataWarning}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name + Username */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm text-white/60">{t.register.fullName}</Label>
                <Input value={full_name} onChange={(e) => setFull_name(e.target.value)} placeholder={t.register.fullNamePlaceholder} required className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm text-white/60">{t.register.nickname}</Label>
                <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" required className={inputClass} />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label className="text-sm text-white/60">{t.register.email}</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => setEmailTouched(true)} placeholder="example@gmail.com" required className={inputClass} />
              {emailTouched && !validateEmail(email) && (
                <p className="text-red-400 text-xs">{t.register.invalidEmailInline}</p>
              )}
            </div>

            {/* Gender */}
            <div className="space-y-1.5">
              <Label className="text-sm text-white/60">{t.register.gender}</Label>
              <div className="flex rounded-xl overflow-hidden border border-white/10 bg-white/5 w-fit">
                {(["M", "F", "O"] as const).map((g, i) => (
                  <button key={g} type="button" onClick={() => setGender(g)}
                    className={`px-5 py-2 text-sm font-medium transition-colors ${i > 0 ? "border-l border-white/10" : ""} ${gender === g ? "bg-accent text-white" : "text-white/50 hover:text-white hover:bg-white/5"}`}>
                    {g === "M" ? t.register.male : g === "F" ? t.register.female : t.register.other}
                  </button>
                ))}
              </div>
            </div>

            {/* Password */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm text-white/60">{t.register.password}</Label>
                <div className="relative">
                  <Input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} onBlur={() => setPasswordTouched(true)} placeholder={t.register.passwordPlaceholder} required className={`${inputClass} pr-10`} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {passwordTouched && !validatePassword(password) && (
                  <p className="text-red-400 text-xs">{t.register.weakPasswordInline}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm text-white/60">{t.register.confirm}</Label>
                <div className="relative">
                  <Input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} onBlur={() => setConfirmPasswordTouched(true)} placeholder={t.register.confirmPlaceholder} required className={`${inputClass} pr-10`} />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {confirmPasswordTouched && password !== confirmPassword && (
                  <p className="text-red-400 text-xs">{t.register.passwordsMismatchInline}</p>
                )}
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <Label className="text-sm text-white/60">{t.register.phone}</Label>
              <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+77XXXXXXXXX" className={inputClass} />
            </div>

            {/* Avatar */}
            <div className="space-y-1.5">
              <Label className="text-sm text-white/60">{t.register.profilePhoto} <span className="text-white/30">{t.register.optional}</span></Label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 group-hover:border-accent/50 transition-colors overflow-hidden flex items-center justify-center flex-shrink-0">
                  {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-5 h-5 text-white/30" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-white/40 group-hover:text-white/60 transition-colors">
                  <Upload className="w-4 h-4" />
                  <span>{avatar ? avatar.name : t.register.uploadPhoto}</span>
                </div>
                <Input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            </div>

            {/* Agreement */}
            <div className="flex items-center gap-3">
              <Checkbox id="policy" checked={isAgreedWithPolicy} onCheckedChange={(c) => setIsAgreedWithPolicy(!!c)} />
              <Label htmlFor="policy" className="text-sm text-white/50 cursor-pointer">
                {t.register.agree}{" "}
                <Link href="/privacy-policy" className="text-accent hover:underline">{t.register.termsLink}</Link>
              </Label>
            </div>

            {/* Submit */}
            <Button type="submit" disabled={isLoading || !isAgreedWithPolicy}
              className="w-full h-12 rounded-xl bg-accent hover:bg-accent/90 text-white font-semibold text-base disabled:opacity-50 transition-all">
              {isLoading ? (
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : t.register.submit}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
