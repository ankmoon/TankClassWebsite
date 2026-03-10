import { Download, FileText, Layout, Video, ExternalLink } from "lucide-react";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
    const t = await getTranslations("SEO.resources");
    return {
        title: t("title"),
        description: t("description"),
    };
}

const getResourcesData = (t: any) => [
    {
        title: "Requirements Document Template",
        description: "A comprehensive PRD/BRD template used in 100+ professional projects.",
        type: t("items.template"),
        icon: FileText,
        color: "bg-blue-600",
        link: "#",
    },
    {
        title: "Agile Estimation Guide",
        description: "Tactical framework for story pointing and sprint capacity planning.",
        type: t("items.guide"),
        icon: Layout,
        color: "bg-accent",
        link: "#",
    },
    {
        title: "Stakeholder Management Map",
        description: "Visual framework for identifying and managing key project stakeholders.",
        type: t("items.framework"),
        icon: Video,
        color: "bg-purple-600",
        link: "#",
    }
];

export default async function ResourcesPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations("Resources");
    const resources = getResourcesData(t);

    return (
        <main className="min-h-screen bg-white font-body">
            {/* Hero Section */}
            <section className="pt-32 pb-24 px-6 lg:px-20 bg-primary relative overflow-hidden text-center text-white font-display">
                <div className="max-w-4xl mx-auto relative z-10">
                    <span className="px-5 py-2 bg-white/10 text-accent rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] mb-10 inline-block border border-white/10 backdrop-blur-sm">
                        {t("badge")}
                    </span>
                    <h1 className="text-5xl md:text-8xl font-black mb-8 leading-tight tracking-tight">
                        {t.rich("title", {
                            span: (chunks) => <span className="text-accent underline decoration-8 underline-offset-8">{chunks}</span>
                        })}
                    </h1>
                    <p className="text-xl text-white/50 max-w-2xl mx-auto leading-relaxed font-medium">
                        {t("description")}
                    </p>
                </div>
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/15 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/2"></div>
            </section>

            {/* Resources Grid */}
            <section className="py-24 px-6 lg:px-20 -mt-24 relative z-20">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {resources.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <div key={idx} className="bg-white rounded-[4rem] shadow-2xl hover:shadow-primary/5 p-12 hover:-translate-y-4 transition-all duration-500 flex flex-col group border border-white/50 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full -mr-16 -mt-16 group-hover:bg-accent/5 transition-all duration-500"></div>
                                <div className={`w-20 h-20 ${item.color} rounded-[2rem] flex items-center justify-center mb-10 shadow-xl group-hover:rotate-12 transition-all duration-300 relative z-10`}>
                                    <Icon className="w-10 h-10 text-white" />
                                </div>
                                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-4 inline-block relative z-10 leading-none">{item.type}</span>
                                <h3 className="text-2xl font-black text-primary mb-6 leading-tight font-display tracking-tight relative z-10">{item.title}</h3>
                                <p className="text-gray-500 mb-12 leading-relaxed text-sm font-medium flex-grow relative z-10 opacity-70">
                                    {item.description}
                                </p>

                                <div className="pt-10 border-t border-gray-50 flex items-center justify-between relative z-10">
                                    <Link href={item.link as any} className="flex items-center gap-3 text-primary font-black text-[10px] tracking-[0.2em] uppercase hover:text-accent transition-all group/link">
                                        {t("download")} <Download className="w-4 h-4 group-hover/link:translate-y-0.5 transition-transform" />
                                    </Link>
                                    <div className="bg-gray-50 p-4 rounded-2xl group-hover:bg-accent/10 transition-all active:scale-95">
                                        <ExternalLink className="w-6 h-6 text-gray-400 group-hover:text-accent" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 px-6 lg:px-20 bg-background/20 relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-100 to-transparent"></div>
                <div className="max-w-6xl mx-auto bg-white rounded-[5rem] p-12 md:p-24 shadow-2xl border border-white/50 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div className="max-w-xl">
                            <h2 className="text-4xl md:text-6xl font-black text-primary mb-8 font-display tracking-tight leading-tight">{t("ctaTitle")}</h2>
                            <p className="text-xl text-gray-400 mb-12 font-medium leading-relaxed">
                                {t("ctaDesc")}
                            </p>
                            <Link
                                href="/contact"
                                className="inline-block bg-primary text-white px-16 py-6 rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-accent hover:shadow-2xl transition-all shadow-xl active:scale-95"
                            >
                                {t("ctaButton")}
                            </Link>
                        </div>
                        <div className="relative">
                            <div className="w-full h-80 bg-background rounded-[4rem] flex items-center justify-center p-12 border border-gray-100 relative group">
                                <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[4rem]"></div>
                                <span className="material-symbols-outlined text-9xl text-primary/10 select-none">architecture</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
