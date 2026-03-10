"use client";

import { useState } from "react";
import { Mail, Phone, Send, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ContactPage() {
    const t = useTranslations("Contact");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        service: "BA Mentoring (Career Path)",
        message: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                body: JSON.stringify(formData),
                headers: { "Content-Type": "application/json" },
            });

            if (res.ok) setStatus("success");
            else setStatus("error");
        } catch (err) {
            setStatus("error");
        }
    };

    return (
        <main className="min-h-screen bg-white font-body">
            <section className="pt-32 pb-24 px-6 lg:px-20 bg-background/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">

                    {/* Info Side */}
                    <div className="relative z-10">
                        <span className="px-5 py-2 bg-accent/5 text-accent rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] mb-10 inline-block border border-accent/10 backdrop-blur-sm">
                            {t("badge")}
                        </span>
                        <h1 className="text-4xl md:text-7xl font-black text-primary mb-10 leading-[1.1] font-display tracking-tight">
                            {t.rich("title", {
                                br: () => <br />,
                                span: (chunks) => <span className="text-accent underline decoration-8 underline-offset-8">{chunks}</span>
                            })}
                        </h1>
                        <p className="text-xl text-gray-400 mb-16 max-w-md leading-relaxed font-medium">
                            {t("description")}
                        </p>

                        <div className="space-y-10">
                            <div className="flex items-center gap-8 group">
                                <div className="w-16 h-16 rounded-[1.5rem] bg-white shadow-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 border border-gray-50">
                                    <Mail className="w-8 h-8" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none">{t("emailMe")}</p>
                                    <p className="text-xl font-black text-primary font-display tracking-tight">hello@tankmentor.com</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-8 group">
                                <div className="w-16 h-16 rounded-[1.5rem] bg-white shadow-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 border border-gray-50">
                                    <Phone className="w-8 h-8" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none">{t("callMe")}</p>
                                    <p className="text-xl font-black text-primary font-display tracking-tight">+84 900 000 000</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Side */}
                    <div className="bg-white p-12 md:p-16 rounded-[4rem] shadow-2xl relative overflow-hidden border border-white/20">
                        {status === "success" ? (
                            <div className="py-24 text-center animate-in fade-in zoom-in duration-700">
                                <div className="w-24 h-24 bg-accent/5 text-accent rounded-full flex items-center justify-center mx-auto mb-10 shadow-inner">
                                    <CheckCircle2 className="w-12 h-12" />
                                </div>
                                <h2 className="text-4xl font-black text-primary mb-6 font-display tracking-tight">{t("successTitle")}</h2>
                                <p className="text-lg text-gray-500 mb-12 font-medium">{t("successDesc")}</p>
                                <button
                                    onClick={() => setStatus("idle")}
                                    className="px-12 py-5 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-accent hover:shadow-2xl transition-all shadow-xl active:scale-95"
                                >
                                    {t("sendAnother")}
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest ml-2 block leading-none">{t("name")}</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder={t("namePlaceholder")}
                                            className="w-full px-8 py-5 bg-background border-transparent border focus:border-accent/30 rounded-2xl focus:ring-0 outline-none font-bold text-primary transition-all shadow-inner placeholder:text-gray-300"
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest ml-2 block leading-none">{t("email")}</label>
                                        <input
                                            required
                                            type="email"
                                            placeholder={t("emailPlaceholder")}
                                            className="w-full px-8 py-5 bg-background border-transparent border focus:border-accent/30 rounded-2xl focus:ring-0 outline-none font-bold text-primary transition-all shadow-inner placeholder:text-gray-300"
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest ml-2 block leading-none">{t("interest")}</label>
                                    <div className="relative">
                                         <select
                                            className="w-full px-8 py-5 bg-background border-transparent border focus:border-accent/30 rounded-2xl focus:ring-0 outline-none font-black text-xs uppercase tracking-widest text-primary appearance-none transition-all shadow-inner"
                                            onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                                        >
                                            <option>BA Mentoring (Career Path)</option>
                                            <option>PM Professional Training</option>
                                            <option>Strategic Consulting</option>
                                            <option>Soft Skills for Professionals</option>
                                        </select>
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-primary/20">
                                            <span className="material-symbols-outlined font-black">expand_more</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest ml-2 block leading-none">{t("message")}</label>
                                    <textarea
                                        required
                                        rows={5}
                                        placeholder={t("messagePlaceholder")}
                                        className="w-full px-8 py-6 bg-background border-transparent border focus:border-accent/30 rounded-3xl focus:ring-0 outline-none font-bold text-primary transition-all resize-none shadow-inner placeholder:text-gray-300"
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    ></textarea>
                                </div>

                                <button
                                    disabled={status === "loading"}
                                    type="submit"
                                    className="w-full py-6 bg-primary text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-accent hover:shadow-2xl transition-all flex items-center justify-center gap-4 disabled:bg-gray-200 group shadow-xl active:scale-95"
                                >
                                    {status === "loading" ? t("sending") : (
                                        <>
                                            {t("submit")}
                                            <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}

                        {status === "error" && (
                            <p className="mt-8 text-center text-red-400 font-black text-[10px] uppercase tracking-widest italic">{t("error")}</p>
                        )}
                    </div>

                </div>
            </section>
        </main>
    );
}
