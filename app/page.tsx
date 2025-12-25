"use client"

import React, { useEffect, useState, useRef, useCallback } from "react"
import { Hero } from "@/components/hero"
import { MatchCard, SkeletonCard } from "@/components/match-card"
import { motion, AnimatePresence } from "framer-motion"
import { Trophy, TrendingUp, ChevronRight, LayoutGrid, Loader2 } from "lucide-react"
import Link from "next/link"
import { slugify, cn } from "@/lib/utils"

export default function Home() {
  const [matches, setMatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [leagueStats, setLeagueStats] = useState<Record<string, number>>({})
  const [activeLeague, setActiveLeague] = useState("all")

  const observer = useRef<IntersectionObserver | null>(null)
  const lastMatchRef = useCallback((node: HTMLDivElement) => {
    if (loading || loadingMore) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1)
      }
    })
    if (node) observer.current.observe(node)
  }, [loading, loadingMore, hasMore])

  useEffect(() => {
    const fetchMatches = async () => {
      if (page === 1) setLoading(true)
      else setLoadingMore(true)

      try {
        const leagueQuery = activeLeague !== "all" ? `&league=${slugify(activeLeague)}` : ""
        const res = await fetch(`/api/matches?page=${page}&limit=12&includeStats=true${leagueQuery}`)
        const data = await res.json()

        if (page === 1) {
          setMatches(data.matches || [])
          if (data.leagueStats) setLeagueStats(data.leagueStats)
        } else {
          setMatches(prev => [...prev, ...(data.matches || [])])
        }

        setHasMore(data.page < data.totalPages)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    }

    fetchMatches()
  }, [page, activeLeague])

  // Reset pagination when league changes
  useEffect(() => {
    setPage(1)
    setMatches([])
    setHasMore(true)
  }, [activeLeague])

  const topLeagues = [
    { name: "English Premier League", color: "from-purple-600 to-indigo-600" },
    { name: "Romanian Super Liga", color: "from-yellow-500 to-orange-500" },
    { name: "German Bundesliga", color: "from-red-600 to-pink-600" },
    { name: "Italian Serie B", color: "from-blue-600 to-cyan-600" },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />


      {/* Top Leagues Navigation - Featured */}
      <section id="leagues" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-black tracking-tighter uppercase italic">Elite Leagues</h2>
              <p className="text-muted-foreground">Select a league to explore detailed match states.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topLeagues.map((league, i) => (
              <Link
                key={league.name}
                href={`/league/${slugify(league.name)}`}
                className="group"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -10 }}
                  className={cn(
                    "relative h-48 rounded-3xl overflow-hidden shadow-2xl transition-all",
                    "bg-gradient-to-br " + league.color
                  )}
                >
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                  <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    <Trophy className="w-8 h-8 text-white/50 group-hover:text-white group-hover:scale-125 transition-all" />
                    <div>
                      <h3 className="text-xl font-black text-white uppercase italic leading-tight">
                        {league.name}
                      </h3>
                      <p className="text-white/60 text-[10px] font-black tracking-[0.2em] uppercase mt-2">
                        {leagueStats[league.name] || 0} Matches Scheduled
                      </p>
                    </div>
                  </div>
                  <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Matches Section */}
      <section id="matches" className="py-20 relative">
        <div className="container mx-auto px-4">
          {/* League Navigation with Match Counts */}
          <nav className="mb-12 glass border border-white/5 py-4 rounded-[2rem] overflow-hidden">
            <div className="px-4 flex items-center gap-4 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveLeague("all")}
                className={cn(
                  "whitespace-nowrap px-6 py-2 rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase transition-all flex items-center gap-2",
                  activeLeague === "all" ? "gradient-sports text-white shadow-lg" : "hover:bg-muted text-muted-foreground"
                )}
              >
                <LayoutGrid className="w-3 h-3" /> All
              </button>
              {Object.entries(leagueStats).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([name, count]) => (
                <button
                  key={name}
                  onClick={() => setActiveLeague(name)}
                  className={cn(
                    "whitespace-nowrap px-6 py-2 rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase transition-all flex items-center gap-2",
                    activeLeague === name ? "gradient-sports text-white shadow-lg" : "glass hover:bg-muted text-muted-foreground"
                  )}
                >
                  {name} <span className="opacity-40">{count}</span>
                </button>
              ))}
            </div>
          </nav>

          <div className="mb-12 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px] mb-4">
                <TrendingUp className="w-4 h-4" />
                <span>Happening Soon</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter uppercase italic">
                {activeLeague === "all" ? "Featured Matches" : activeLeague}
              </h2>
            </div>
            <div className="text-[10px] font-black uppercase text-muted-foreground tracking-widest hidden md:block">
              Showing {matches.length} matches
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
              ) : matches.length > 0 ? (
                matches.map((match, i) => {
                  if (matches.length === i + 1) {
                    return (
                      <div ref={lastMatchRef} key={i}>
                        <MatchCard match={match} index={i} />
                      </div>
                    )
                  }
                  return <MatchCard key={i} match={match} index={i} />
                })
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full py-32 text-center glass rounded-[40px]"
                >
                  <p className="text-muted-foreground font-black uppercase tracking-[0.2em] italic">No matches found for this selection.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {loadingMore && (
            <div className="mt-20 flex justify-center">
              <div className="flex items-center gap-3 px-8 py-4 rounded-2xl glass border border-primary/20 text-primary font-black uppercase tracking-[0.2em] text-xs">
                <Loader2 className="w-5 h-5 animate-spin" />
                Syncing Match Universe...
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
