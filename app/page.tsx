"use client"

import React, { useEffect, useState, useRef, useCallback } from "react"
import { Hero } from "@/components/hero"
import { MatchCard, MatchSkeleton } from "@/components/match-card"
import { motion, AnimatePresence } from "framer-motion"
import { Trophy, TrendingUp, ChevronRight, LayoutGrid, Loader2, Sparkles } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { slugify, cn } from "@/lib/utils"
import { TOP_LEAGUES } from "@/lib/constants"

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

  const topLeagues = TOP_LEAGUES

  const [visibleCount, setVisibleCount] = useState(5)

  const sortedLeagues = Object.entries(leagueStats).sort((a, b) => b[1] - a[1])
  const displayedLeagues = sortedLeagues.slice(0, visibleCount)
  const hasMoreLeaguesToLoad = visibleCount < sortedLeagues.length

  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 5, sortedLeagues.length))
  }

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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {topLeagues.map((league, i) => (
              <Link
                key={league.name}
                href={`/league/${slugify(league.name)}`}
                className="group perspective-1000"
              >
                <motion.div
                  // initial={{ opacity: 0, y: 30 }}
                  // whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.6, ease: "easeOut" }}
                  // whileHover={{
                  //   y: -10,
                  //   rotateX: 2,
                  //   rotateY: 2,
                  //   scale: 1.02
                  // }}
                  className={cn(
                    "relative h-64 rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10 transition-all duration-500",
                    "bg-gradient-to-br " + league.color
                  )}
                >
                  {/* Decorative Background Elements */}
                  <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl -mr-10 -mt-10" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/40 rounded-full blur-3xl -ml-10 -mb-10" />
                  </div>

                  {/* Glass Overlay */}
                  <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px] group-hover:backdrop-blur-none transition-all duration-500" />

                  {/* Animated Gloss Effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

                  <div className="absolute inset-0 p-8 flex flex-col items-center justify-between z-10">
                    <div className="w-full flex justify-between items-start">
                      <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-xl group-hover:border-white/20 transition-all">
                        <Sparkles className={cn("w-5 h-5", league.accent)} />
                      </div>
                      <div className="px-3 py-1 rounded-full bg-black/30 border border-white/5 backdrop-blur-md text-[8px] font-black uppercase tracking-[0.2em] text-white/70">
                        Top Elite
                      </div>
                    </div>

                    <div className={cn(
                      "relative w-28 h-28 mb-4 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] flex items-center justify-center rounded-full",
                      league.name === "English Premier League" && " "
                    )}>
                      {/* Logo Glow/Pool */}
                      <div className="absolute inset-0 bg-white/10 rounded-full blur-2xl transform scale-150" />

                      <Image
                        src={league.logo}
                        alt={league.name}
                        fill
                        className="relative z-10 object-contain p-2"
                        sizes="112px"
                      />
                    </div>

                    <div className="text-center w-full">
                      <h3 className="text-lg font-black text-white uppercase italic tracking-tighter leading-tight group-hover:text-white transition-colors">
                        {league.name}
                      </h3>
                      <div className="mt-2 flex items-center justify-center gap-2">
                        <span className="h-px w-4 bg-white/20" />
                        <p className="text-white/50 text-[9px] font-bold tracking-[0.2em] uppercase">
                          {leagueStats[league.name] || 0} Matches
                        </p>
                        <span className="h-px w-4 bg-white/20" />
                      </div>
                    </div>
                  </div>

                  {/* Bottom Highlight */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
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
          <nav className="mb-12 glass border border-white/5 p-8 rounded-[3rem] overflow-hidden">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between px-2">
                <motion.div
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    className="p-2 rounded-xl bg-primary/10 text-primary"
                    whileHover={{ scale: 1.1, rotate: 12 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Trophy className="w-5 h-5" />
                  </motion.div>
                  <div>
                    <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-1">League Filters</span>
                    <h3 className="text-xl font-black uppercase italic tracking-tighter">Browse Categories</h3>
                  </div>
                </motion.div>
              </div>

              <motion.div
                layout
                className="flex flex-wrap items-center justify-center gap-3"
                initial={false}
                animate={{
                  height: "auto",
                  transition: {
                    duration: 0.4,
                    ease: [0.4, 0, 0.2, 1]
                  }
                }}
              >
                <motion.button
                  onClick={() => setActiveLeague("all")}
                  className={cn(
                    "whitespace-nowrap px-6 py-3 rounded-2xl cursor-pointer font-black text-[10px] tracking-[0.2em] uppercase flex items-center gap-2",
                    activeLeague === "all" ? "gradient-sports text-white shadow-xl" : "hover:bg-muted text-muted-foreground bg-muted/20"
                  )}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  layout
                >
                  <LayoutGrid className="w-4 h-4" /> All Matches
                </motion.button>

                <AnimatePresence mode="popLayout">
                  {displayedLeagues.map(([name, count], index) => (
                    <motion.button
                      key={name}
                      layout
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        transition: {
                          duration: 0.3,
                          delay: index * 0.03,
                          ease: [0.4, 0, 0.2, 1]
                        }
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.8,
                        y: -20,
                        transition: {
                          duration: 0.2,
                          delay: (displayedLeagues.length - index) * 0.02
                        }
                      }}
                      onClick={() => setActiveLeague(name)}
                      className={cn(
                        "whitespace-nowrap px-6 py-3 rounded-2xl cursor-pointer font-black text-[10px] tracking-[0.2em] uppercase flex items-center gap-2 group",
                        activeLeague === name ? "gradient-sports text-white shadow-xl" : "glass hover:bg-muted text-muted-foreground border border-white/5"
                      )}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <span className="truncate max-w-[200px]">{name}</span>
                      <motion.span
                        className={cn(
                          "px-2 py-0.5 rounded-lg text-[8px] font-black",
                          activeLeague === name ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
                        )}
                        whileHover={{ scale: 1.1 }}
                      >
                        {count}
                      </motion.span>
                    </motion.button>
                  ))}
                </AnimatePresence>

                {hasMoreLeaguesToLoad && (
                  <motion.button
                    onClick={loadMore}
                    className="w-full mt-4 px-8 py-3.5 cursor-pointer rounded-2xl glass hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-300 text-[10px] font-black uppercase tracking-[0.3em] border border-white/5 flex items-center justify-center gap-3 group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <span>Load More Leagues</span>
                    <motion.div
                      animate={{ y: [0, 3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <ChevronRight className="w-4 h-4 rotate-90" />
                    </motion.div>
                    <span className="text-[8px] opacity-50">+5</span>
                  </motion.button>
                )}
              </motion.div>
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
                Array.from({ length: 8 }).map((_, i) => <MatchSkeleton key={i} />)
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
