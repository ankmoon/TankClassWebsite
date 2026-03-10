"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const nextLocale = locale === "vi" ? "en" : "vi";
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-100 hover:border-primary/20 hover:bg-gray-50 transition-all font-black text-[10px] uppercase tracking-widest text-primary shadow-sm"
    >
      <span className="material-symbols-outlined text-sm">language</span>
      {locale === "vi" ? "EN" : "VI"}
    </button>
  );
}
