import Link from "next/link"
import { Construction, ArrowRight, Home } from "lucide-react"

export default function NotFound() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center">
            {/* Background Ambience */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[30%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
            </div>

            <div className="glass border border-white/10 p-12 rounded-[3rem] max-w-2xl w-full flex flex-col items-center relative overflow-hidden">
                {/* Neon 404 Text Background */}
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[12rem] font-black opacity-[0.03] select-none font-tourney italic">
                    404
                </span>

                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-8 border border-primary/20 shadow-[0_0_30px_rgba(59,130,246,0.2)] z-10">
                    <Construction className="w-10 h-10 text-primary" />
                </div>

                <h1 className="relative z-10 text-6xl md:text-7xl font-black font-tourney uppercase italic tracking-tighter mb-4 text-foreground">
                    Off <span className="text-primary">Target</span>
                </h1>

                <p className="relative z-10 text-muted-foreground text-lg mb-8 max-w-md font-medium">
                    The page you're looking for has been relegated or doesn't exist in our league database.
                </p>

                <Link
                    href="/"
                    className="relative z-10 gradient-sports text-white px-10 py-4 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-transform flex items-center gap-3"
                >
                    <Home className="w-4 h-4" />
                    Return to Pitch
                </Link>
            </div>
        </div>
    )
}
