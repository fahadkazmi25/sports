"use client"

import React from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, Trophy, Shield, MapPin, Zap, ChevronRight, ArrowRight } from "lucide-react"
import Link from "next/link"
import { cn, slugify } from "@/lib/utils"

interface Match {
    ts: number
    date: string
    time: string
    league: string
    home: string
    away: string
    time_display?: string
    status?: string // Added for compatibility
    score?: { home: number; away: number } // Added for compatibility
    stadium?: string // Added for compatibility
}

interface MatchCardProps {
    match: Match;
    index?: number;
    highlight?: string;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, index = 0, highlight = "" }) => {
    const getInitials = (name: string) =>
        name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?'

    const matchSlug = `${slugify(match.league || 'match')}/${slugify(match.home || 'home')}-vs-${slugify(match.away || 'away')}-${match.ts}`

    // Infer match status if not provided
    const now = Math.floor(Date.now() / 1000)
    const derivedStatus = match.status || (match.ts && now >= match.ts && now <= match.ts + 7200 ? 'LIVE' : (match.ts && now > match.ts + 7200 ? 'FINISHED' : 'UPCOMING'))

    // Highlight helper
    const highlightText = (text: string) => {
        if (!highlight) return text
        const parts = text.split(new RegExp(`(${highlight})`, 'gi'))
        return parts.map((part, i) =>
            part.toLowerCase() === highlight.toLowerCase()
                ? <span key={i} className="text-primary bg-primary/10 px-0.5 rounded">{part}</span>
                : part
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="group relative w-full h-full"
        >
            <Link href={`/match/${matchSlug}`} className="absolute inset-0 z-10" />

            {/* Main Container */}
            <div className="relative overflow-hidden rounded-[1.5rem] border border-border/50 bg-white/50 dark:bg-card/40 transition-all duration-500 group-hover:border-primary/40 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] glass h-full flex flex-col">

                {/* Dynamic Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                {/* Top Bar: League & Status */}
                <div className="relative z-20 flex items-center justify-between p-5 border-b border-border/40">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary">
                            <Trophy className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground font-tourney">
                            {match.league || "Unknown"}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        {derivedStatus === 'LIVE' && (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20">
                                <span className="relative flex h-1.5 w-1.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                                </span>
                                <span className="text-[9px] font-black text-red-600 dark:text-red-400 uppercase tracking-widest">Live</span>
                            </div>
                        )}
                        <div className="flex items-center text-nowrap gap-1.5 px-2.5 py-1 rounded-full bg-muted/50 border border-border/50">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            <span className="text-[10px] font-bold text-foreground/80 font-mono">
                                {match.time_display || match.time}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Match Core Layout */}
                <div className="relative z-20 px-4 py-8 grid grid-cols-[1fr_auto_1fr] gap-4 items-center flex-grow">

                    {/* Home Team */}
                    <div className="relative flex flex-col items-start gap-3 group/home p-2 rounded-xl transition-all duration-500 hover:bg-primary/5">
                        {/* Watermark */}
                        <span className="absolute -left-4 -top-6 text-8xl font-black text-foreground/10 font-tourney select-none z-0 transition-colors group-hover/home:text-primary/10 overflow-hidden pointer-events-none">
                            {getInitials(match.home)}
                        </span>

                        {/* Badge */}
                        <div className="relative z-10 px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-[9px] font-black uppercase tracking-widest text-primary">
                            Home
                        </div>

                        <div className="relative z-10 flex flex-col items-center gap-3 w-full">
                            <div className="w-12 h-12 shrink-0 rounded-2xl bg-gradient-to-br from-primary via-primary/80 to-blue-900 border border-white/10 shadow-lg flex items-center justify-center group-hover/home:scale-105 group-hover/home:rotate-3 transition-all duration-500">
                                <span className="font-tourney font-black text-lg text-white drop-shadow-md">
                                    {getInitials(match.home)}
                                </span>
                            </div>
                            <h3 className="text-sm font-bold font-outfit uppercase leading-tight text-foreground transition-colors group-hover/home:text-primary line-clamp-2">
                                {highlightText(match.home || "TBD")}
                            </h3>
                        </div>
                    </div>

                    {/* VS / SCORE */}
                    <div className="flex flex-col items-center justify-center w-16 relative z-20">
                        {derivedStatus === 'UPCOMING' ? (
                            <div className="relative group/vs">
                                <div className="absolute inset-0 bg-white/20 blur-xl rounded-full opacity-0 group-hover/vs:opacity-100 transition-opacity" />
                                <span className="relative text-3xl font-black font-tourney text-muted-foreground/20 group-hover/vs:text-foreground/50 transition-colors">VS</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-1">
                                <div className="flex items-center justify-center gap-1">
                                    <span className="text-3xl font-black font-tourney text-foreground drop-shadow-blue">{match.score?.home ?? 0}</span>
                                    <span className="text-muted-foreground/40 font-black px-1">:</span>
                                    <span className="text-3xl font-black font-tourney text-foreground drop-shadow-orange">{match.score?.away ?? 0}</span>
                                </div>
                                <div className="h-0.5 w-8 bg-gradient-to-r from-primary via-white/20 to-orange-500 rounded-full" />
                            </div>
                        )}
                    </div>

                    {/* Away Team */}
                    <div className="relative flex flex-col items-end text-right gap-3 group/away p-2 rounded-xl transition-all duration-500 hover:bg-orange-500/5">
                        {/* Watermark */}
                        <span className="absolute -right-4 -top-6 text-8xl font-black text-foreground/10 font-tourney select-none z-0 transition-colors group-hover/away:text-orange-500/10 overflow-hidden pointer-events-none">
                            {getInitials(match.away)}
                        </span>

                        {/* Badge */}
                        <div className="relative z-10 px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/20 text-[9px] font-black uppercase tracking-widest text-orange-500">
                            Away
                        </div>

                        <div className="relative z-10 flex flex-col text-center justify-center items-center gap-3 w-full">
                            <div className="w-12 h-12 shrink-0 rounded-2xl bg-gradient-to-br from-orange-500 via-orange-600 to-red-900 border border-white/10 shadow-lg flex items-center justify-center group-hover/away:scale-105 group-hover/away:-rotate-3 transition-all duration-500">
                                <span className="font-tourney font-black text-lg text-white drop-shadow-md">
                                    {getInitials(match.away)}
                                </span>
                            </div>
                            <h3 className="text-sm font-bold font-outfit uppercase leading-tight text-foreground transition-colors group-hover/away:text-orange-500 line-clamp-2">
                                {highlightText(match.away || "TBD")}
                            </h3>
                        </div>
                    </div>
                </div>

                {/* Footer: Details & CTA */}
                <div className="relative z-20 mt-auto flex items-center justify-between p-4 bg-muted/30 border-t border-border/40">
                    <div className="flex items-center gap-3 text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold tracking-wide">{match.date}</span>
                        </div>
                    </div>

                    {/* <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                        Details <ChevronRight className="w-3.5 h-3.5" />
                    </div> */}
                </div>
            </div>
        </motion.div>
    )
}

export const MatchSkeleton = () => (
    <div className="w-full h-[280px] rounded-[1.5rem] bg-muted/10 border border-border/50 animate-pulse overflow-hidden flex flex-col glass">
        <div className="h-16 w-full border-b border-border/50 flex items-center justify-between px-6">
            <div className="h-4 w-24 bg-muted/50 rounded" />
            <div className="h-6 w-16 bg-muted/50 rounded-full" />
        </div>
        <div className="flex-1 flex items-center justify-between px-8 py-6">
            <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-muted/50" />
                <div className="h-3 w-20 bg-muted/50 rounded" />
            </div>
            <div className="w-8 h-8 rounded-full bg-muted/50" />
            <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-muted/50" />
                <div className="h-3 w-20 bg-muted/50 rounded" />
            </div>
        </div>
        <div className="h-12 w-full bg-muted/5 px-6 flex items-center">
            <div className="h-3 w-32 bg-muted/50 rounded" />
        </div>
    </div>
)
