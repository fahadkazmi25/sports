"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { MatchCard, MatchSkeleton } from "@/components/match-card"
import { motion, AnimatePresence } from "framer-motion"
import { Trophy, Calendar, Filter, ArrowLeft, Clock, Activity, SortAsc, SortDesc, Sparkles } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { cn, slugify } from "@/lib/utils"

export default function LeaguePage() {
    const { slug } = useParams()
    const router = useRouter()
    const searchParams = useSearchParams()
    const currentSort = searchParams.get('sort') || 'time'

    const [matches, setMatches] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [leagueName, setLeagueName] = useState("")

    const leagueLogos: Record<string, string> = {
        "english-premier-league": "/premiere_league-removebg-preview.png",
        "german-bundesliga": "/bundesliga-dark.jpg",
        "romanian-super-liga": "/romanion-league.png",
        "italian-serie-b": "/serie-b.png",
        "coupe-de-france": "/coupe-de-france.png"
    }

    const leagueColors: Record<string, string> = {
        "english-premier-league": "from-[#3d195d] via-[#2a1140] to-[#1a0a29]",
        "german-bundesliga": "from-[#1f1f1f] via-[#121212] to-black",
        "romanian-super-liga": "from-[#002d5e] via-[#001f42] to-[#001229]",
        "italian-serie-b": "from-[#005c30] via-[#003d20] to-[#002915]",
        "coupe-de-france": "from-[#0055a4] via-[#003d7a] to-[#001a33]"
    }

    const currentLogo = leagueLogos[slug as string]
    const currentTheme = leagueColors[slug as string] || "from-slate-900 via-gray-900 to-black"

    useEffect(() => {
        setLoading(true)
        fetch(`/api/matches?league=${slug}&sort=${currentSort}&limit=100`)
            .then(res => res.json())
            .then(data => {
                setMatches(data.matches || [])
                if (data.matches && data.matches.length > 0) {
                    setLeagueName(data.matches[0].league)
                } else {
                    setLeagueName(slug?.toString().split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || "")
                }
                setLoading(false)
            })
            .catch(err => console.error(err))
    }, [slug, currentSort])

    const updateSort = (newSort: string) => {
        const params = new URLSearchParams(searchParams)
        params.set('sort', newSort)
        router.push(`/league/${slug}?${params.toString()}`)
    }

    return (
        <div className="min-h-screen pt-32 pb-20">
            <div className="container mx-auto px-4">
                {/* League Hero Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative h-[400px] md:h-[450px] rounded-[32px] md:rounded-[40px] overflow-hidden mb-12 md:mb-16 shadow-2xl group"
                >
                    <div className={cn(
                        "absolute inset-0 opacity-90 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br",
                        currentTheme
                    )} />

                    {/* Background Decorative Elements */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] -mr-64 -mt-64" />
                        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-black/40 rounded-full blur-[120px] -ml-64 -mb-64" />
                    </div>

                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 md:p-8 z-10">
                        <Link
                            href="/"
                            className="absolute top-6 left-6 md:top-8 md:left-8 flex cursor-pointer items-center gap-2 text-white/70 hover:text-white transition-all text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] glass px-3 py-1.5 md:px-4 md:py-2 rounded-xl z-50"
                        >
                            <ArrowLeft className="w-3.5 h-3.5 md:w-4 h-4" /> Back to Home
                        </Link>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="relative w-full max-w-xs md:max-w-none"
                        >
                            <div className="relative mb-4 md:mb-8">
                                {/* Logo Background Pool for Contrast */}
                                <div className="absolute inset-0 bg-white/10 rounded-full blur-[40px] md:blur-[60px] transform scale-150" />

                                {currentLogo ? (
                                    <div className="relative w-24 h-24 md:w-40 md:h-40 mx-auto transform transition-transform duration-500 drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)]">
                                        <Image
                                            src={currentLogo}
                                            alt={leagueName}
                                            fill
                                            className="object-contain relative z-10"
                                            sizes="(max-width: 768px) 96px, 160px"
                                        />
                                    </div>
                                ) : (
                                    <Trophy className="w-16 h-16 md:w-24 md:h-24 text-white mx-auto drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]" />
                                )}
                            </div>

                            <h1 className="text-3xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-tight drop-shadow-2xl px-4">
                                {leagueName}
                            </h1>
                            <div className="mt-6 md:mt-8 flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4">
                                <div className="glass px-5 py-1.5 md:px-6 md:py-2 rounded-full text-white font-black text-[9px] md:text-[10px] tracking-[0.2em] uppercase border border-white/20 shadow-xl">
                                    PROFESSIONAL LEAGUE
                                </div>
                                <div className="glass px-5 py-1.5 md:px-6 md:py-2 rounded-full text-white font-black text-[9px] md:text-[10px] tracking-[0.2em] uppercase border border-white/20 shadow-xl">
                                    {matches.length} COMPETITIVE FIXTURES
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="absolute -bottom-10 -right-10 text-[120px] md:text-[200px] font-black text-white/5 uppercase italic select-none pointer-events-none whitespace-nowrap tracking-tighter">
                        {leagueName}
                    </div>
                </motion.div>

                {/* Content Section */}
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Advanced Sidebar */}
                    <div className="w-full lg:w-80 space-y-8">
                        <div className="glass p-8 rounded-[32px] border border-white/5 sticky top-32">
                            <div className="flex items-center gap-3 mb-8 text-primary">
                                <Activity className="w-6 h-6" />
                                <span className="font-black uppercase tracking-[0.2em] text-xs">Dynamic Sorting</span>
                            </div>

                            <div className="space-y-3">
                                {[
                                    { id: 'time', label: 'Kickoff Chronology', icon: Clock },
                                    { id: 'home', label: 'Home Team Alpha', icon: SortAsc },
                                    { id: 'away', label: 'Away Team Alpha', icon: SortAsc },
                                ].map((sortOption) => (
                                    <button
                                        key={sortOption.id}
                                        onClick={() => updateSort(sortOption.id)}
                                        className={cn(
                                            "w-full flex cursor-pointer items-center justify-between px-5 py-4 rounded-2xl font-black text-[10px] tracking-[0.15em] uppercase transition-all border",
                                            currentSort === sortOption.id
                                                ? "gradient-sports text-white border-primary shadow-lg"
                                                : "glass hover:bg-muted text-muted-foreground border-transparent"
                                        )}
                                    >
                                        <span className="flex items-center gap-3">
                                            <sortOption.icon className="w-4 h-4" />
                                            {sortOption.label}
                                        </span>
                                        {currentSort === sortOption.id && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                                    </button>
                                ))}
                            </div>

                            <div className="mt-12 pt-8 border-t border-white/5">
                                <div className="flex items-center gap-3 mb-4 text-muted-foreground">
                                    <Calendar className="w-5 h-5" />
                                    <span className="font-black uppercase tracking-[0.2em] text-xs">Season Context</span>
                                </div>
                                <p className="text-[11px] text-muted-foreground leading-relaxed font-bold uppercase tracking-tight opacity-60">
                                    Data synchronized in real-time with global match servers. Kickoff times adjusted to your source timezone settings.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Matches Grid */}
                    <div className="flex-1">
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                            <AnimatePresence mode="popLayout">
                                {loading ? (
                                    Array.from({ length: 6 }).map((_, i) => <MatchSkeleton key={i} />)
                                ) : matches.length > 0 ? (
                                    matches.map((match, i) => (
                                        <MatchCard key={i} match={match} index={i} />
                                    ))
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="col-span-full py-32 text-center glass rounded-[40px] border border-dashed border-white/10"
                                    >
                                        <Activity className="w-12 h-12 text-muted-foreground/20 mx-auto mb-6" />
                                        <h3 className="text-3xl font-black uppercase italic mb-3 tracking-tighter">No Active Fixtures</h3>
                                        <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Check back later for seasonal updates.</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
