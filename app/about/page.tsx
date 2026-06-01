"use client"

import Navbar from "@/components/shared/Navbar"
import Footer from "@/components/shared/Footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Trophy, BookOpen, Target, Zap, Award, Calendar, MessageSquare } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/LanguageContext"

export default function AboutPage() {
  const { t, lang } = useLanguage()
  const a = t.about

  return (
    <div className="min-h-screen bg-[#070A12] text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative px-4 md:px-8 py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#070A12] z-0" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              <span className="font-involve text-5xl md:text-7xl">QDeb</span>
              <br />
              {a.heroTitle}
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">{a.heroSubtitle}</p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="px-4 md:px-8 py-16 md:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 rounded-full">
                <Target className="w-5 h-5 text-accent" />
                <span className="text-accent font-semibold">{a.missionLabel}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">{a.missionTitle}</h2>
              <p className="text-lg text-gray-300 leading-relaxed">{a.missionText1}</p>
              <p className="text-lg text-gray-300 leading-relaxed">{a.missionText2}</p>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden border border-white/10">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Trophy className="w-24 h-24 text-accent mx-auto" />
                  <p className="text-2xl font-bold">{a.ecosystem}</p>
                  <p className="text-gray-300">{a.ecosystemSub}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 md:px-8 py-16 md:py-20 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">{a.featuresTitle}</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">{a.featuresSubtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Calendar, title: a.feature1Title, desc: a.feature1Desc },
              { icon: Users, title: a.feature2Title, desc: a.feature2Desc },
              { icon: Award, title: a.feature3Title, desc: a.feature3Desc },
              { icon: MessageSquare, title: a.feature4Title, desc: a.feature4Desc },
            ].map(({ icon: Icon, title, desc }) => (
              <Card key={title} className="bg-muted border-white/10 hover:border-accent/50 transition-all">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <CardTitle className="text-xl">{title}</CardTitle>
                  <CardDescription className="text-gray-300">{desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 md:px-8 py-16 md:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">{a.howTitle}</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">{a.howSubtitle}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { n: "1", title: a.step1Title, desc: a.step1Desc },
              { n: "2", title: a.step2Title, desc: a.step2Desc },
              { n: "3", title: a.step3Title, desc: a.step3Desc },
            ].map(({ n, title, desc }) => (
              <div key={n} className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto text-2xl font-bold">{n}</div>
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="text-gray-300">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="px-4 md:px-8 py-16 md:py-20 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">{a.valuesTitle}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: a.value1Title, desc: a.value1Desc },
              { icon: BookOpen, title: a.value2Title, desc: a.value2Desc },
              { icon: Users, title: a.value3Title, desc: a.value3Desc },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="space-y-4 text-center">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                  <Icon className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="text-gray-300">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 md:px-8 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-accent/10 to-primary/10 border-accent/30">
            <CardContent className="p-8 md:p-12 text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">{a.ctaTitle}</h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">{a.ctaSubtitle}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register" className="px-8 py-3 bg-accent hover:bg-accent/90 text-white font-semibold rounded-lg transition-colors">
                  {a.ctaRegister}
                </Link>
                <Link href="/calendar" className="px-8 py-3 border border-white/20 hover:border-accent text-white font-semibold rounded-lg transition-colors">
                  {a.ctaCalendar}
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact */}
      <section className="px-4 md:px-8 py-16 md:py-20 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">{lang === "kk" ? "Бізбен байланысыңыз" : "Свяжитесь с нами"}</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              {lang === "kk" ? "Сұрақтарыңыз бар ма? Біз сізден естуге қуаныштымыз!" : "У вас есть вопросы или предложения? Мы всегда рады услышать от вас!"}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                <MessageSquare className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Email</h3>
              <a href="mailto:qdebkz@gmail.com" className="text-accent hover:underline block">qdebkz@gmail.com</a>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                <Users className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Telegram</h3>
              <a href="https://t.me/qdebkz" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline block">@qdebkz</a>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                <Trophy className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Tabbycat</h3>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
