import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getPostBySlug } from "@/lib/notion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string, locale: string }> }) {
    const { slug, locale } = await params;
    const post = await getPostBySlug(slug, locale);
    if (!post) return {};

    return {
        title: `${post.title} | TankMentor Blog`,
        description: post.summary || `Đọc bài viết mới nhất về ${post.category} tại TankMentor.`,
        openGraph: {
            title: post.title,
            description: post.summary,
            images: [post.cover],
        }
    };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string, locale: string }> }) {
    const { slug, locale } = await params;
    const post = await getPostBySlug(slug, locale);

    if (!post) {
        return notFound();
    }
    
    const t = await getTranslations("Blog");

    return (
        <main className="min-h-screen bg-white font-body">
            {/* Article Header */}
            <section className="pt-32 pb-16 px-6 lg:px-20 bg-background/30 relative overflow-hidden">
                <div className="max-w-4xl mx-auto relative z-10">
                    <div className="flex items-center gap-6 mb-10">
                        <span className="px-4 py-1.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">
                            {post.category}
                        </span>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                            {new Date(post.date).toLocaleDateString(locale === "vi" ? "vi-VN" : "en-US", { month: "long", day: "numeric", year: "numeric" })}
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-primary mb-12 leading-tight font-display tracking-tight">
                        {post.title}
                    </h1>
                    <div className="w-full h-[450px] md:h-[600px] rounded-[3.5rem] overflow-hidden shadow-2xl border-[12px] border-white relative group">
                        <Image
                            src={post.cover}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-1000 grayscale hover:grayscale-0"
                        />
                         <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
            </section>

            {/* Article Content */}
            <section className="py-24 px-6 lg:px-20 bg-white">
                <div className="max-w-3xl mx-auto">
                    <article className="prose prose-xl prose-slate max-w-none 
                        prose-headings:font-display prose-headings:font-black prose-headings:text-primary prose-headings:tracking-tight
                        prose-p:text-gray-500 prose-p:leading-relaxed prose-p:font-medium
                        prose-img:rounded-[2.5rem] prose-img:shadow-2xl prose-img:border-white prose-img:border-[8px]
                        prose-a:text-accent prose-a:font-black prose-a:no-underline hover:prose-a:underline transition-colors
                        prose-strong:text-primary prose-strong:font-black
                        prose-li:text-gray-500 prose-li:font-medium
                        prose-blockquote:border-l-4 prose-blockquote:border-accent prose-blockquote:bg-accent/5 prose-blockquote:p-8 prose-blockquote:rounded-r-2xl prose-blockquote:rounded-l-sm prose-blockquote:italic">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {post.content}
                        </ReactMarkdown>
                    </article>

                    <div className="mt-24 pt-12 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-10">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-[1.5rem] bg-primary flex items-center justify-center text-white font-black text-xl shadow-xl shadow-primary/10">TM</div>
                            <div className="space-y-1">
                                <p className="text-xs font-black text-primary uppercase tracking-widest">TankMentor Executive</p>
                                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Strategic BA & PM Consultant</p>
                            </div>
                        </div>
                        <button className="text-[10px] font-black text-white bg-accent px-10 py-5 rounded-2xl hover:bg-primary hover:shadow-2xl transition-all shadow-xl active:scale-95 uppercase tracking-[0.2em]">
                            Work With Me
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
}
