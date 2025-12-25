"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
    Trophy, Calendar, Clock, ArrowLeft, Shield,
    MapPin, Radio, Share2, Info, ChevronRight, Activity,
    Timer
} from "lucide-react"
import Link from "next/link"
import { MatchCard, SkeletonCard } from "@/components/match-card"
import { cn, slugify } from "@/lib/utils"

export default function MatchDetailPage() {
    const { slug } = useParams()
    const router = useRouter()
    const [match, setMatch] = useState<any>(null)
    const [relatedMatches, setRelatedMatches] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Expected slug structure: [league-slug, match-slug]
        // match-slug: home-vs-away-timestamp
        const leagueSlug = Array.isArray(slug) ? slug[0] : ""
        const matchSlug = Array.isArray(slug) ? slug[1] : ""
        const ts = matchSlug?.split('-').pop()

        const fetchMatchData = async () => {
            setLoading(true)
            try {
                const res = await fetch(`/api/matches?league=${leagueSlug}&limit=100`)
                const data = await res.json()
                const foundMatch = data.matches?.find((m: any) => m.ts.toString() === ts)

                if (foundMatch) {
                    setMatch(foundMatch)
                    setRelatedMatches(data.matches?.filter((m: any) => m.ts.toString() !== ts).slice(0, 4) || [])
                }
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        if (slug) fetchMatchData()
    }, [slug])

    if (loading) return <LoadingState />
    if (!match) return <NotFoundState />

    const homeInitials = match.home?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || '?'
    const awayInitials = match.away?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || '?'

    return (
        <div className="min-h-screen bg-background">
            {/* Immersive Header Backdrop */}
            <div className="relative h-[60vh] overflow-hidden">
                <div className="absolute inset-0 gradient-sports opacity-80" />
                <div className="absolute inset-0 bg-radial-gradient from-black/20 via-transparent to-black/60" />

                {/* Animated Background Text */}
                <div className="absolute inset-0 flex items-center justify-center opacity-5 select-none pointer-events-none">
                    <h1 className="text-[20vw] font-black uppercase italic tracking-tighter whitespace-nowrap">
                        {match.league}
                    </h1>
                </div>

                <div className="container mx-auto px-4 h-full flex flex-col items-center justify-center relative z-10 pt-20">
                    <Link
                        href="/"
                        className="absolute top-8 left-8 flex items-center gap-2 text-white/70 hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.2em] glass px-4 py-2 rounded-xl"
                    >
                        <ArrowLeft className="w-4 h-4" /> Exit Experience
                    </Link>

                    {/* Match Status Badge */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="mb-12"
                    >
                        <div className="glass px-8 py-3 rounded-full border border-white/20 flex items-center gap-3 shadow-2xl">
                            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Match Intelligence Live</span>
                        </div>
                    </motion.div>

                    {/* Core Matchup */}
                    <div className="w-full max-w-5xl flex items-center justify-between gap-8 md:gap-16">
                        {/* Home Team */}
                        <motion.div
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="flex-1 flex flex-col items-center text-center group"
                        >
                            <div className="w-32 h-32 md:w-48 md:h-48 rounded-[40px] glass border-2 border-white/10 flex items-center justify-center mb-8 relative shadow-[0_0_50px_rgba(37,99,235,0.3)] group-hover:scale-105 transition-transform duration-700">
                                <Shield className="w-20 md:w-32 h-20 md:h-32 text-primary drop-shadow-glow" />
                                <span className="absolute text-xl font-black text-white/20 uppercase tracking-widest">{homeInitials}</span>
                            </div>
                            <h2 className="text-2xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-tight group-hover:text-primary transition-colors">
                                {match.home}
                            </h2>
                            <span className="mt-4 text-[10px] font-black uppercase tracking-[0.5em] text-white/40">Dominating Host</span>
                        </motion.div>

                        {/* VS & Time */}
                        <div className="flex flex-col items-center gap-8">
                            <div className="text-4xl md:text-6xl font-black italic text-white/20 tracking-tighter">VS</div>
                            <div className="glass px-6 py-4 rounded-3xl border border-white/10 flex flex-col items-center shadow-2xl scale-110">
                                <span className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-1">Kickoff Time</span>
                                <span className="text-4xl font-black text-white italic tracking-tighter">{match.time_display || match.time}</span>
                            </div>
                        </div>

                        {/* Away Team */}
                        <motion.div
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="flex-1 flex flex-col items-center text-center group"
                        >
                            <div className="w-32 h-32 md:w-48 md:h-48 rounded-[40px] glass border-2 border-white/10 flex items-center justify-center mb-8 relative shadow-[0_0_50px_rgba(234,88,12,0.3)] group-hover:scale-105 transition-transform duration-700">
                                <Shield className="w-20 md:w-32 h-20 md:h-32 text-orange-500/80 drop-shadow-glow" />
                                <span className="absolute text-xl font-black text-white/20 uppercase tracking-widest">{awayInitials}</span>
                            </div>
                            <h2 className="text-2xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-tight group-hover:text-orange-500 transition-colors">
                                {match.away}
                            </h2>
                            <span className="mt-4 text-[10px] font-black uppercase tracking-[0.5em] text-white/40">Formidable Guest</span>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Detail Modules */}
            <div className="container mx-auto px-4 -mt-20 relative z-20 pb-40">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Info Module */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="glass p-10 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32" />

                            <header className="flex items-center justify-between mb-12">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 rounded-2xl bg-primary/10 text-primary">
                                        <Trophy className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black uppercase italic tracking-tighter">{match.league}</h3>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Official League Specification</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <button className="p-4 rounded-2xl glass hover:bg-muted transition-colors"><Share2 className="w-5 h-5" /></button>
                                    <button className="p-4 rounded-2xl glass hover:bg-muted transition-colors"><Radio className="w-5 h-5" /></button>
                                </div>
                            </header>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between p-6 rounded-3xl bg-muted/50 border border-white/5">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Match Day</span>
                                        <span className="font-black italic">{match.date}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-6 rounded-3xl bg-muted/50 border border-white/5">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Stadium Source</span>
                                        <span className="font-black italic text-primary flex items-center gap-2">
                                            <MapPin className="w-4 h-4" /> Inferred Home Stadium
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between p-6 rounded-3xl bg-muted/50 border border-white/5">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Atmosphere</span>
                                        <div className="flex gap-1">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <div key={i} className={cn("w-3 h-3 rounded-full", i < 4 ? "bg-primary shadow-[0_0_8px_var(--color-primary)]" : "bg-muted")} />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-6 rounded-3xl bg-muted/50 border border-white/5">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Analysis</span>
                                        <span className="px-4 py-1 rounded-full gradient-sports text-white text-[10px] font-black tracking-widest uppercase shadow-lg">Premium Data</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Analysis Module */}
                        <div className="glass p-10 rounded-[3rem] border border-white/5">
                            <div className="flex items-center gap-3 mb-8">
                                <Info className="w-6 h-6 text-primary" />
                                <span className="font-black uppercase tracking-[0.2em] text-xs">Match Narrative</span>
                            </div>
                            <p className="text-lg text-muted-foreground/80 leading-relaxed font-light italic">
                                A highly anticipated clash in the <span className="text-foreground font-black uppercase">{match.league}</span> where
                                <span className="text-foreground font-black uppercase ml-1">{match.home}</span> look to defend their home turf against the challenge of
                                <span className="text-foreground font-black uppercase ml-1">{match.away}</span>.
                                With technical mastery on display, this fixture represents the pinnacle of competitive movement.
                            </p>
                        </div>
                    </div>

                    {/* Sidebar Recommendation */}
                    <div className="space-y-8">
                        <div className="glass p-8 rounded-[3rem] border border-white/5">
                            <h4 className="text-xl font-black uppercase italic tracking-tighter mb-8 flex items-center justify-between">
                                <span>More from League</span>
                                <Link href={`/league/${slugify(match.league)}`} className="text-primary hover:underline"><ChevronRight className="w-5 h-5" /></Link>
                            </h4>
                            <div className="space-y-4">
                                {relatedMatches.length > 0 ? (
                                    relatedMatches.map((m, i) => (
                                        <Link key={i} href={`/match/${slugify(m.league)}/${slugify(m.home)}-vs-${slugify(m.away)}-${m.ts}`} className="group block">
                                            <div className="p-4 rounded-2xl glass hover:bg-muted border border-transparent transition-all flex items-center justify-between">
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">{m.time}</span>
                                                    <span className="text-xs font-black uppercase italic tracking-tighter group-hover:text-primary transition-colors">{m.home} vs {m.away}</span>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <p className="text-xs text-muted-foreground uppercase font-black tracking-[0.2em] opacity-30 py-4">No other fixtures found</p>
                                )}
                            </div>
                        </div>

                        <div className="gradient-sports p-8 rounded-[3rem] shadow-2xl text-white relative overflow-hidden group">
                            <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/20 rounded-full blur-[50px] group-hover:scale-150 transition-transform duration-700" />
                            <h4 className="text-xl font-black uppercase italic mb-4 relative z-10">Pro Analytics</h4>
                            <p className="text-xs font-bold uppercase tracking-widest text-white/70 mb-8 relative z-10">Access heatmaps, pass-maps, and tactical replays.</p>
                            <button className="w-full py-4 rounded-2xl bg-white text-primary font-black uppercase tracking-widest text-xs shadow-2xl relative z-10 hover:scale-105 active:scale-95 transition-all">Unlock Dashboard</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function LoadingState() {
    return (
        <div className="min-h-screen bg-background pt-40 flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="mt-8 font-black uppercase tracking-[0.3em] text-muted-foreground animate-pulse">Initializing Match Intelligence...</p>
        </div>
    )
}

function NotFoundState() {
    return (
        <div className="min-h-screen pt-40 flex flex-col items-center">
            <h1 className="text-6xl font-black tracking-tighter italic mb-4">MATCH_NOT_FOUND</h1>
            <p className="text-muted-foreground text-xs uppercase tracking-[0.3em] mb-12 font-black">The requested coordinate does not exist in our universe.</p>
            <Link href="/" className="gradient-sports text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl">Return to Homepage</Link>
        </div>
    )
}
