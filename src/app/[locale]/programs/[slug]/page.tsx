import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "@/i18n/routing";
import { getProgramBySlug } from "@/lib/notion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CheckCircle2, Layout, Terminal, Users, ArrowLeft, Send } from "lucide-react";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string, locale: string }> }) {
    const { slug, locale } = await params;
    const program = await getProgramBySlug(slug, locale);
    if (!program) return {};

    return {
        title: `${program.title} | TankMentor Programs`,
        description: program.description || `Khám phá chương trình đào tạo ${program.title} tại TankMentor.`,
        openGraph: {
            title: program.title,
            description: program.description,
            images: [program.cover].filter(Boolean) as string[],
        }
    };
}

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

export default async function ProgramDetailPage({ params }: { params: Promise<{ slug: string, locale: string }> }) {
    const { slug, locale } = await params;
    const program = await getProgramBySlug(slug, locale);

    if (!program) {
        notFound();
    }
    
    const t = await getTranslations("Programs");

    const IconComponent = IconMap[program.icon] || Layout;
    const colorClass = ColorMap[program.color] || "bg-blue-600";

    return (
        <main className="min-h-screen bg-white font-body">
            {/* Header / Hero */}
            <section className="pt-32 pb-24 px-6 lg:px-20 bg-background/50 relative overflow-hidden">
                <div className="max-w-7xl mx-auto relative z-10">
                    <Link href="/programs" className="inline-flex items-center gap-3 text-primary/40 hover:text-primary font-black text-[10px] uppercase tracking-[0.2em] mb-12 transition-all group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> {locale === 'vi' ? 'QUAY LẠI DANH SÁCH' : 'BACK TO LIST'}
                    </Link>

                    <div className="flex flex-col lg:flex-row gap-20 items-start">
                        <div className="flex-1">
                            <div className={`w-24 h-24 ${colorClass} rounded-[2.5rem] flex items-center justify-center mb-12 shadow-2xl relative group`}>
                                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity rounded-[2.5rem]"></div>
                                <IconComponent className="w-10 h-10 text-white" />
                            </div>
                            <span className="px-5 py-2 bg-accent/5 text-accent rounded-2xl text-[10px] font-black uppercase tracking-widest mb-8 inline-block border border-accent/10">
                                {program.category}
                            </span>
                            <h1 className="text-4xl md:text-7xl font-black text-primary mb-10 leading-tight font-display tracking-tight">
                                {program.title}
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-500 mb-14 leading-relaxed font-medium">
                                {program.description}
                            </p>
                        </div>

                        <div className="w-full lg:w-[450px] bg-white rounded-[4rem] p-12 shadow-2xl border border-white/20 sticky top-32 z-20">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-10 opacity-60">PROGRAM DETAILS</h3>
                            <div className="space-y-6 mb-16">
                                {program.features.map((f: string, i: number) => (
                                    <div key={i} className="flex items-center gap-5">
                                        <div className="bg-accent/5 p-2.5 rounded-2xl flex-shrink-0">
                                            <CheckCircle2 className="w-6 h-6 text-accent" />
                                        </div>
                                        <span className="text-xs font-black text-primary/80 uppercase tracking-widest leading-none">{f}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="pt-10 border-t border-gray-50 mb-12">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 opacity-60">{t("fee")}</p>
                                <p className="text-4xl font-black text-primary font-display tracking-tight">{program.price}</p>
                            </div>
                            <Link href="/contact" className="w-full bg-primary text-white py-6 rounded-3xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-accent transition-all hover:shadow-2xl shadow-xl active:scale-95 group/btn">
                                {t("corporateButton")} <Send className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2"></div>
            </section>

            {/* Content Section */}
            <section className="py-24 px-6 lg:px-20 border-t border-gray-50 bg-white relative">
                <div className="max-w-4xl mx-auto relative z-10">
                    {program.cover && (
                        <div className="w-full h-[500px] md:h-[650px] rounded-[4rem] overflow-hidden shadow-2xl mb-24 border-[16px] border-white group relative">
                            <Image 
                                src={program.cover} 
                                alt={program.title} 
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-1000" 
                            />
                        </div>
                    )}
                    
                    <div className="prose prose-xl prose-slate max-w-none 
                        prose-headings:font-display prose-headings:font-black prose-headings:text-primary prose-headings:tracking-tight
                        prose-p:text-gray-500 prose-p:leading-relaxed prose-p:font-medium
                        prose-img:rounded-[3rem] prose-img:shadow-2xl prose-img:border-[12px] prose-img:border-white
                        prose-strong:text-primary prose-strong:font-black
                        prose-blockquote:border-l-4 prose-blockquote:border-accent prose-blockquote:bg-accent/5 prose-blockquote:p-8 prose-blockquote:rounded-r-2xl prose-blockquote:italic">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {program.content}
                        </ReactMarkdown>
                    </div>
                </div>
                 <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-100 to-transparent"></div>
            </section>

            {/* Support CTA */}
            <section className="py-32 px-6 lg:px-20 bg-background/30 overflow-hidden relative">
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <h2 className="text-4xl md:text-6xl font-black text-primary mb-10 font-display tracking-tight leading-tight">
                        {locale === 'vi' ? 'Bạn Có Câu Hỏi Nào Không?' : 'Have Any Questions?'}
                    </h2>
                    <p className="text-xl text-gray-400 mb-14 font-medium max-w-2xl mx-auto leading-relaxed">
                        {locale === 'vi' ? 'Tôi luôn sẵn sàng giúp bạn chọn lựa lộ trình phù hợp nhất với mục tiêu nghề nghiệp của bạn.' : 'I am always ready to help you choose the best roadmap for your career goals.'}
                    </p>
                    <Link href="/contact" className="inline-block bg-primary text-white px-16 py-6 rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-accent hover:shadow-2xl transition-all shadow-xl active:scale-95">
                        {locale === 'vi' ? 'TRÒ CHUYỆN VỚI MENTOR' : 'CHAT WITH MENTOR'}
                    </Link>
                </div>
            </section>
        </main>
    );
}
