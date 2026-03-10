import { Link } from "@/i18n/routing";
import { getPrograms } from "@/lib/notion";
import { CheckCircle2, Layout, Terminal, Users, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

const IconMap: Record<string, any> = {
    layout: Layout,
    terminal: Terminal,
    users: Users,
};

const ColorMap: Record<string, string> = {
    blue: "bg-blue-600",
    accent: "bg-accent",
    purple: "bg-purple-600",
};

import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
    const t = await getTranslations("SEO.programs");
    return {
        title: t("title"),
        description: t("description"),
    };
}

export default async function ProgramsPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const programs = await getPrograms(locale);
    
    const { getTranslations } = await import('next-intl/server');
    const t = await getTranslations("Programs");

    return (
        <main className="min-h-screen font-body bg-white">
            {/* Page Header */}
            <section className="pt-32 pb-24 px-6 lg:px-20 bg-primary relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="max-w-6xl mx-auto text-center relative z-10">
                    <span className="px-5 py-2 bg-white/5 text-accent rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] mb-8 inline-block backdrop-blur-sm border border-white/10">
                        {t("badge")}
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight font-display tracking-tight">
                        {t.rich("title", {
                            br: () => <br />,
                            span: (chunks) => <span className="text-accent underline decoration-8 underline-offset-8">{chunks}</span>
                        })}
                    </h1>
                    <p className="text-lg md:text-xl text-white/50 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
                        {t("description")}
                    </p>
                </div>
            </section>

            {/* Programs Grid */}
            <section className="py-20 px-6 lg:px-20 -mt-20 relative z-20">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {programs.length > 0 ? (
                        programs.map((p, idx) => {
                            const IconComponent = IconMap[p.icon] || Layout;
                            const colorClass = ColorMap[p.color] || "bg-blue-600";

                            return (
                                <Link href={{ pathname: '/programs/[slug]', params: { slug: p.slug } }} key={idx} className="bg-white rounded-[3rem] shadow-xl hover:shadow-2xl p-10 md:p-12 hover:-translate-y-2 transition-all duration-500 flex flex-col group border border-gray-50/50 w-full max-w-full relative overflow-hidden">
                                     <div className={`w-16 h-16 md:w-20 md:h-20 ${colorClass} rounded-2xl flex items-center justify-center mb-10 shadow-lg group-hover:rotate-12 transition-all duration-300 relative z-10`}>
                                         <IconComponent className="w-8 h-8 text-white" />
                                     </div>
                                     <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 inline-block relative z-10">{p.category}</span>
                                     <h3 className="text-2xl md:text-3xl font-black text-primary mb-6 font-display tracking-tight relative z-10">{p.title}</h3>
                                     <p className="text-gray-500 mb-12 leading-relaxed text-sm font-medium relative z-10">
                                         {p.description}
                                     </p>
 
                                     <div className="space-y-4 mb-16 flex-grow relative z-10">
                                         {p.features.map((f: string, i: number) => (
                                             <div key={i} className="flex items-center gap-4">
                                                 <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                                                 <span className="text-xs font-black text-primary/80 uppercase tracking-widest leading-none">{f}</span>
                                             </div>
                                         ))}
                                     </div>
 
                                     <div className="pt-10 border-t border-gray-100 flex items-center justify-between relative z-10">
                                         <div>
                                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t("fee")}</p>
                                             <p className="text-2xl font-black text-primary font-display">{p.price}</p>
                                         </div>
                                         <div className="bg-primary text-white p-5 rounded-2xl group-hover:bg-accent group-hover:shadow-lg transition-all active:scale-95">
                                             <ExternalLink className="w-6 h-6" />
                                         </div>
                                     </div>
                                 </Link>
                             );
                         })
                     ) : (
                         <div className="col-span-full py-40 text-center text-gray-300 font-black uppercase tracking-widest text-sm opacity-50">
                             {t("empty")}
                         </div>
                     )}
                </div>
            </section>
 
            {/* Corporate Training Section */}
            <section className="py-24 px-6 lg:px-20 bg-background/30 overflow-hidden">
                <div className="max-w-7xl mx-auto bg-white rounded-[4rem] px-10 py-24 md:p-24 shadow-2xl overflow-hidden relative border border-white/20">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-accent/5 -skew-x-12 translate-x-1/2"></div>
                    <div className="grid lg:grid-cols-2 gap-20 items-center relative z-10">
                        <div className="max-w-xl">
                            <h2 className="text-4xl md:text-5xl font-black text-primary mb-8 leading-tight font-display tracking-tight">{t("corporateTitle")}</h2>
                            <p className="text-xl text-gray-500 mb-12 leading-relaxed font-medium">
                                {t("corporateDesc")}
                            </p>
                            <div className="flex gap-4">
                                <Link href="/contact" className="bg-primary text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-accent hover:shadow-2xl transition-all shadow-xl">
                                    {t("corporateButton")}
                                </Link>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="p-10 bg-blue-50/50 rounded-[2.5rem] text-center border border-blue-100/50">
                                <p className="text-5xl font-black text-primary mb-3 font-display">30+</p>
                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{t("partners")}</p>
                            </div>
                            <div className="p-10 bg-orange-50/50 rounded-[2.5rem] text-center mt-10 border border-orange-100/50">
                                <p className="text-5xl font-black text-primary mb-3 font-display">2k+</p>
                                <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest">{t("students")}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
