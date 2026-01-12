"use client"

import React, { useEffect, useState, Suspense } from "react"
import { useParams, useRouter } from "next/navigation"
import { MatchSkeleton } from "@/components/match-card"
import { motion, AnimatePresence } from "framer-motion"
import { Trophy, Calendar, Clock, ArrowLeft, Activity, MapPin, Shield, Zap, Share2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { cn, slugify } from "@/lib/utils"
import { TOP_LEAGUES } from "@/lib/constants"

function MatchPageContent() {
    const { league: leagueSlug, slug } = useParams()
    const router = useRouter()
    const [match, setMatch] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    // Extract timestamp from slug (it's the last part after the last dash)
    const parts = (slug as string || "").split('-')
    const ts = parseInt(parts[parts.length - 1])

    useEffect(() => {
        const fetchMatch = async () => {
            setLoading(true)
            try {
                // Fetch more matches to ensure we find the right one
                const res = await fetch(`/api/matches?limit=1000`)
                const data = await res.json()

                const foundMatch = data.matches?.find((m: any) => {
                    const mLeagueSlug = slugify(m.league || 'match')
                    return mLeagueSlug === leagueSlug && m.ts === ts
                })

                if (foundMatch) {
                    setMatch(foundMatch)
                }
            } catch (err) {
                console.error("Error fetching match:", err)
            } finally {
                setLoading(false)
            }
        }

        if (leagueSlug && slug) {
            fetchMatch()
        }
    }, [leagueSlug, slug, ts])

    const leagueInfo = TOP_LEAGUES.find(l => slugify(l.name) === leagueSlug)
    const currentTheme = leagueInfo?.color || "from-slate-900 via-gray-900 to-black"
    const currentLogo = leagueInfo?.logo

    const getInitials = (name: string) =>
        (name || '').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?'

    // Match status logic (same as MatchCard)
    const now = Math.floor(Date.now() / 1000)
    const derivedStatus = match?.status || (match?.ts && now >= match.ts && now <= match.ts + 7200 ? 'LIVE' : (match?.ts && now > match.ts + 7200 ? 'FINISHED' : 'UPCOMING'))

    if (loading) {
        return (
            <div className="min-h-screen pt-32 pb-20 container mx-auto px-4">
                <MatchSkeleton />
            </div>
        )
    }

    if (!match) {
        return (
            <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center text-center px-4">
                <Activity className="w-16 h-16 text-muted-foreground/20 mb-6" />
                <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-4">Match Not Found</h2>
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-sm mb-8">The fixture you are looking for does not exist or has been moved.</p>
                <Link href="/" className="glass px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary/10 transition-all border border-white/5">
                    Return to Home
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-32 pb-20">
            <div className="container mx-auto px-4">
                {/* Match Hero Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative min-h-[700px] md:h-[600px] lg:h-[550px] rounded-[32px] md:rounded-[48px] overflow-hidden mb-10 md:mb-20 shadow-2xl group flex flex-col"
                >
                    <div className={cn(
                        "absolute inset-0 opacity-90 transition-opacity duration-700 bg-gradient-to-br",
                        currentTheme
                    )} />

                    {/* Background Decorative Elements */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-white/5 rounded-full blur-[80px] md:blur-[120px] -mr-32 -mt-32 md:-mr-64 md:-mt-64" />
                        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-black/40 rounded-full blur-[80px] md:blur-[120px] -ml-32 -mb-32 md:-ml-64 md:-mb-64" />
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 md:opacity-10 mix-blend-overlay" />
                    </div>

                    <div className="relative flex-1 flex flex-col z-10">
                        {/* Top Navigation */}
                        <div className="p-5 md:p-10 flex items-center justify-between">
                            <Link
                                href="/"
                                className="flex cursor-pointer items-center gap-2 text-white/70 hover:text-white transition-all text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] glass px-3 py-1.5 md:px-4 md:py-2 rounded-xl"
                            >
                                <ArrowLeft className="w-3.5 h-3.5 md:w-4 h-4" /> <span className="hidden xs:inline">Back to Fixtures</span><span className="xs:hidden">Back</span>
                            </Link>

                            {/* <div className="flex items-center gap-4">
                                <button className="glass p-2.5 rounded-xl text-white/70 hover:text-white transition-all">
                                    <Share2 className="w-4 h-4" />
                                </button>
                            </div> */}
                        </div>

                        {/* Main Match Display */}
                        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-6 md:py-0">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="w-full max-w-5xl"
                            >
                                {/* League Context */}
                                <div className="flex items-center justify-center gap-2 md:gap-3 mb-6 md:mb-12">
                                    {currentLogo ? (
                                        <div className="relative w-6 h-6 md:w-10 md:h-10">
                                            <Image src={currentLogo} alt={match.league} fill className="object-contain" />
                                        </div>
                                    ) : (
                                        <Trophy className="w-4 h-4 md:w-6 md:h-6 text-white/80" />
                                    )}
                                    <span className="text-white/80 font-black text-[8px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] font-tourney">
                                        {match.league}
                                    </span>
                                </div>

                                {/* Teams & Score */}
                                <div className="flex flex-col md:grid md:grid-cols-[1fr_auto_1fr] gap-8 md:gap-16 items-center">
                                    {/* Home Team */}
                                    <motion.div
                                        // whileHover={{ y: -5 }}
                                        className="flex flex-col items-center gap-3 md:gap-6 order-2 md:order-1"
                                    >
                                        <div className="w-20 h-20 md:w-40 md:h-40 rounded-[2rem] md:rounded-[2.5rem] bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl flex items-center justify-center relative transition-transform duration-500">
                                            <span className="font-tourney font-black text-3xl md:text-6xl text-white drop-shadow-2xl">
                                                {getInitials(match.home)}
                                            </span>
                                            <div className="absolute -bottom-2 md:-bottom-3 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-primary text-white text-[8px] md:text-[9px] font-black uppercase tracking-widest shadow-lg">Home</div>
                                        </div>
                                        <h2 className="text-xl md:text-4xl lg:text-5xl font-black text-white uppercase italic tracking-tighter leading-tight drop-shadow-xl line-clamp-2 max-w-[200px] md:max-w-none">
                                            {match.home}{" "}
                                        </h2>
                                    </motion.div>

                                    {/* VS / SCORE */}
                                    <div className="flex flex-col items-center gap-4 order-1 md:order-2">
                                        {derivedStatus === 'UPCOMING' ? (
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-white/20 blur-2xl md:blur-3xl rounded-full" />
                                                <span className="relative text-4xl md:text-8xl font-black font-tourney text-white/30 md:text-white/20 italic">VS</span>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 md:gap-4">
                                                <div className="flex items-center justify-center gap-4 md:gap-10">
                                                    <span className="text-5xl md:text-9xl font-black font-tourney text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">{match.score?.home ?? 0}</span>
                                                    <span className="text-white/30 text-2xl md:text-6xl font-black italic">:</span>
                                                    <span className="text-5xl md:text-9xl font-black font-tourney text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">{match.score?.away ?? 0}</span>
                                                </div>
                                                {derivedStatus === 'LIVE' && (
                                                    <div className="flex items-center gap-1.5 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-red-500 text-white shadow-lg shadow-red-500/50 animate-pulse">
                                                        <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white" />
                                                        <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em]">Live Match</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        <div className="glass px-4 py-1.5 md:px-6 md:py-2 rounded-full text-white/90 font-black text-[8px] md:text-[10px] tracking-[0.2em] uppercase border border-white/10 mt-2 md:mt-4">
                                            {match.time_display || match.time}
                                        </div>
                                    </div>

                                    {/* Away Team */}
                                    <motion.div
                                        // whileHover={{ y: -5 }}
                                        className="flex flex-col items-center gap-3 md:gap-6 order-3"
                                    >
                                        <div className="w-20 h-20 md:w-40 md:h-40 rounded-[2rem] md:rounded-[2.5rem] bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl flex items-center justify-center relative transition-transform duration-500">
                                            <span className="font-tourney font-black text-3xl md:text-6xl text-white drop-shadow-2xl">
                                                {getInitials(match.away)}
                                            </span>
                                            <div className="absolute -bottom-2 md:-bottom-3 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-orange-500 text-white text-[8px] md:text-[9px] font-black uppercase tracking-widest shadow-lg">Away</div>
                                        </div>
                                        <h2 className="text-xl md:text-4xl lg:text-5xl font-black text-white uppercase italic tracking-tighter leading-tight drop-shadow-xl line-clamp-2 max-w-[200px] md:max-w-none">
                                            {match.away}{" "}
                                        </h2>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Bottom Utility Bar */}
                        <div className="p-5 md:p-10 flex flex-wrap items-center justify-center gap-4 md:gap-16 border-t border-white/10 bg-black/20 backdrop-blur-sm">
                            <div className="flex items-center gap-2 md:gap-3 text-white/70">
                                <Calendar className="w-3.5 h-3.5 md:w-4 h-4" />
                                <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest">{match.date}</span>
                            </div>
                            <div className="flex items-center gap-2 md:gap-3 text-white/70">
                                <Clock className="w-3.5 h-3.5 md:w-4 h-4" />
                                <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest">{match.time} GMT</span>
                            </div>
                            {match.stadium && (
                                <div className="flex items-center gap-2 md:gap-3 text-white/70">
                                    <MapPin className="w-3.5 h-3.5 md:w-4 h-4" />
                                    <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest truncate max-w-[120px] md:max-w-none">{match.stadium}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Background Text Watermark */}
                    <div className="absolute -bottom-10 md:-bottom-20 left-1/2 -translate-x-1/2 text-[100px] md:text-[250px] font-black text-white/5 uppercase italic select-none pointer-events-none whitespace-nowrap tracking-tighter z-0">
                        {match.home} VS {match.away}
                    </div>
                </motion.div>

                {/* Match Details Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: General Stats/Info */}
                    <div className="lg:col-span-2 space-y-8">
                        <section className="glass rounded-[32px] p-8 border border-border/50">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                    <Activity className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-black uppercase italic tracking-tighter">Match Overview</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="glass p-6 rounded-2xl border border-border/50 flex items-center gap-5">
                                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                                        <Shield className="w-6 h-6 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Competition</p>
                                        <p className="font-bold text-sm uppercase">{match.league}</p>
                                    </div>
                                </div>
                                <div className="glass p-6 rounded-2xl border border-border/50 flex items-center gap-5">
                                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                                        <MapPin className="w-6 h-6 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Venue</p>
                                        <p className="font-bold text-sm uppercase">{match.stadium || "Location Not Specified"}</p>
                                    </div>
                                </div>
                                <div className="glass p-6 rounded-2xl border border-border/50 flex items-center gap-5">
                                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                                        <Zap className="w-6 h-6 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Match Status</p>
                                        <p className={cn(
                                            "font-bold text-sm uppercase",
                                            derivedStatus === 'LIVE' ? "text-red-500" : ""
                                        )}>{derivedStatus}</p>
                                    </div>
                                </div>
                                <div className="glass p-6 rounded-2xl border border-border/50 flex items-center gap-5">
                                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                                        <Clock className="w-6 h-6 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Local Kickoff</p>
                                        <p className="font-bold text-sm uppercase">{match.time_display || match.time}</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Additional dynamic sections could go here */}
                    </div>

                    {/* Right: Sidebar Info */}
                    <div className="space-y-8">
                        <section className="glass rounded-[32px] p-8 border border-border/50">
                            <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-6">Fixture Context</h4>
                            <div className="space-y-6">
                                <div className="relative pl-8 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-primary/20 before:rounded-full">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Historical Significance</p>
                                    <p className="text-sm font-bold leading-relaxed uppercase">
                                        High-stakes encounter in {match.league}. This match will be broadcast live across multiple sports networks.
                                    </p>
                                </div>
                                <div className="relative pl-8 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-primary/20 before:rounded-full">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Data Source</p>
                                    <p className="text-sm font-bold leading-relaxed uppercase">
                                        Real-time synchronization active. Scores and events are updated within seconds of occurring.
                                    </p>
                                </div>
                            </div>

                            <button className="w-full mt-12 py-4 rounded-2xl gradient-sports text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-xl transition-transform">
                                Follow Live Updates
                            </button>
                        </section>

                        {/* Recent Matches for teams could be added here if data was available */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function MatchPage() {
    return (
        <Suspense fallback={<MatchSkeleton />}>
            <MatchPageContent />
        </Suspense>
    )
}
