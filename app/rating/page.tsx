"use client"

import { useState, useMemo, useEffect } from "react"
import Navbar from "@/components/shared/Navbar"
import Image from "next/image"
import { Search, Filter, ArrowUpRight, X } from "lucide-react"

type Speaker = {
  id: string
  name: string
  image: string
  avg_speech: number
  elo: number
  num_tournaments: number
  organization?: string
  achievements?: string[]
}

type SortOption = "elo" | "avg_speech" | "num_tournaments"

type ToastType = "success" | "info" | "warning" | "error"

interface Toast {
  id: string
  message: string
  type: ToastType
}

export default function RatingPage() {
  const [speakers, setSpeakers] = useState<Speaker[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [appliedSearchQuery, setAppliedSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("elo")
  const [isLoading, setIsLoading] = useState(true)
  const [toasts, setToasts] = useState<Toast[]>([])

  // Toast functions
  const addToast = (message: string, type: ToastType = "info") => {
    const id = Date.now().toString()
    const newToast: Toast = { id, message, type }
    setToasts((prev) => [...prev, newToast])

    // Auto remove toast after 3 seconds
    setTimeout(() => {
      removeToast(id)
    }, 3000)
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  // Load speakers data
  useEffect(() => {
    const loadSpeakers = async () => {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || "/api"
        const res = await fetch(`${apiBase}/rating/speakers`, { cache: "no-store" })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data: Array<{
          speakerId: number
          speakerName: string
          teamName: string
          rating: number
          roundsPlayed: number
        }> = await res.json()
        setSpeakers(data.map(s => ({
          id: String(s.speakerId),
          name: s.speakerName,
          image: "/assets/Qback.svg",
          avg_speech: s.avgSpeech,
          elo: s.rating,
          num_tournaments: s.roundsPlayed,
          organization: s.teamName,
        })))
      } catch (error) {
        console.error("Error loading speakers:", error)
        addToast("Ошибка при загрузке данных спикеров", "error")
      } finally {
        setIsLoading(false)
      }
    }

    loadSpeakers()
  }, [])

  // Sort all speakers first to get consistent rankings
  const sortedSpeakers = useMemo(() => {
    return [...speakers].sort((a, b) => {
      switch (sortBy) {
        case "elo":
          return b.elo - a.elo
        case "avg_speech":
          return b.avg_speech - a.avg_speech
        case "num_tournaments":
          return b.num_tournaments - a.num_tournaments
        default:
          return 0
      }
    })
  }, [speakers, sortBy])

  // Get stable top 3 and others
  const stableTop3 = sortedSpeakers.slice(0, 3)
  const othersSpeakers = sortedSpeakers.slice(3)

  // Filter others based on search (case-insensitive) - DESKTOP ONLY
  const filteredOthersSpeakers = useMemo(() => {
    if (!appliedSearchQuery.trim()) {
      return othersSpeakers
    }

    return othersSpeakers.filter((speaker) =>
      speaker.name.toLowerCase().includes(appliedSearchQuery.toLowerCase())
    )
  }, [othersSpeakers, appliedSearchQuery])

  // Filter ALL speakers for mobile (including top 3)
  const filteredAllSpeakers = useMemo(() => {
    if (!appliedSearchQuery.trim()) {
      return sortedSpeakers
    }

    return sortedSpeakers.filter((speaker) =>
      speaker.name.toLowerCase().includes(appliedSearchQuery.toLowerCase())
    )
  }, [sortedSpeakers, appliedSearchQuery])

  // Function to get speaker's actual rank in full sorted list
  const getSpeakerRank = (speakerId: string) => {
    const index = sortedSpeakers.findIndex(
      (speaker) => speaker.id === speakerId
    )
    return index + 1 // Convert to 1-based ranking
  }

  const handleApplyFilters = () => {
    setAppliedSearchQuery(searchQuery)

    const searchText = searchQuery.trim() ? `"${searchQuery}"` : "не указан"
    const sortText = getSortLabel(sortBy)

    addToast(
      `Фильтры применены: поиск ${searchText}, сортировка ${sortText}`,
      "success"
    )
  }

  const handleClearSearch = () => {
    setSearchQuery("")
    setAppliedSearchQuery("")
    addToast("Поиск очищен", "info")
  }

  const getSortLabel = (sort: SortOption) => {
    switch (sort) {
      case "elo":
        return "по ELO"
      case "avg_speech":
        return "по среднему баллу"
      case "num_tournaments":
        return "по количеству турниров"
      default:
        return "по ELO"
    }
  }

  const getToastColors = (type: ToastType) => {
    switch (type) {
      case "success":
        return "bg-green-600 border-green-500"
      case "error":
        return "bg-red-600 border-red-500"
      case "warning":
        return "bg-yellow-600 border-yellow-500"
      case "info":
      default:
        return "bg-blue-600 border-blue-500"
    }
  }

  const gradients = [
    "from-[rgba(223,159,32,0)] to-[rgba(223,159,32,0.45)]",
    "from-[rgba(191,191,191,0)] to-[rgba(191,191,191,0.45)]",
    "from-[rgba(185,128,70,0)] to-[rgba(185,128,70,0.45)]",
  ]

  const podiumOrder = [1, 0, 2]

  const getRankData = (position: number) => {
    switch (position) {
      case 0:
        return {
          numberColor: "text-[#df9f20]",
          borderColor: "border-[#df9f20]",
          scale: "scale-110",
        }
      case 1:
        return {
          numberColor: "text-[#bfbfbf]",
          borderColor: "border-[#bfbfbf]",
          scale: "scale-100",
        }
      case 2:
        return {
          numberColor: "text-[#b98046]",
          borderColor: "border-[#b98046]",
          scale: "scale-100",
        }
      default:
        return {}
    }
  }

  const getRankStyling = (position: number) => {
    switch (position) {
      case 0:
        return {
          bgGradient: "from-[rgba(223,159,32,0)] to-[rgba(223,159,32,0.45)]",
          numberColor: "text-[#df9f20]",
          borderColor: "border-[#df9f20]",
        }
      case 1:
        return {
          bgGradient: "from-[rgba(191,191,191,0)] to-[rgba(191,191,191,0.45)]",
          numberColor: "text-[#bfbfbf]",
          borderColor: "border-[#bfbfbf]",
        }
      case 2:
        return {
          bgGradient: "from-[rgba(185,128,70,0)] to-[rgba(185,128,70,0.45)]",
          numberColor: "text-[#b98046]",
          borderColor: "border-[#b98046]",
        }
      default:
        return {
          bgGradient: "",
          numberColor: "text-white",
          borderColor: "border-gray-600",
        }
    }
  }

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="bg-background min-h-screen text-white pt-16 flex items-center justify-center">
          <div className="text-xl">Загрузка...</div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />

      {/* Toast Container */}
      <div className="fixed top-20 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              ${getToastColors(toast.type)} 
              text-white px-4 py-3 rounded-lg shadow-lg border-l-4 
              flex items-center justify-between min-w-80 max-w-96
              animate-in slide-in-from-right duration-300
            `}
          >
            <span className="text-sm font-medium">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-2 hover:bg-white hover:bg-opacity-20 rounded p-1 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-background min-h-screen text-white ">
        {/* Desktop: Top 3 Podium */}
        <div className="hidden lg:flex justify-center items-end gap-0 px-4 pb-20">
          {podiumOrder.map((position) => {
            const speaker = stableTop3[position]
            if (!speaker) return null

            const rankData = getRankData(position)
            const gradient = gradients[position]
            const isFirst = position === 0

            return (
              <div
                key={speaker.id}
                className={`relative ${rankData.scale} transition-all duration-300 mx-6`}
              >
                {/* Large background number */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div
                    className={`text-[200px] font-black ${rankData.numberColor} opacity-30 leading-none select-none -mt-8`}
                  >
                    #{position + 1}
                  </div>
                </div>

                {/* Card */}
                <div
                  className={`
                  relative bg-gradient-to-b ${gradient} 
                  rounded-2xl p-8 w-80 text-center z-10
                  ${isFirst ? "transform -translate-y-6" : ""}
                `}
                >
                  {/* Avatar */}
                  <div
                    className={`
                    relative mb-6 rounded-full overflow-hidden mx-auto
                    border-4 ${rankData.borderColor}
                    ${isFirst ? "w-32 h-32" : "w-28 h-28"}
                  `}
                  >
                    <Image
                      src={speaker.image}
                      alt={speaker.name}
                      width={isFirst ? 128 : 112}
                      height={isFirst ? 128 : 112}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  {/* Name */}
                  <h2
                    className={`font-bold mb-2 ${
                      isFirst ? "text-2xl" : "text-xl"
                    }`}
                  >
                    {speaker.name}
                  </h2>

                  {/* Average Score */}
                  <div className="mb-4">
                    <div className="text-gray-300 text-sm">
                      Средний балл - {speaker.avg_speech.toFixed(1)}
                    </div>
                  </div>

                  <div className="text-sm text-gray-300">
                    <div>{speaker.organization}</div>
                    <div className="text-gray-400 mt-1">{speaker.num_tournaments} раундов сыграно</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Mobile: Integrated Top 3 + All Speakers List */}
        <div className="lg:hidden">
          <div className="max-w-6xl mx-auto px-4 pb-12">
            {/* Section Header */}
            <div className="flex flex-col items-start justify-between mb-8 gap-4">
              <h2 className="text-2xl font-bold">Рейтинг спикеров</h2>

              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Поиск по имени спикера"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleApplyFilters()
                    }
                    className="bg-background border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 w-full"
                  />
                  {appliedSearchQuery && (
                    <button
                      onClick={handleClearSearch}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-background border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="elo">Сортировать по ELO</option>
                  <option value="avg_speech">
                    Сортировать по среднему баллу
                  </option>
                  <option value="num_tournaments">
                    Сортировать по турнирам
                  </option>
                </select>

                <button
                  onClick={handleApplyFilters}
                  className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Применить фильтры
                </button>
              </div>
            </div>

            {/* Current filters display */}
            {appliedSearchQuery && (
              <div className="mb-4 flex items-center gap-2">
                <span className="text-sm text-gray-400">Активный поиск:</span>
                <div className="bg-blue-600 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
                  {appliedSearchQuery}
                  <button
                    onClick={handleClearSearch}
                    className="hover:bg-blue-700 rounded p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

            {/* Mobile List: Show filtered speakers (including top 3 when no search) */}
            <div className="space-y-3">
              {filteredAllSpeakers.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  Спикеры не найдены
                </div>
              ) : (
                filteredAllSpeakers.map((speaker: Speaker) => {
                  const actualRank = getSpeakerRank(speaker.id)
                  const isTop3 = actualRank <= 3
                  const styling = isTop3
                    ? getRankStyling(actualRank - 1)
                    : {
                        bgGradient: "",
                        numberColor: "text-white",
                        borderColor: "border-gray-600",
                      }

                  return (
                    <div
                      key={speaker.id}
                      className={`
                        ${
                          isTop3
                            ? `bg-gradient-to-r ${styling.bgGradient} border-2 ${styling.borderColor}`
                            : "bg-primary border border-gray-700"
                        }
                        hover:bg-[#1a1d29] rounded-xl p-4 transition-all duration-200 group cursor-pointer relative
                      `}
                    >
                      {/* Rank number */}
                      <div className="absolute top-3 left-4 z-10">
                        <div
                          className={`
                          text-3xl font-black opacity-80 leading-none
                          ${styling.numberColor}
                        `}
                        >
                          {actualRank}
                        </div>
                      </div>

                      <div className="flex flex-col gap-4 ml-12">
                        <div className="flex items-center gap-4 flex-1">
                          {/* Avatar */}
                          <div
                            className={`
                            rounded-full overflow-hidden ${
                              isTop3
                                ? `border-2 ${styling.borderColor} w-16 h-16`
                                : "w-12 h-12"
                            }
                          `}
                          >
                            <Image
                              src={speaker.image}
                              alt={speaker.name}
                              width={isTop3 ? 64 : 48}
                              height={isTop3 ? 64 : 48}
                              className="object-cover w-full h-full"
                            />
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div
                              className={`font-semibold mb-1 truncate ${
                                isTop3 ? "text-lg" : "text-base"
                              }`}
                            >
                              {speaker.name}
                            </div>
                            <div className="text-xs text-gray-400 flex flex-col gap-1">
                              <div className="bg-gray-700 rounded px-2 py-1 text-xs inline-block w-fit">
                                {speaker.organization || "—"}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-between text-center">
                          <div>
                            <div
                              className={`font-bold ${
                                isTop3 ? "text-lg" : "text-base"
                              }`}
                            >
                              {speaker.elo.toFixed(1)}
                            </div>
                            <div className="text-xs text-gray-400">ELO</div>
                          </div>
                          <div>
                            <div
                              className={`font-bold ${
                                isTop3 ? "text-lg" : "text-base"
                              }`}
                            >
                              {speaker.avg_speech.toFixed(1)}
                            </div>
                            <div className="text-xs text-gray-400">
                              Средний балл
                            </div>
                          </div>
                          <div>
                            <div
                              className={`font-bold ${
                                isTop3 ? "text-lg" : "text-base"
                              }`}
                            >
                              {speaker.num_tournaments}
                            </div>
                            <div className="text-xs text-gray-400">Турниры</div>
                          </div>
                        </div>

                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>

        {/* Desktop: All Speakers Section (excluding top 3) */}
        <div className="hidden lg:block max-w-6xl mx-auto px-6 pb-6">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Все спикеры</h2>

            {/* Search and Filter */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Поиск по имени (только среди спикеров ниже топ-3)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleApplyFilters()}
                  className="bg-background border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 w-80"
                />
                {appliedSearchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-background border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="elo">Сортировать по ELO</option>
                <option value="avg_speech">
                  Сортировать по среднему баллу
                </option>
                <option value="num_tournaments">Сортировать по турнирам</option>
              </select>

              <button
                onClick={handleApplyFilters}
                className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Применить фильтры
              </button>
            </div>
          </div>

          {/* Current filters display */}
          {appliedSearchQuery && (
            <div className="mb-6 flex items-center gap-2">
              <span className="text-sm text-gray-400">Активный поиск:</span>
              <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                {appliedSearchQuery}
                <button
                  onClick={handleClearSearch}
                  className="hover:bg-blue-700 rounded-full p-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* Speakers List (filtered others) */}
          <div className="space-y-3">
            {filteredOthersSpeakers.length === 0 && appliedSearchQuery ? (
              <div className="text-center py-8 text-gray-400">
                Спикеры не найдены среди мест 4+
              </div>
            ) : filteredOthersSpeakers.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                {/* Нет других спикеров */}
                <span className="text-red-500 block">
                  Эта функция находиться на стадии разработки
                </span>
              </div>
            ) : (
              filteredOthersSpeakers.map((speaker: Speaker) => {
                const actualRank = getSpeakerRank(speaker.id)

                return (
                  <div
                    key={speaker.id}
                    className="bg-primary hover:bg-[#1a1d29] rounded-xl p-6 transition-all duration-200 group cursor-pointer relative"
                  >
                    {/* Rank number - show actual rank */}
                    <div className="absolute top-6 left-6">
                      <div className="text-6xl font-black text-white opacity-80 leading-none">
                        {actualRank}
                      </div>
                    </div>

                    <div className="flex items-center justify-between ml-20">
                      <div className="flex items-center gap-6">
                        {/* Avatar */}
                        <div className="w-16 h-16 rounded-full overflow-hidden">
                          <Image
                            src={speaker.image}
                            alt={speaker.name}
                            width={64}
                            height={64}
                            className="object-cover w-full h-full"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                          <div className="font-semibold text-xl mb-1">
                            {speaker.name}
                          </div>
                          <div className="text-sm text-gray-400 flex items-center gap-1">
                            <div className="bg-gray-700 rounded px-2 py-1 text-xs">
                              {speaker.organization || "—"}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-12 text-center">
                        <div>
                          <div className="text-2xl font-bold">
                            {speaker.elo.toFixed(1)}
                          </div>
                          <div className="text-sm text-gray-400">ELO</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold">
                            {speaker.avg_speech.toFixed(1)}
                          </div>
                          <div className="text-sm text-gray-400">
                            Средний балл
                          </div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold">
                            {speaker.num_tournaments}
                          </div>
                          <div className="text-sm text-gray-400">
                            Кол-во турниров
                          </div>
                        </div>
                      </div>

                      <div className="text-gray-400 group-hover:text-white transition-colors ml-6">
                        <ArrowUpRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </>
  )
}
