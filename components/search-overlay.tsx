"use client"

import React, { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X, Loader2, Trophy, ArrowRight, Sparkles, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { MatchCard, MatchSkeleton } from "@/components/match-card"
import { TOP_LEAGUES } from "@/lib/constants"
import { slugify, cn } from "@/lib/utils"
import { useSearchParams, usePathname } from "next/navigation"

interface SearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [debouncedValue, setDebouncedValue] = useState("")
    const [matches, setMatches] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [matchedLeagues, setMatchedLeagues] = useState<{ elite: any[], other: string[] }>({ elite: [], other: [] })

    const inputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()

    // Initialize search term from URL
    useEffect(() => {
        const query = searchParams.get('q')
        if (query && isOpen) {
            setSearchTerm(query)
        }
    }, [isOpen, searchParams])

    // Esc key to close
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") handleClose()
        }
        window.addEventListener("keydown", handleEsc)
        return () => window.removeEventListener("keydown", handleEsc)
    }, [])

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100)
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "unset"
        }
        return () => { document.body.style.overflow = "unset" }
    }, [isOpen])

    // Debounce
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(searchTerm)

            // Update URL
            if (isOpen) {
                const params = new URLSearchParams(searchParams.toString())
                if (searchTerm) {
                    params.set('q', searchTerm)
                } else {
                    params.delete('q')
                }
                router.replace(`${pathname}?${params.toString()}`, { scroll: false })
            }
        }, 400)
        return () => clearTimeout(handler)
    }, [searchTerm, isOpen, router, pathname, searchParams])

    // Search Logic
    useEffect(() => {
        if (debouncedValue.length > 1) {
            setLoading(true)

            // 1. Filter Elite Leagues
            const elite = TOP_LEAGUES.filter(l =>
                l.name.toLowerCase().includes(debouncedValue.toLowerCase())
            )

            // 2. Fetch Matches & Derive Other Leagues
            fetch(`/api/matches?search=${encodeURIComponent(debouncedValue)}`)
                .then(res => res.json())
                .then(data => {
                    const fetchedMatches = data.matches || []
                    setMatches(fetchedMatches)

                    // Extract other leagues from matches
                    const allLeagueNames = Array.from(new Set(fetchedMatches.map((m: any) => m.league))) as string[]
                    const other = allLeagueNames.filter(name =>
                        !elite.some(e => e.name === name) &&
                        name.toLowerCase().includes(debouncedValue.toLowerCase())
                    )

                    setMatchedLeagues({ elite, other })
                    setLoading(false)
                })
                .catch(err => {
                    console.error(err)
                    setLoading(false)
                })
        } else {
            setMatches([])
            setMatchedLeagues({ elite: [], other: [] })
            setLoading(false)
        }
    }, [debouncedValue])

    const handleClose = () => {
        setSearchTerm("")
        setDebouncedValue("")
        const params = new URLSearchParams(searchParams.toString())
        params.delete('q')
        router.replace(`${pathname}?${params.toString()}`, { scroll: false })
        onClose()
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60]"
                    />

                    {/* Overlay Container */}
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] md:w-[90%] max-w-5xl h-[90vh] glass rounded-[2rem] border border-white/10 shadow-2xl z-[70] flex flex-col overflow-hidden bg-background/80"
                    >
                        {/* Header / Input */}
                        <div className="p-6 border-b border-border/50 flex items-center gap-4">
                            <Search className="w-6 h-6 text-primary" />
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Search leagues, teams, or matches..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="flex-1 bg-transparent border-none text-2xl font-black uppercase italic tracking-tight placeholder:text-muted-foreground/30 focus:outline-none text-foreground"
                            />
                            <button
                                onClick={handleClose}
                                className="p-2 hover:bg-muted/50 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-muted-foreground cursor-pointer" />
                            </button>
                        </div>

                        {/* Content Scroll Area */}
                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            {!debouncedValue ? (
                                <div className="h-full flex flex-col text-center items-center justify-center text-muted-foreground opacity-30 gap-4">
                                    <Sparkles className="w-16 h-16" />
                                    <p className="text-xl font-black uppercase tracking-widest">Start Typing to Explore</p>
                                </div>
                            ) : loading ? (
                                <div className="h-full flex items-center justify-center">
                                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                                </div>
                            ) : matches.length === 0 && matchedLeagues.elite.length === 0 && matchedLeagues.other.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50 gap-4">
                                    <Trophy className="w-16 h-16" />
                                    <p className="text-xl font-black uppercase tracking-widest">No Results Found</p>
                                </div>
                            ) : (
                                <div className="space-y-12">

                                    {/* Elite Leagues Section */}
                                    {matchedLeagues.elite.length > 0 && (
                                        <div className="space-y-6">
                                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                                <Trophy className="w-4 h-4 text-primary" /> Elite Leagues
                                            </h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {matchedLeagues.elite.map((league) => (
                                                    <Link
                                                        key={league.name}
                                                        href={`/league/${slugify(league.name)}`}
                                                        onClick={handleClose}
                                                        className="group relative h-40 rounded-3xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all cursor-pointer bg-gradient-to-br from-black/50 to-transparent"
                                                    >
                                                        <div className={`absolute inset-0 bg-gradient-to-br ${league.color} opacity-20 group-hover:opacity-40 transition-opacity`} />
                                                        <div className="absolute inset-0 flex items-center justify-between p-6">
                                                            <div className="relative w-20 h-20">
                                                                <Image
                                                                    src={league.logo}
                                                                    alt={league.name}
                                                                    fill
                                                                    className="object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-500"
                                                                    sizes="80px"
                                                                />
                                                            </div>
                                                            <div className="flex flex-col items-end text-right z-10">
                                                                <span className="text-xs font-black uppercase tracking-widest text-white/50 mb-1">League</span>
                                                                <h4 className="text-lg font-black uppercase italic leading-tight text-white group-hover:text-primary transition-colors">
                                                                    {league.name}
                                                                </h4>
                                                                <ArrowRight className="w-5 h-5 text-white/50 mt-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                                            </div>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Other Leagues Section */}
                                    {matchedLeagues.other.length > 0 && (
                                        <div className="space-y-4">
                                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground">Other Leagues</h3>
                                            <div className="flex flex-wrap gap-3">
                                                {matchedLeagues.other.map((leagueName) => (
                                                    <Link
                                                        key={leagueName}
                                                        href={`/league/${slugify(leagueName)}`}
                                                        onClick={handleClose}
                                                        className="px-4 py-2 rounded-xl bg-muted/30 border border-white/5 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all text-sm font-bold uppercase tracking-wide flex items-center gap-2 group"
                                                    >
                                                        {leagueName}
                                                        <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Matches Section */}
                                    {matches.length > 0 && (
                                        <div className="space-y-6">
                                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground">Matches</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                                                {matches.map((match, i) => (
                                                    <div key={i} onClick={handleClose}>
                                                        <MatchCard match={match} index={i} highlight={debouncedValue} />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
