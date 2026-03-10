import Image from "next/image";
import { Link } from "@/i18n/routing";
import { getAboutPage } from "@/lib/notion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ShieldCheck, Heart } from "lucide-react";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
    const t = await getTranslations("SEO.about");
    return {
        title: t("title"),
        description: t("description"),
    };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    
    // Determine which About page ID to use. 
    // If user hasn't provided a separate EN ID, fallback to the main one.
    const pageId = locale === 'en' 
        ? (process.env.NOTION_ABOUT_PAGE_ID_EN || process.env.NOTION_ABOUT_PAGE_ID!)
        : process.env.NOTION_ABOUT_PAGE_ID!;
        
    const page = await getAboutPage(pageId);
    const t = await getTranslations("About");

    return (
        <main className="min-h-screen bg-white font-body">
            {/* Hero Section */}
            <section className="pt-32 pb-24 px-6 lg:px-20 bg-background/30 relative overflow-hidden">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
                    <div className="relative z-10">
                        <span className="px-5 py-2 bg-accent/5 text-accent rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] mb-8 inline-block border border-accent/10">
                            {t("badge")}
                        </span>
                        <h1 className="text-4xl md:text-7xl font-black text-primary mb-10 leading-tight font-display tracking-tight">
                            {page.title}
                        </h1>
                        <p className="text-xl text-gray-400 mb-12 leading-relaxed italic max-w-lg font-medium">
                            {t("quote")}
                        </p>
                    </div>
                    <div className="relative">
                        <div className="absolute -top-20 -right-20 w-96 h-96 bg-accent/5 rounded-full blur-[100px]"></div>
                        <div className="w-full h-[600px] rounded-[4rem] overflow-hidden shadow-2xl relative z-10 border-[12px] border-white group">
                            <Image
                                src={page.cover}
                                alt="Tank Mentor"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700 grayscale hover:grayscale-0"
                            />
                        </div>
                        <div className="absolute -bottom-10 -left-10 bg-white/90 backdrop-blur-xl p-10 rounded-[3rem] shadow-2xl max-w-sm hidden md:block z-20 border border-white/20">
                            <div className="flex gap-6 items-center">
                                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-accent shadow-inner">
                                    <ShieldCheck className="w-10 h-10" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-lg font-black text-primary font-display">{t("certified")}</h4>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">PMP, IIBA-CBAP Certified</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Dynamic Content Section */}
            <section className="py-24 px-6 lg:px-20 bg-white">
                <div className="max-w-4xl mx-auto">
                    <article className="prose prose-xl prose-slate max-w-none 
                        prose-headings:font-display prose-headings:font-black prose-headings:text-primary prose-headings:tracking-tight
                        prose-p:text-gray-500 prose-p:leading-relaxed prose-p:font-medium
                        prose-img:rounded-[3rem] prose-img:shadow-2xl prose-img:border-[12px] prose-img:border-white
                        prose-strong:text-primary prose-strong:font-black
                        prose-blockquote:border-l-4 prose-blockquote:border-accent prose-blockquote:bg-accent/5 prose-blockquote:p-8 prose-blockquote:rounded-r-2xl prose-blockquote:italic">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {page.content}
                        </ReactMarkdown>
                    </article>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-24 px-6 lg:px-20 bg-background/20 relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div className="grid grid-cols-2 gap-8">
                            <div className="p-12 bg-primary text-white rounded-[3.5rem] shadow-2xl -rotate-2 group hover:rotate-0 transition-all duration-500 border border-primary/10">
                                <Heart className="w-12 h-12 mb-10 text-accent group-hover:scale-110 transition-transform" />
                                <h3 className="text-2xl font-black mb-6 font-display tracking-tight">{t("transparent")}</h3>
                                <p className="text-[10px] text-white/50 leading-relaxed font-black uppercase tracking-widest">
                                    {t("transparentDesc")}
                                </p>
                            </div>
                            <div className="p-12 bg-white border-2 border-primary/5 rounded-[3.5rem] shadow-2xl rotate-2 mt-20 group hover:rotate-0 transition-all duration-500 relative">
                                <div className="absolute -top-6 -right-6 w-20 h-20 bg-accent/5 rounded-full blur-xl animate-pulse"></div>
                                <h3 className="text-2xl font-black mb-6 text-primary font-display tracking-tight">{t("dedicated")}</h3>
                                <p className="text-[10px] text-gray-400 leading-relaxed font-black uppercase tracking-widest leading-loose">
                                    {t("dedicatedDesc")}
                                </p>
                            </div>
                        </div>
                        <div className="max-w-xl lg:pl-10">
                            <h2 className="text-4xl md:text-5xl font-black text-primary mb-10 leading-tight font-display tracking-tight">{t("missionTitle")}</h2>
                            <div className="space-y-8 text-lg text-gray-500 font-medium leading-relaxed">
                                <p>{t("vision")}</p>
                                <p className="p-8 bg-white rounded-3xl border-l-8 border-accent shadow-sm">{t("mission")}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6 lg:px-20">
                <div className="max-w-7xl mx-auto bg-primary rounded-[4rem] py-24 px-10 text-center relative overflow-hidden shadow-2xl border border-primary/20">
                    <div className="absolute inset-0 bg-accent/10 opacity-10"></div>
                     <div className="absolute -top-32 -right-32 w-96 h-96 bg-accent/20 rounded-full blur-[120px]"></div>
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-12 leading-tight font-display tracking-tight max-w-3xl mx-auto">
                            {t.rich("ctaTitle", {
                                br: () => <br />,
                                span: (chunks) => <span className="text-accent underline decoration-8 underline-offset-8 italic">{chunks}</span>
                            })}
                        </h2>
                        <div className="flex flex-col md:flex-row gap-6 justify-center">
                            <Link href="/contact" className="bg-accent text-white px-16 py-6 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white hover:text-primary hover:shadow-2xl transition-all shadow-xl active:scale-95">
                                {t("ctaButton")}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
