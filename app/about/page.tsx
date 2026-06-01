import Navbar from "@/components/shared/Navbar"
import Footer from "@/components/shared/Footer"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Users,
  Trophy,
  BookOpen,
  Target,
  Zap,
  Award,
  Calendar,
  MessageSquare,
} from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#070A12] text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative px-4 md:px-8 py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#070A12] z-0"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              <span className="font-involve text-5xl md:text-7xl">QDeb</span>
              <br />
              Дебатная экосистема Казахстана
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Центральная платформа, соединяющая дебатеров, клубы и турниры по
              всему Казахстану
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="px-4 md:px-8 py-16 md:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 rounded-full">
                <Target className="w-5 h-5 text-accent" />
                <span className="text-accent font-semibold">Наша миссия</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">
                Развивать культуру дебатов в Казахстане
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                QDeb создан для того, чтобы объединить дебатное сообщество
                Казахстана в единую экосистему. Мы стремимся сделать дебаты
                доступными для всех, предоставляя инструменты для организации
                турниров, поиска клубов и развития навыков публичных
                выступлений.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                Наша платформа интегрирована с Tabbycat и предоставляет все
                необходимые инструменты для эффективной организации дебатных
                мероприятий и отслеживания прогресса участников.
              </p>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden border border-white/10">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Trophy className="w-24 h-24 text-accent mx-auto" />
                  <p className="text-2xl font-bold">Единая экосистема</p>
                  <p className="text-gray-300">для дебатного сообщества</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 md:px-8 py-16 md:py-20 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              Что мы предлагаем
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Комплексное решение для организации и участия в дебатных
              мероприятиях
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-muted border-white/10 hover:border-accent/50 transition-all">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-xl">Турниры</CardTitle>
                <CardDescription className="text-gray-300">
                  Участвуйте в турнирах или создавайте свои собственные. Полная
                  интеграция с Tabbycat для управления соревнованиями.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-muted border-white/10 hover:border-accent/50 transition-all">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-xl">Дебатные клубы</CardTitle>
                <CardDescription className="text-gray-300">
                  Найдите свой дебатный клуб или зарегистрируйте новый.
                  Расширяйте сообщество и развивайтесь вместе.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-muted border-white/10 hover:border-accent/50 transition-all">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-xl">Рейтинг спикеров</CardTitle>
                <CardDescription className="text-gray-300">
                  Отслеживайте свой прогресс с помощью системы рейтингов ELO.
                  Достигайте новых высот и получайте достижения.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-muted border-white/10 hover:border-accent/50 transition-all">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-xl">Команды</CardTitle>
                <CardDescription className="text-gray-300">
                  Создавайте команды, приглашайте участников и участвуйте в
                  турнирах вместе. Управление командой стало проще.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-4 md:px-8 py-16 md:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Как это работает</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Простой и интуитивный процесс для начала работы с платформой
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold">Зарегистрируйтесь</h3>
              <p className="text-gray-300">
                Создайте аккаунт на платформе QDeb. Заполните профиль с вашими
                данными, которые будут использованы в турнирах и Tabbycat.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold">Найдите клуб или турнир</h3>
              <p className="text-gray-300">
                Изучите доступные дебатные клубы или предстоящие турниры.
                Присоединяйтесь к сообществу или создайте свою команду.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold">Развивайтесь</h3>
              <p className="text-gray-300">
                Участвуйте в турнирах, улучшайте свои навыки, зарабатывайте
                рейтинг и достижения. Отслеживайте свой прогресс в профиле.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="px-4 md:px-8 py-16 md:py-20 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Наши ценности</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                <Zap className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Инновации</h3>
              <p className="text-gray-300">
                Мы постоянно развиваем платформу, внедряя новые функции и
                улучшая пользовательский опыт.
              </p>
            </div>

            <div className="space-y-4 text-center">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                <BookOpen className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Образование</h3>
              <p className="text-gray-300">
                Дебаты — это инструмент развития критического мышления и навыков
                публичных выступлений.
              </p>
            </div>

            <div className="space-y-4 text-center">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                <Users className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Сообщество</h3>
              <p className="text-gray-300">
                Мы верим в силу сообщества и создаем пространство для
                объединения дебатеров по всему Казахстану.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 md:px-8 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-accent/10 to-primary/10 border-accent/30">
            <CardContent className="p-8 md:p-12 text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Присоединяйтесь к сообществу QDeb
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Начните свой путь в мире дебатов уже сегодня. Создайте аккаунт и
                откройте для себя все возможности платформы.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/register"
                  className="px-8 py-3 bg-accent hover:bg-accent/90 text-white font-semibold rounded-lg transition-colors"
                >
                  Зарегистрироваться
                </Link>
                <Link
                  href="/calendar"
                  className="px-8 py-3 border border-white/20 hover:border-accent text-white font-semibold rounded-lg transition-colors"
                >
                  Посмотреть календарь
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section className="px-4 md:px-8 py-16 md:py-20 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Свяжитесь с нами</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              У вас есть вопросы или предложения? Мы всегда рады услышать от
              вас!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                <MessageSquare className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Email</h3>
              <a
                href="mailto:qdebkz@gmail.com"
                className="text-accent hover:underline block"
              >
                qdebkz@gmail.com
              </a>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                <Users className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Telegram</h3>
              <a
                href="https://t.me/qdebkz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline block"
              >
                @qdebkz
              </a>
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
