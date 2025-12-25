"use client"

import { useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { AlertTriangle, Home, RotateCcw } from "lucide-react"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center">
            {/* Background Ambience */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-[20%] right-[20%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="glass border border-white/10 p-12 rounded-[3rem] max-w-2xl w-full flex flex-col items-center"
            >
                <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center mb-8 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                    <AlertTriangle className="w-10 h-10 text-red-500" />
                </div>

                <h1 className="text-5xl md:text-6xl font-black font-tourney uppercase italic tracking-tighter mb-4 text-foreground">
                    Match <span className="text-red-500">Interrupted</span>
                </h1>

                <p className="text-muted-foreground text-lg mb-8 max-w-md font-medium">
                    A technical foul occurred. Our improved VAR system has logged this incident.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <button
                        onClick={() => reset()}
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-2xl bg-red-500 text-white font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg hover:shadow-red-500/25"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Replay Query
                    </button>

                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-2xl glass border border-white/10 hover:bg-white/5 font-black uppercase tracking-widest transition-all"
                    >
                        <Home className="w-4 h-4" />
                        Home Stadium
                    </Link>
                </div>
            </motion.div>
        </div>
    )
}
