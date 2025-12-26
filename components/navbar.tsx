"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Trophy, Search, Menu, X, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

import { SearchOverlay } from "@/components/search-overlay"

export function Navbar() {
    const [isOpen, setIsOpen] = React.useState(false)
    const [isSearchOpen, setIsSearchOpen] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)
    const { theme, setTheme } = useTheme()
    const pathname = usePathname()

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Leagues", href: "/#leagues" },
        { name: "Top Matches", href: "/#matches" },
    ]

    return (
        <>
            <nav
                className={cn(
                    "fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 w-[95%] md:w-[90%] max-w-7xl",
                    isScrolled ? "py-0" : "py-0"
                )}
            >
                {/* Main Navbar Pill */}
                <div className={cn(
                    "relative z-50 transition-all duration-500 rounded-full border border-transparent",
                    isScrolled ? "bg-black/20 backdrop-blur-xl border-white/10 shadow-lg py-3" : "bg-transparent py-6"
                )}>
                    <div className="container mx-auto px-6 flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2 group cursor-pointer selection:bg-none">
                            <span className="font-tourney text-3xl font-black tracking-widest text-foreground group-hover:text-primary transition-colors duration-300">
                                APEX
                            </span>
                            <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-primary mb-1 group-hover:scale-125 transition-transform duration-300 shadow-[0_0_10px_theme(colors.primary.DEFAULT)]" />
                            <span className="text-sm font-bold tracking-[0.3em] text-muted-foreground group-hover:text-foreground transition-colors duration-300 uppercase mt-0.5">
                                SPORTS
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center space-x-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={cn(
                                        "text-sm font-medium hover:text-primary transition-colors",
                                        pathname === link.href ? "text-primary" : "text-muted-foreground"
                                    )}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <button onClick={() => setIsSearchOpen(true)}>
                                <Search className="w-5 h-5 cursor-pointer hover:text-primary transition-colors text-muted-foreground" />
                            </button>
                            <motion.button
                                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                className="p-2 rounded-full hover:bg-muted/50 transition-colors"
                                whileTap={{ scale: 0.9, rotate: 180 }}
                                transition={{ duration: 0.2 }}
                            >
                                {theme === "dark" ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-foreground" />}
                            </motion.button>
                        </div>

                        {/* Mobile Toggle */}
                        <div className="md:hidden flex items-center space-x-4 ">
                            <button
                                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                className="p-2 rounded-full hover:bg-muted cursor-pointer"
                            >
                                {theme === "dark" ? <Sun className="w-5 h-5 text-foreground" /> : <Moon className="w-5 h-5 text-foreground" />}
                            </button>
                            <button onClick={() => setIsOpen(!isOpen)} className="text-foreground cursor-pointer">
                                {isOpen ? <X /> : <Menu />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Independent Mobile Menu Card */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="md:hidden glass rounded-3xl border border-white/10 mt-3 overflow-hidden shadow-2xl"
                        >
                            <div className="flex flex-col p-6 space-y-4">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className="text-lg font-black uppercase tracking-widest text-foreground hover:text-primary transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                                <div className="h-px bg-white/10 w-full" />
                                <button
                                    onClick={() => {
                                        setIsOpen(false)
                                        setIsSearchOpen(true)
                                    }}
                                    className="flex items-center space-x-3 text-lg font-black uppercase tracking-widest text-primary"
                                >
                                    <Search className="w-5 h-5" />
                                    <span>Search Matches</span>
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
            <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    )
}
