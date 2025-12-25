"use client"

import React, { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, PlayCircle, Star, Activity } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function Hero() {
    const containerRef = useRef<HTMLDivElement>(null)
    const { scrollY } = useScroll()
    const y1 = useTransform(scrollY, [0, 500], [0, 100])
    const y2 = useTransform(scrollY, [0, 500], [0, -100])

    return (
        <section
            ref={containerRef}
            className="relative min-h-[90vh] flex items-center pt-24 pb-12 overflow-hidden bg-background"
        >
            {/* Background Texture/Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-background to-background z-0" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left Side: Visuals (Image + Glass Cards) */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative hidden lg:block h-[600px] w-full"
                    >
                        {/* Main Hero Image */}
                        <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden shadow-2xl border border-border/50 dark:border-white/10">
                            <Image
                                src="/soccer-player-with-ball-grass-field.jpg"
                                alt="Agile soccer player active on grass field"
                                fill
                                className="object-cover object-center scale-105 hover:scale-110 transition-transform duration-[2s] ease-in-out"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        </div>

                        {/* Floating Glass Card 1: Live Stats */}
                        <motion.div
                            style={{ y: y1 }}
                            className="absolute -right-8 top-20 glass p-4 rounded-2xl shadow-lg border border-border/50 w-48"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-green-500/20 rounded-lg">
                                    <Activity className="w-4 h-4 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Live Activity</p>
                                    <p className="text-sm font-black text-foreground">42 Matches</p>
                                </div>
                            </div>
                            <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 w-3/4 animate-pulse" />
                            </div>
                        </motion.div>

                        {/* Floating Glass Card 2: Player Rating */}
                        <motion.div
                            style={{ y: y2 }}
                            className="absolute -left-8 bottom-32 glass p-4 rounded-2xl shadow-lg border border-border/50 flex items-center gap-4"
                        >
                            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary">
                                <Image src="/Premier_League_Logo.svg.png" alt="League" fill className="object-contain bg-muted/20 p-1" />
                            </div>
                            <div>
                                <div className="flex items-center gap-1 mb-1">
                                    <Star className="w-3 h-3 text-yellow-500 dark:text-yellow-400 fill-yellow-500 dark:fill-yellow-400" />
                                    <Star className="w-3 h-3 text-yellow-500 dark:text-yellow-400 fill-yellow-500 dark:fill-yellow-400" />
                                    <Star className="w-3 h-3 text-yellow-500 dark:text-yellow-400 fill-yellow-500 dark:fill-yellow-400" />
                                    <Star className="w-3 h-3 text-yellow-500 dark:text-yellow-400 fill-yellow-500 dark:fill-yellow-400" />
                                    <Star className="w-3 h-3 text-yellow-500 dark:text-yellow-400 fill-yellow-500 dark:fill-yellow-400" />
                                </div>
                                <p className="text-xs font-black text-foreground">Top Rated League</p>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right Side: Typography & Content */}
                    <div className="flex flex-col items-start text-left space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black tracking-[0.2em] uppercase"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            Wait for nothing
                        </motion.div>

                        <div className="space-y-4 relative">
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="font-tourney text-7xl md:text-8xl lg:text-[7rem] leading-[0.9] font-black uppercase"
                            >
                                <span className="text-foreground">APEX</span><br /><span className="text-primary">SPORTS</span>
                            </motion.h1>

                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-2xl md:text-3xl font-light text-muted-foreground tracking-tight"
                            >
                                Global Football, <span className="text-foreground font-medium italic">Unified.</span>
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="text-base text-muted-foreground/80 max-w-md leading-relaxed"
                            >
                                Experience 3D match discovery with live data from 40+ leagues worldwide. The premium universe for elite sports fans.
                            </motion.p>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="flex flex-wrap items-center gap-4"
                        >
                            <Link href="#leagues" className="group relative px-8 py-4 bg-foreground text-background rounded-xl font-black uppercase tracking-wider text-xs overflow-hidden transition-all hover:opacity-90 shadow-xl">
                                <span className="relative z-10 flex items-center gap-2">
                                    Explore Leagues <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </Link>

                            <Link href="#matches" className="group px-8 py-4 glass border border-border/50 rounded-xl font-black uppercase tracking-wider text-xs hover:bg-muted/50 transition-all flex items-center gap-2">
                                {/* <PlayCircle className="w-4 h-4 text-primary" /> */}
                                Featured Matches
                            </Link>
                        </motion.div>

                        {/* Trust/Stats Row */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="pt-8 border-t border-border/50 w-full grid grid-cols-3 gap-8"
                        >
                            <div>
                                <h4 className="text-2xl font-black font-tourney text-foreground">40+</h4>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Leagues</p>
                            </div>
                            <div>
                                <h4 className="text-2xl font-black font-tourney text-foreground">24/7</h4>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Live Data</p>
                            </div>
                            <div>
                                <h4 className="text-2xl font-black font-tourney text-foreground">10M+</h4>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Fans</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Mobile Image (Visible only on small screens) */}
                    <div className="lg:hidden relative h-[300px] w-full rounded-3xl overflow-hidden mt-8 shadow-2xl">
                        <Image
                            src="/soccer-player-with-ball-grass-field.jpg"
                            alt="Agile soccer player active on grass field"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                    </div>

                </div>
            </div>

            {/* Background Accent glow */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] pointer-events-none opacity-20 mix-blend-screen" />
        </section>
    )
}
