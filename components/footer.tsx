import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t border-border/40 py-12 glass relative z-50 mt-20">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-2 space-y-4">
                        <div className="flex items-center gap-2 select-none">
                            <span className="font-tourney text-2xl font-black tracking-widest text-foreground">
                                APEX
                            </span>
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mb-1 shadow-[0_0_10px_theme(colors.primary.DEFAULT)]" />
                            <span className="text-xs font-bold tracking-[0.3em] text-muted-foreground uppercase mt-0.5">
                                SPORTS
                            </span>
                        </div>
                        <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
                            The premier destination for cinematic match intelligence and 3D sports discovery. Experience the game like never before.
                        </p>
                    </div>

                    {/* Links Column */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-black uppercase tracking-widest text-foreground">Platform</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="hover:text-primary transition-colors cursor-pointer">Live Scores</li>
                            <li className="hover:text-primary transition-colors cursor-pointer">Leagues</li>
                            <li className="hover:text-primary transition-colors cursor-pointer">Match Stats</li>
                            <li className="hover:text-primary transition-colors cursor-pointer">API Access</li>
                        </ul>
                    </div>

                    {/* Legal Column */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-black uppercase tracking-widest text-foreground">Legal</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="hover:text-primary transition-colors cursor-pointer">Privacy Policy</li>
                            <li className="hover:text-primary transition-colors cursor-pointer">Terms of Service</li>
                            <li className="hover:text-primary transition-colors cursor-pointer">Cookie Policy</li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-muted-foreground">
                    <div>
                        &copy; {new Date().getFullYear()} ApexSports Inc. All rights reserved.
                    </div>

                    <div className="flex items-center gap-1">
                        <span>Developed by</span>
                        <a
                            href="https://fahadkazmi.vercel.app"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-foreground hover:text-primary transition-colors font-bold"
                        >
                            Fahad Kazmi
                        </a>
                        <span className="mx-2">•</span>
                        <a
                            href="https://linkedin.com/in/fahadkazmi25"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-[#0077b5] transition-colors"
                        >
                            LinkedIn
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
