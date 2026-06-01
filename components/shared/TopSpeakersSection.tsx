"use client"

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

type SpeakerRating = {
    speakerId: number
    speakerName: string
    teamName: string
    rating: number
    roundsPlayed: number
    avgSpeech: number
}

const rankColors = [
    { number: "text-[#df9f20]", bg: "border-[#df9f20]/30" },
    { number: "text-[#bfbfbf]", bg: "border-[#bfbfbf]/30" },
    { number: "text-[#b98046]", bg: "border-[#b98046]/30" },
]

const TopSpeakersSection = () => {
    const [speakers, setSpeakers] = useState<SpeakerRating[]>([])
    const { t } = useLanguage()

    useEffect(() => {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || "/api"
        fetch(`${apiBase}/rating/speakers`, { cache: "no-store" })
            .then(r => r.ok ? r.json() : [])
            .then(data => setSpeakers(Array.isArray(data) ? data.slice(0, 10) : []))
            .catch(() => {})
    }, [])

    return (
        <section className="my-24 mx-4 md:mx-10 xl:mx-19">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">{t.home.topSpeakers}</h1>
                <Link href="/rating" className="text-sm text-gray-400 hover:text-white transition-colors">
                    {t.home.fullRating}
                </Link>
            </div>

            {speakers.length === 0 ? (
                <p className="text-gray-500 text-center py-8">{t.common.noData}</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    {speakers.map((speaker, index) => {
                        const rank = index + 1
                        const color = rankColors[index] ?? { number: "text-white/60", bg: "border-white/10" }
                        return (
                            <div
                                key={speaker.speakerId}
                                className={`bg-primary border ${color.bg} rounded-xl p-4 flex flex-col gap-2 relative`}
                            >
                                <span className={`text-3xl font-black leading-none ${color.number} opacity-80`}>
                                    {rank}
                                </span>
                                <div className="font-semibold text-sm leading-tight">{speaker.speakerName}</div>
                                <div className="text-xs text-gray-500 truncate">{speaker.teamName}</div>
                                <div className="flex gap-3 mt-1">
                                    <div>
                                        <div className="text-sm font-bold">{speaker.rating.toFixed(0)}</div>
                                        <div className="text-[10px] text-gray-500">ELO</div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold">{speaker.avgSpeech.toFixed(1)}</div>
                                        <div className="text-[10px] text-gray-500">{t.rating.avgSpeech}</div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </section>
    )
}

export default TopSpeakersSection
