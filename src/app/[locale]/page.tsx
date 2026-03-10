import Hero from "@/components/Hero";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
    const t = await getTranslations("SEO.home");
    return {
        title: t("title"),
        description: t("description"),
    };
}

export default function Home() {
  const t = useTranslations("Curriculum");
  const ctaT = useTranslations("CTA");

  return (
    <main className="min-h-screen font-body p-0 m-0">
      <Hero />

      {/* Curriculum Section */}
      <section className="py-32 px-6 lg:px-20 bg-white font-body">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-5xl font-black text-primary mb-6 font-display leading-tight">{t("title")}</h2>
              <p className="text-lg text-gray-500 font-medium leading-relaxed">{t("description")}</p>
            </div>
            <Link className="text-accent font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:gap-5 transition-all group" href="/programs">
              {t("explore")} <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">trending_flat</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Business Analysis */}
            <Link href="/programs" className="group p-12 bg-background rounded-[3rem] border border-transparent hover:border-primary/5 transition-all cursor-pointer hover:shadow-2xl hover:-translate-y-2">
              <div className="size-20 bg-white rounded-3xl flex items-center justify-center mb-10 shadow-sm group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                <span className="material-symbols-outlined text-4xl text-primary font-black">analytics</span>
              </div>
              <h4 className="text-3xl font-black text-primary mb-6 font-display tracking-tight">{t("baTitle")}</h4>
              <p className="text-gray-500 mb-10 leading-relaxed font-medium text-base">
                {t("baDesc")}
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-1.5 bg-white text-[10px] font-black text-gray-400 rounded-xl border border-gray-100 uppercase tracking-widest">SDLC</span>
                <span className="px-4 py-1.5 bg-white text-[10px] font-black text-gray-400 rounded-xl border border-gray-100 uppercase tracking-widest">Agile</span>
                <span className="px-4 py-1.5 bg-white text-[10px] font-black text-gray-400 rounded-xl border border-gray-100 uppercase tracking-widest">UML</span>
              </div>
            </Link>

            {/* Product Management */}
            <Link href="/programs" className="group p-12 bg-background rounded-[3rem] border border-transparent hover:border-primary/5 transition-all cursor-pointer hover:shadow-2xl hover:-translate-y-2">
              <div className="size-20 bg-white rounded-3xl flex items-center justify-center mb-10 shadow-sm group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                <span className="material-symbols-outlined text-4xl text-secondary font-black">inventory_2</span>
              </div>
              <h4 className="text-3xl font-black text-primary mb-6 font-display tracking-tight">{t("pmTitle")}</h4>
              <p className="text-gray-500 mb-10 leading-relaxed font-medium text-base">
                {t("pmDesc")}
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-1.5 bg-white text-[10px] font-black text-gray-400 rounded-xl border border-gray-100 uppercase tracking-widest">Strategy</span>
                <span className="px-4 py-1.5 bg-white text-[10px] font-black text-gray-400 rounded-xl border border-gray-100 uppercase tracking-widest">Growth</span>
                <span className="px-4 py-1.5 bg-white text-[10px] font-black text-gray-400 rounded-xl border border-gray-100 uppercase tracking-widest">MVP</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 lg:px-20 bg-primary font-body relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10 text-center text-white">
          <h2 className="text-5xl md:text-6xl font-black mb-8 font-display tracking-tight leading-tight">{ctaT("title")}</h2>
          <p className="text-xl text-primary-100/90 mb-12 max-w-2xl mx-auto font-medium opacity-80 leading-relaxed">
            {ctaT("description")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-accent text-white px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-accent/90 hover:shadow-2xl transition-all transform hover:scale-105 active:scale-95 shadow-xl"
            >
              {ctaT("button")}
            </Link>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
      </section>
    </main>
  );
}
