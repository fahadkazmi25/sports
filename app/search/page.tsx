"use client"

import React, { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { MatchCard, MatchSkeleton, } from "@/components/match-card"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Filter, X, Trophy, Loader2 } from "lucide-react"

function SearchContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const queryParam = searchParams.get('q') || ""

    const [searchTerm, setSearchTerm] = useState(queryParam)
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [debouncedValue, setDebouncedValue] = useState(queryParam)

    // Debouncing logic
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(searchTerm)
        }, 500)
        return () => clearTimeout(handler)
    }, [searchTerm])

    // Fetch results when debounced value changes
    useEffect(() => {
        if (debouncedValue.length > 0) {
            setLoading(true)
            // Update URL
            const params = new URLSearchParams(searchParams)
            params.set('q', debouncedValue)
            router.push(`/search?${params.toString()}`, { scroll: false })

            fetch(`/api/matches?search=${encodeURIComponent(debouncedValue)}`)
                .then(res => res.json())
                .then(data => {
                    setResults(data.matches || [])
                    setLoading(false)
                })
        } else {
            setResults([])
            setLoading(false)
            if (queryParam) {
                router.push('/search', { scroll: false })
            }
        }
    }, [debouncedValue, queryParam, router, searchParams])

    return (
        <div className="container mx-auto px-4 max-w-6xl">
            <header className="mb-16 text-center">
                <h1 className="text-6xl md:text-7xl font-black tracking-tighter uppercase italic mb-6">
                    Global <span className="text-primary">Search</span>
                </h1>
                <p className="text-muted-foreground max-w-xl mx-auto">
                    Real-time access to the entire match universe. Search by team, league, or city.
                </p>
            </header>

            {/* Search Bar Container */}
            <div className="relative max-w-2xl mx-auto mb-20 group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-3xl blur opacity-25 group-focus-within:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative glass rounded-2xl flex items-center p-2 shadow-2xl">
                    <div className="flex-1 flex items-center gap-4 px-4">
                        <Search className="w-6 h-6 text-primary" />
                        <input
                            type="text"
                            placeholder="Search Teams (e.g. Chelsea, Real Madrid)..."
                            className="w-full bg-transparent border-none focus:outline-none text-xl font-bold placeholder:text-muted-foreground/50 tracking-tight"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm("")}
                            className="p-3 hover:bg-muted rounded-xl transition-colors"
                        >
                            <X className="w-5 h-5 text-muted-foreground" />
                        </button>
                    )}
                    <button className="gradient-sports text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-sm shadow-lg ml-2">
                        Search
                    </button>
                </div>

                {loading && (
                    <div className="absolute right-36 top-1/2 -translate-y-1/2">
                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    </div>
                )}
            </div>

            {/* Results Section */}
            <div className="space-y-12">
                {debouncedValue ? (
                    <>
                        <div className="flex items-center justify-between border-b pb-6">
                            <h2 className="text-2xl font-black uppercase italic tracking-tighter">
                                {loading ? "Searching..." : `${results.length} Matches Found`}
                            </h2>
                            <div className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                                <Filter className="w-4 h-4" /> Sorting by relevance
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <AnimatePresence mode="popLayout">
                                {loading ? (
                                    Array.from({ length: 6 }).map((_, i) => <MatchSkeleton key={i} />)
                                ) : results.length > 0 ? (
                                    results.map((match: any, i) => (
                                        <MatchCard key={i} match={match} index={i} highlight={debouncedValue} />
                                    ))
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="col-span-full py-20 text-center glass rounded-3xl"
                                    >
                                        <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                                        <h3 className="text-2xl font-black uppercase italic opacity-50">No Results Match Your Search</h3>
                                        <p className="text-muted-foreground">Try searching for a league name or a major club.</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 opacity-40 grayscale pointer-events-none">
                        <MatchSkeleton />
                        <MatchSkeleton />
                        <MatchSkeleton />
                    </div>
                )}
            </div>
        </div>
    )
}

export default function SearchPage() {
    return (
        <div className="min-h-screen pt-32 pb-20">
            <Suspense fallback={
                <div className="flex items-center justify-center min-h-[50vh]">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            }>
                <SearchContent />
            </Suspense>
        </div>
    )
}
