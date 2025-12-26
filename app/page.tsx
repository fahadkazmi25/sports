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
  const [isToday, setIsToday] = useState(false)

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
        const res = await fetch(`/api/matches?page=${page}&limit=12&includeStats=true${leagueQuery}${isToday ? "&today=true" : ""}`)
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
  }, [page, activeLeague, isToday])

  // Reset pagination when league changes
  useEffect(() => {
    setPage(1)
    setMatches([])
    setHasMore(true)
  }, [activeLeague, isToday])

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
      <section id="leagues" className="py-24 bg-background relative overflow-hidden">
        {/* Subtle background accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-16">
            <div>
              <p className="text-primary text-xs font-black uppercase tracking-[0.3em] mb-2">/ Featured</p>
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter uppercase italic text-foreground">Elite Leagues</h2>
            </div>
            <p className="text-muted-foreground text-sm max-w-xs">Select a league to dive into detailed match data and statistics.</p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {topLeagues.map((league, i) => (
              <Link
                key={league.name}
                href={`/league/${slugify(league.name)}`}
                className={cn(
                  "group relative block rounded-3xl overflow-hidden transition-all duration-500",
                  "shadow-xl hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-lg dark:hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]",
                  i === 0 ? "md:col-span-2 lg:col-span-2 lg:row-span-2" : ""
                )}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5, ease: "easeOut" }}
                  className={cn(
                    "relative w-full h-full min-h-[280px] flex flex-col justify-between p-6 md:p-8",
                    "bg-card border-2 border-border transition-colors duration-500",
                    "group-hover:border-primary/50",
                    "dark:bg-card/50 dark:border-border/50 dark:backdrop-blur-sm dark:group-hover:border-primary/30",
                    i === 0 && "lg:min-h-[580px]"
                  )}
                >
                  {/* Background Gradient Accent (hover only) */}
                  <div className={cn(
                    "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br",
                    league.color
                  )} style={{ mixBlendMode: 'soft-light' }} />

                  {/* Accent Bar at Bottom */}
                  {/* <div className={cn(
                    "absolute bottom-0 left-0 right-0 h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left bg-gradient-to-r",
                    league.color
                  )} /> */}

                  {/* Top Row: Index & Arrow */}
                  <div className="relative z-10 flex items-start justify-between ">
                    <span className="font-tourney text-6xl md:text-7xl font-black text-foreground/50 group-hover:text-foreground dark:group-hover:text-foreground transition-colors duration-500 leading-none select-none">
                      0{i + 1}
                    </span>
                    <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center bg-background opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 shadow-sm">
                      <ChevronRight className="w-5 h-5 text-foreground" />
                    </div>
                  </div>

                  {/* Center: Logo */}
                  <div className="relative z-10 flex-1 flex items-center justify-center my-4">
                    <div className={cn(
                      "relative transition-all duration-500 ease-out group-hover:scale-110 group-hover:-translate-y-2",
                      i === 0 ? "w-32 h-32 md:w-44 md:h-44" : "w-20 h-20 md:w-24 md:h-24"
                    )}>
                      {/* Glow */}
                      <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <Image
                        src={league.logo}
                        alt={league.name}
                        fill
                        className="relative z-10 object-contain drop-shadow-lg"
                        sizes="(max-width: 768px) 100px, (max-width: 1200px) 150px, 200px"
                      />
                    </div>
                  </div>

                  {/* Bottom: Name & Stats */}
                  <div className="relative z-10 space-y-1">
                    <h3 className={cn(
                      "font-black text-foreground uppercase tracking-tight leading-tight transition-colors duration-300 group-hover:text-primary",
                      i === 0 ? "text-base md:text-3xl" : "text-base md:text-lg"
                    )}>
                      {league.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-px bg-border group-hover:bg-primary/50 transition-colors duration-300" />
                      <p className="text-muted-foreground text-[10px] font-bold tracking-[0.15em] uppercase group-hover:text-foreground transition-colors duration-300">
                        {leagueStats[league.name] || 0} Matches
                      </p>
                    </div>
                  </div>


                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section >

      {/* Matches Section */}
      < section id="matches" className="py-20 relative" >
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

                <motion.button
                  onClick={() => setIsToday(!isToday)}
                  className={cn(
                    "whitespace-nowrap px-6 py-3 rounded-2xl cursor-pointer font-black text-[10px] tracking-[0.2em] uppercase flex items-center gap-2",
                    isToday ? "bg-red-500 text-white shadow-xl shadow-red-500/20" : "glass hover:bg-muted text-muted-foreground border border-white/5"
                  )}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  layout
                >
                  <div className={cn("w-2 h-2 rounded-full", isToday ? "bg-white animate-pulse" : "bg-red-500")} />
                  {isToday ? "Today's Live" : "Show Today"}
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
                Loading more matches....
              </div>
            </div>
          )}
        </div>
      </section >
    </div >
  )
}
