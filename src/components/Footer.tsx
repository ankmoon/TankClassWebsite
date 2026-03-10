"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Linkedin, Facebook, Mail } from "lucide-react";

export default function Footer() {
    const t = useTranslations("Footer");

    return (
        <footer className="bg-white border-t border-gray-100 pt-24 pb-12 font-body overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-20">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
                    <div className="md:col-span-5">
                        <div className="flex items-center gap-4 mb-8 font-display group">
                            <div className="size-10 bg-primary flex items-center justify-center rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-lg font-black tracking-tighter">shield_person</span>
                            </div>
                            <h2 className="text-primary font-black text-2xl tracking-tighter uppercase transition-colors">TankMentor</h2>
                        </div>
                        <p className="text-gray-500 text-lg leading-relaxed mb-10 max-w-sm font-medium">
                            {t("tagline")}
                        </p>
                        <div className="flex gap-4">
                            <a 
                                className="size-12 rounded-2xl border border-gray-100 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#0077B5] hover:border-[#0077B5] hover:shadow-xl transition-all duration-300" 
                                href="https://www.linkedin.com/in/hoang-tuan-anh-742296101/" 
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn"
                            >
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a 
                                className="size-12 rounded-2xl border border-gray-100 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1877F2] hover:border-[#1877F2] hover:shadow-xl transition-all duration-300" 
                                href="https://web.facebook.com/TankBAClass" 
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Facebook"
                            >
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a 
                                className="size-12 rounded-2xl border border-gray-100 flex items-center justify-center text-gray-400 hover:text-white hover:bg-accent hover:border-accent hover:shadow-xl transition-all duration-300" 
                                href="/contact"
                                aria-label="Contact"
                            >
                                <Mail className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                    
                    <div className="md:col-span-3">
                        <h5 className="text-primary font-black text-[10px] uppercase tracking-[0.2em] mb-10 font-display opacity-40">LEARNING SPACE</h5>
                        <ul className="space-y-5 font-black text-xs text-primary/70 tracking-widest uppercase">
                            <li><Link className="hover:text-accent transition-colors" href="/programs">1-on-1 Mentoring</Link></li>
                            <li><Link className="hover:text-accent transition-colors" href="/programs">Group Workshops</Link></li>
                            <li><Link className="hover:text-accent transition-colors" href="/resources">Resources & Guides</Link></li>
                            <li><Link className="hover:text-accent transition-colors" href="/blog">Case Studies</Link></li>
                        </ul>
                    </div>

                    <div className="md:col-span-4">
                        <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-accent/10 transition-all"></div>
                            <h5 className="text-primary font-black text-[10px] uppercase tracking-[0.2em] mb-6 font-display opacity-80 relative z-10">{t("newsletter")}</h5>
                            <p className="text-xs text-gray-500 mb-8 font-bold leading-relaxed relative z-10">Get weekly insights on BA/PM strategy directly in your inbox.</p>
                            <form className="flex gap-3 relative z-10">
                                <input
                                    className="flex-1 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none text-xs font-black px-5 py-4 transition-all"
                                    placeholder="Enter your email"
                                    type="email"
                                />
                                <button className="bg-primary text-white p-4 rounded-xl hover:bg-accent hover:shadow-xl transition-all shadow-lg active:scale-95 group/btn">
                                    <span className="material-symbols-outlined text-sm font-black group-hover/btn:translate-x-1 transition-transform">send</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                
                <div className="pt-12 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none">© {new Date().getFullYear()} TankMentor. All rights reserved.</p>
                    <div className="flex gap-10">
                        <Link href="/about" className="text-[10px] font-black text-gray-300 hover:text-primary transition-colors uppercase tracking-widest leading-none">Privacy Policy</Link>
                        <Link href="/terms-of-service" className="text-[10px] font-black text-gray-300 hover:text-primary transition-colors uppercase tracking-widest leading-none">Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
