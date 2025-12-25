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
                <div className="relative z-20 px-4 py-8 flex items-center justify-between gap-2 flex-grow">

                    {/* Home Team */}
                    <div className="flex-1 flex flex-col items-center text-center space-y-3">
                        <div className="relative group/team">
                            <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-lg opacity-0 group-hover/team:opacity-100 transition-opacity transform scale-90" />
                            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-white/80 to-white/40 dark:from-white/10 dark:to-transparent border border-white/20 dark:border-white/5 flex items-center justify-center shadow-lg transition-transform group-hover/team:scale-105">
                                <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-primary/80" />
                                <span className="absolute inset-0 flex items-center justify-center font-tourney font-black text-xs text-foreground/80 tracking-tighter uppercase opacity-0 group-hover/team:opacity-100 transition-opacity">
                                    {getInitials(match.home)}
                                </span>
                            </div>
                        </div>
                        <h3 className="text-sm font-bold font-outfit uppercase tracking-tight leading-tight text-foreground transition-colors group-hover:text-primary line-clamp-2 max-w-[120px]">
                            {highlightText(match.home || "TBD")}
                        </h3>
                    </div>

                    {/* VS / SCORE */}
                    <div className="flex flex-col items-center justify-center min-w-[60px] sm:min-w-[80px]">
                        {derivedStatus === 'UPCOMING' ? (
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-2xl font-black font-tourney text-muted-foreground/30">VS</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-lg border border-border/30 backdrop-blur-sm">
                                <span className="text-2xl font-black font-tourney text-foreground">{match.score?.home ?? 0}</span>
                                <div className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                                <span className="text-2xl font-black font-tourney text-foreground">{match.score?.away ?? 0}</span>
                            </div>
                        )}
                    </div>

                    {/* Away Team */}
                    <div className="flex-1 flex flex-col items-center text-center space-y-3">
                        <div className="relative group/team">
                            <div className="absolute inset-0 bg-orange-500/20 rounded-2xl blur-lg opacity-0 group-hover/team:opacity-100 transition-opacity transform scale-90" />
                            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-white/80 to-white/40 dark:from-white/10 dark:to-transparent border border-white/20 dark:border-white/5 flex items-center justify-center shadow-lg transition-transform group-hover/team:scale-105">
                                <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500/80" />
                                <span className="absolute inset-0 flex items-center justify-center font-tourney font-black text-xs text-foreground/80 tracking-tighter uppercase opacity-0 group-hover/team:opacity-100 transition-opacity">
                                    {getInitials(match.away)}
                                </span>
                            </div>
                        </div>
                        <h3 className="text-sm font-bold font-outfit uppercase tracking-tight leading-tight text-foreground transition-colors group-hover:text-orange-500 line-clamp-2 max-w-[120px]">
                            {highlightText(match.away || "TBD")}
                        </h3>
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
