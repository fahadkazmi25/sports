"use client"

import React, { useRef } from "react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { Trophy, Zap, Activity } from "lucide-react"

export function Hero() {
    const containerRef = useRef<HTMLDivElement>(null)
    const { scrollY } = useScroll()
    const y1 = useTransform(scrollY, [0, 500], [0, 200])
    const opacity = useTransform(scrollY, [0, 300], [1, 0])

    return (
        <section
            ref={containerRef}
            className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
        >
            {/* Background Animated Elements */}
            <div className="absolute inset-0 z-0">
                <motion.div
                    style={{ y: y1 }}
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] mix-blend-screen animate-pulse"
                />
                <motion.div
                    style={{ y: y1 }}
                    className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse delay-700"
                />
            </div>

            <div className="container mx-auto px-4 z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    style={{ opacity }}
                >
                    <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass border border-white/10 text-xs font-bold uppercase tracking-[0.2em] text-primary mb-8 shadow-xl">
                        <Activity className="w-4 h-4 animate-bounce" />
                        <span>Live Intelligence Enabled</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-6 tracking-tighter uppercase italic leading-[0.8]">
                        <span className="block text-foreground">The Future of</span>
                        <span className="block gradient-sports bg-clip-text text-transparent drop-shadow-2xl">Sports Motion.</span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground font-light tracking-wide mb-12">
                        Immersive 3D Match Discovery. Interactive League Insights.
                        Real-time data meets premium cinematic design.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                        <button className="group relative px-8 py-4 rounded-xl gradient-sports text-white font-bold overflow-hidden shadow-2xl transition-all hover:scale-105 active:scale-95">
                            <span className="relative z-10 flex items-center gap-2">
                                Explore Matches <Zap className="w-5 h-5 fill-current" />
                            </span>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </button>

                        <button className="px-8 py-4 rounded-xl glass border border-white/10 font-bold hover:bg-white/5 transition-all">
                            View Rankings
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Floating 3D Cards or Icons could go here */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
                <div className="w-6 h-10 border-2 border-muted-foreground rounded-full flex justify-center p-1">
                    <div className="w-1 h-3 bg-muted-foreground rounded-full" />
                </div>
            </div>
        </section>
    )
}
