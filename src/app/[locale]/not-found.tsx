import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-6 lg:px-20 font-body">
      <div className="max-w-3xl w-full text-center relative">
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10">
          <span className="text-[15rem] md:text-[25rem] font-black text-primary/5 select-none font-display">404</span>
        </div>
        
        <div className="relative z-10 space-y-12">
            <div className="size-24 bg-accent/10 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner text-accent animate-bounce">
                <span className="material-symbols-outlined text-5xl font-black">inventory_2</span>
            </div>
            
            <div className="space-y-6">
                <h1 className="text-4xl md:text-6xl font-black text-primary font-display tracking-tight leading-tight">
                    {t("title")}
                </h1>
                <p className="text-xl text-gray-500 max-w-xl mx-auto font-medium leading-relaxed">
                    {t("description")}
                </p>
            </div>

            <div className="pt-6">
                <Link 
                    href="/" 
                    className="inline-flex items-center gap-4 bg-primary text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-accent hover:shadow-2xl transition-all shadow-xl active:scale-95 group"
                >
                    <span className="material-symbols-outlined text-sm font-black group-hover:-translate-x-1 transition-transform">arrow_forward</span>
                    {t("backHome")}
                </Link>
            </div>
        </div>

        {/* Ambient blurs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
      </div>
    </main>
  );
}
