"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const t = useTranslations("Navbar");

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur-md px-6 lg:px-20 py-4 font-display">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="size-9 bg-primary flex items-center justify-center rounded text-white transform hover:rotate-6 transition-transform">
                        <span className="material-symbols-outlined text-xl font-black">shield_person</span>
                    </div>
                    <Link href="/" className="text-primary text-xl font-black tracking-tight uppercase hover:opacity-80 transition-opacity">
                        TankMentor
                    </Link>
                </div>

                <nav className="hidden md:flex items-center gap-10 text-sm font-bold text-gray-500">
                    <Link href="/" className="text-xs font-black text-primary hover:text-accent transition-colors tracking-widest uppercase">
                        {t("home")}
                    </Link>
                    <Link href="/programs" className="text-xs font-black text-primary hover:text-accent transition-colors tracking-widest uppercase">{t("programs")}</Link>
                    <Link href="/about" className="text-xs font-black text-primary hover:text-accent transition-colors tracking-widest uppercase">{t("about")}</Link>
                    <Link href="/blog" className="text-xs font-black text-primary hover:text-accent transition-colors tracking-widest uppercase">{t("blog")}</Link>
                    <Link href="/contact" className="text-xs font-black text-primary hover:text-accent transition-colors tracking-widest uppercase">{t("contact")}</Link>
                </nav>

                <div className="flex items-center gap-4">
                    <LanguageSwitcher />
                    <button className="text-gray-400 hover:text-primary transition-colors hidden sm:block">
                        <span className="material-symbols-outlined">search</span>
                    </button>
                    <Link
                        href="/contact"
                        className="hidden md:block bg-primary text-white px-5 py-2.5 rounded-lg font-black text-xs tracking-widest uppercase hover:bg-accent hover:shadow-lg transition-all"
                    >
                        {t("workWithMe")}
                    </Link>
                    <button
                        className="md:hidden text-primary"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <span className="material-symbols-outlined">{isMenuOpen ? "close" : "menu"}</span>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 py-6 px-6 flex flex-col gap-6 font-bold text-gray-500 shadow-xl animate-in slide-in-from-top duration-300">
                    <Link href="/" onClick={() => setIsMenuOpen(false)}>{t("home")}</Link>
                    <Link href="/programs" onClick={() => setIsMenuOpen(false)}>{t("programs")}</Link>
                    <Link href="/about" onClick={() => setIsMenuOpen(false)}>{t("about")}</Link>
                    <Link href="/blog" onClick={() => setIsMenuOpen(false)}>{t("blog")}</Link>
                    <Link href="/contact" onClick={() => setIsMenuOpen(false)}>{t("contact")}</Link>
                    <Link href="/contact" className="bg-primary text-white px-5 py-3 rounded-lg text-center" onClick={() => setIsMenuOpen(false)}>
                        {t("workWithMe")}
                    </Link>
                </div>
            )}
        </header>
    );
}
