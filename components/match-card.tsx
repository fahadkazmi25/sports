"use client"

import React from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, Trophy, ArrowRight, Shield } from "lucide-react"
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
}

export function MatchCard({
    match,
    index = 0,
    highlight = ""
}: {
    match: Match;
    index?: number;
    highlight?: string
}) {
    const highlightText = (text: string) => {
        if (!highlight) return text
        const parts = text.split(new RegExp(`(${highlight})`, 'gi'))
        return parts.map((part, i) =>
            part.toLowerCase() === highlight.toLowerCase()
                ? <span key={i} className="text-primary bg-primary/10 px-0.5 rounded">{part}</span>
                : part
        )
    }

    const homeInitials = match.home?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?'
    const awayInitials = match.away?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?'

    // Infer match status
    const now = Math.floor(Date.now() / 1000)
    const isLive = match.ts && now >= match.ts && now <= match.ts + 7200 // Mock: live for 2 hours
    const isFinished = match.ts && now > match.ts + 7200
    const isUpcoming = match.ts && now < match.ts

    const matchSlug = `${slugify(match.league || 'match')}/${slugify(match.home || 'home')}-vs-${slugify(match.away || 'away')}-${match.ts}`

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05, duration: 0.5 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="group relative glass p-6 rounded-3xl border border-white/5 hover:border-primary/50 transition-all duration-300 shadow-xl overflow-hidden"
        >
            <Link href={`/match/${matchSlug}`} className="absolute inset-0 z-10" />

            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/20 transition-all" />

            {/* League Header */}
            <div className="flex items-center justify-between mb-8 relative z-20">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground bg-muted/50 px-2 py-1 rounded-full w-fit mb-2">
                        {match.league || "Unknown League"}
                    </span>
                    <div className="flex items-center gap-2">
                        {isLive && (
                            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 text-[10px] font-bold uppercase animate-pulse">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Live
                            </span>
                        )}
                        {isFinished && (
                            <span className="px-2 py-0.5 rounded-full bg-muted/80 text-muted-foreground text-[10px] font-bold uppercase">
                                FT
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex text-nowrap items-center space-x-1.5 text-primary bg-primary/10 px-2 py-1 rounded-2xl border border-primary/20">
                    <Clock className="w-3 h-3" />
                    <span className="text-xs font-black italic tracking-tighter">{match.time_display || match.time}</span>
                </div>
            </div>

            {/* Match Layout */}
            <div className="flex items-center justify-between gap-6 relative z-20 mb-8">
                {/* Home Team */}
                <div className="flex-1 flex flex-col items-center text-center">
                    <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600/10 to-transparent border border-white/5 flex items-center justify-center mb-4 shadow-2xl  group-hover:border-primary/30 transition-all duration-500">
                        <Shield className="w-10 h-10 text-primary" />
                        <span className="absolute inset-0 flex items-center justify-center z-10 text-[10px] font-black text-foreground uppercase tracking-tighter transition-colors duration-200">
                            {homeInitials}
                        </span>
                    </div>
                    <h3 className="text-sm font-black line-clamp-2 min-h-[40px] uppercase italic tracking-tighter leading-tight text-foreground/90 group-hover:text-primary transition-colors">
                        {highlightText(match.home || "TBD")}
                    </h3>
                    <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mt-1">Home</span>
                </div>

                {/* VS */}
                <div className="flex flex-col items-center justify-center">
                    <div className="relative">
                        <div className="h-px w-8 bg-gradient-to-r from-transparent via-white/20 to-transparent absolute top-1/2 left-1/2 -translate-x-1/2" />
                        <div className="w-10 h-10 rounded-full glass border border-primary/30 flex items-center justify-center text-[10px] font-black text-primary shadow-xl   transition-transform duration-500 bg-background/80">
                            VS
                        </div>
                    </div>
                </div>

                {/* Away Team */}
                <div className="flex-1 flex flex-col items-center text-center">
                    <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-600/10 to-transparent border border-white/5 flex items-center justify-center mb-4 shadow-2xl  group-hover:border-orange-500/30 transition-all duration-500">
                        <Shield className="w-10 h-10 text-orange-500/80" />
                        <span className="absolute inset-0 flex items-center justify-center z-10 text-[10px] font-black text-foreground uppercase tracking-tighter transition-colors duration-200">
                            {awayInitials}
                        </span>
                    </div>
                    <h3 className="text-sm font-black line-clamp-2 min-h-[40px] uppercase italic tracking-tighter leading-tight text-foreground/90 group-hover:text-orange-500 transition-colors">
                        {highlightText(match.away || "TBD")}
                    </h3>
                    <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mt-1">Away</span>
                </div>
            </div>

            {/* Footer Info */}
            <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-5 relative z-20">
                <div className="flex items-center space-x-2 text-muted-foreground/70">
                    <Calendar className="w-4 h-4 text-primary/50" />
                    <span className="text-xs font-bold tracking-tight">{match.date}</span>
                </div>
                {/* <div className="flex items-center gap-1.5 text-xs font-black text-primary uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                    Analytics <ArrowRight className="w-4 h-4" />
                </div> */}
            </div>
        </motion.div>
    )
}

export function SkeletonCard() {
    return (
        <div className="glass p-6 rounded-3xl border border-white/5 animate-pulse min-h-[300px] flex flex-col">
            <div className="h-6 w-32 bg-muted/50 rounded-full mb-8" />
            <div className="flex items-center justify-between gap-6 mb-8">
                <div className="flex-1 flex flex-col items-center">
                    <div className="h-20 w-20 bg-muted/50 rounded-3xl mb-4" />
                    <div className="h-4 w-24 bg-muted/50 rounded" />
                </div>
                <div className="h-10 w-10 bg-muted/50 rounded-full" />
                <div className="flex-1 flex flex-col items-center">
                    <div className="h-20 w-20 bg-muted/50 rounded-3xl mb-4" />
                    <div className="h-4 w-24 bg-muted/50 rounded" />
                </div>
            </div>
            <div className="mt-auto border-t border-white/5 pt-5 flex justify-between">
                <div className="h-4 w-20 bg-muted/50 rounded" />
                <div className="h-4 w-16 bg-muted/50 rounded" />
            </div>
        </div>
    )
}
