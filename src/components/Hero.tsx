"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function Hero() {
    const t = useTranslations("Hero");

    return (
        <section className="relative bg-background pt-16 pb-24 px-6 lg:px-20 overflow-hidden font-body">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="z-10 order-2 lg:order-1">
                    <span className="text-accent font-black text-[10px] uppercase tracking-[0.2em] mb-4 block font-display">
                        {t("label")}
                    </span>
                    <h1 className="text-5xl lg:text-7xl font-black text-primary leading-[1.1] mb-8 font-display">
                        {t.rich("title", {
                            br: () => <br />
                        })}
                    </h1>
                    <p className="text-lg text-gray-500 leading-relaxed mb-10 max-w-lg font-medium">
                        {t("description")}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            href="/contact"
                            className="bg-primary text-white px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-accent hover:shadow-2xl transition-all flex items-center justify-center gap-2 group"
                        >
                            {t("getStarted")} <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </Link>
                        <Link
                            href="/programs"
                            className="bg-white border-2 border-primary/5 text-primary px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all text-center"
                        >
                            {t("viewPrograms")}
                        </Link>
                    </div>
                    <div className="mt-12 flex items-center gap-4">
                        <div className="flex -space-x-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 overflow-hidden relative shadow-sm">
                                    <div className="absolute inset-0 bg-accent/5 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-xs text-accent">person</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none">
                            <span className="text-primary text-lg font-black block">{t("stats", { count: 500 })}</span>
                        </p>
                    </div>
                </div>
                <div className="relative order-1 lg:order-2">
                    <div className="absolute -top-10 -right-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl animate-pulse"></div>
                    <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-white aspect-[4/5] lg:aspect-auto lg:h-[640px]">
                        <Image
                            alt="Professional Portrait"
                            className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmfkilKQ7te7G649bJ3xcD9ElbbvNhutDHXuRgiJHIcnOherbWvAOMsmh48K2ZCrT7RwElFfeFbGwQDXKfMuze6N8D2jb-RGmEcF21FHopD97J3xC_jv8lHh46Ge83pt6XZ5brFBmoERWPI6TTwbkI91dGYtxfaGb4VsDl9SmIKWFygNJBV_3054GE7x2HRhiJMU2MVpRHG1Swj2XTDKvFQXQ69ZDIMEBOlnLHwrXB_K_LSyXuVIbtSZBbEVqHJMBTIVr1dKI5448"
                            fill
                            priority
                        />
                        <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-2xl">
                            <div className="flex items-center gap-6">
                                <div className="p-3 bg-accent/10 rounded-2xl text-accent shadow-inner">
                                    <span className="material-symbols-outlined text-3xl">verified</span>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Founder & Head Mentor</p>
                                    <p className="text-primary font-black text-lg font-display tracking-tight leading-none">Strategic Excellence Guaranteed</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
