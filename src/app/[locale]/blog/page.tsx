import Image from "next/image";
import { Link } from "@/i18n/routing";
import { getPublishedPosts } from "@/lib/notion";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
    const t = await getTranslations("SEO.blog");
    return {
        title: t("title"),
        description: t("description"),
    };
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const posts = await getPublishedPosts(locale);
    const t = await getTranslations("Blog");

    const featuredPost = posts[0];
    const recentPosts = posts.slice(1);

    if (!posts || posts.length === 0) {
        return (
            <main className="min-h-screen font-body">
                <section className="bg-background pt-32 pb-32 px-6 lg:px-20 text-center">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-3xl font-black text-primary mb-6 font-display">{t("empty")}</h1>
                        <Link href="/" className="bg-primary text-white px-8 py-4 rounded-lg font-bold">{t("backHome")}</Link>
                    </div>
                </section>
            </main>
        );
    }

    return (
        <main className="min-h-screen font-body bg-white">
            {/* Hero Section */}
            <section className="bg-background pt-24 pb-16 px-6 lg:px-20 text-center relative overflow-hidden">
                <div className="max-w-4xl mx-auto relative z-10">
                    <span className="text-accent font-black text-[10px] uppercase tracking-[0.2em] mb-4 block font-display">{t("badge")}</span>
                    <h1 className="text-4xl md:text-6xl font-black text-primary mb-6 font-display tracking-tight">{t("title")}</h1>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
                        {t("description")}
                    </p>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            </section>

            {/* Featured Post */}
            {featuredPost && (
                <section className="py-12 px-6 lg:px-20 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <Link href={{ pathname: '/blog/[slug]', params: { slug: featuredPost.slug } }} className="group relative bg-background rounded-[3rem] overflow-hidden flex flex-col lg:flex-row items-center cursor-pointer hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 border border-gray-50">
                            <div className="w-full lg:w-3/5 h-[450px] relative overflow-hidden">
                                <Image
                                    src={featuredPost.cover}
                                    alt={featuredPost.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                            <div className="w-full lg:w-2/5 p-10 lg:p-16">
                                <div className="flex items-center gap-6 mb-8">
                                    <span className="px-4 py-1.5 bg-primary/5 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest">{featuredPost.category}</span>
                                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{new Date(featuredPost.date).toLocaleDateString(locale === "vi" ? "vi-VN" : "en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                                </div>
                                <h2 className="text-3xl md:text-4xl font-black text-primary mb-8 leading-tight font-display group-hover:text-accent transition-colors tracking-tight">
                                    {featuredPost.title}
                                </h2>
                                <p className="text-gray-500 font-medium mb-10 leading-relaxed line-clamp-3">
                                    {featuredPost.summary}
                                </p>
                                <div className="text-primary font-black flex items-center gap-2 group-hover:gap-4 transition-all text-[10px] uppercase tracking-[0.2em]">
                                    {t("readArticle")} <span className="material-symbols-outlined text-sm font-black transition-transform group-hover:translate-x-1">trending_flat</span>
                                </div>
                            </div>
                        </Link>
                    </div>
                </section>
            )}

            {/* Recent Articles */}
            <section className="py-24 px-6 lg:px-20 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-20 gap-8">
                        <h2 className="text-3xl md:text-4xl font-black text-primary font-display tracking-tight">{t("recent")}</h2>
                        <div className="flex gap-4">
                            <button className="px-6 py-2.5 rounded-full border-2 border-primary/5 bg-white text-[10px] font-black text-gray-400 hover:text-primary hover:border-primary/10 transition-all uppercase tracking-widest">{t("categories")}</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {recentPosts.map((post: any) => (
                            <Link key={post.id} href={{ pathname: '/blog/[slug]', params: { slug: post.slug } }} className="group cursor-pointer">
                                <div className="relative h-72 rounded-[2.5rem] overflow-hidden mb-8 shadow-sm group-hover:shadow-2xl transition-all duration-500">
                                    <Image
                                        src={post.cover}
                                        alt={post.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute top-6 left-6 z-10">
                                        <span className="px-3 py-1 bg-white/90 backdrop-blur rounded-lg text-[10px] font-black text-primary uppercase tracking-widest shadow-sm">{post.category}</span>
                                    </div>
                                </div>
                                <h3 className="text-2xl font-black text-primary mb-5 leading-tight font-display group-hover:text-accent transition-colors tracking-tight">
                                    {post.title}
                                </h3>
                                <p className="text-gray-500 text-sm font-medium mb-8 line-clamp-3 leading-relaxed">
                                    {post.summary}
                                </p>
                                <div className="flex items-center justify-between font-black text-[10px] tracking-widest text-gray-300 uppercase leading-none">
                                    <span>{new Date(post.date).toLocaleDateString(locale === "vi" ? "vi-VN" : "en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                                    <div className="group-hover:text-primary flex items-center gap-2 transition-colors">
                                        {t("readMore")} <span className="material-symbols-outlined text-sm font-black transition-transform group-hover:translate-x-1">trending_flat</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="py-24 px-6 lg:px-20 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="relative bg-primary rounded-[4rem] p-12 md:p-24 overflow-hidden text-white flex flex-col lg:flex-row items-center gap-16 shadow-2xl">
                        <div className="flex-1 relative z-10 text-center lg:text-left">
                            <h2 className="text-3xl md:text-5xl font-black mb-8 font-display tracking-tight leading-tight">{t("newsletterTitle")}</h2>
                            <p className="text-xl text-primary-100/70 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">{t("newsletterDesc")}</p>
                        </div>
                        <div className="flex-1 w-full relative z-10">
                            <form className="flex flex-col sm:flex-row gap-4 bg-white/5 p-4 rounded-[2.5rem] border border-white/10 backdrop-blur-sm shadow-inner">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-1 bg-transparent border-transparent px-6 py-4 focus:ring-0 text-white placeholder-white/30 font-black text-sm uppercase tracking-widest outline-none"
                                />
                                <button className="bg-white text-primary px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-accent hover:text-white hover:shadow-2xl transition-all">{t("subscribe")}</button>
                            </form>
                        </div>
                        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
                    </div>
                </div>
            </section>
        </main>
    );
}
