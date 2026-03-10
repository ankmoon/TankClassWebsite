"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { useParams } from "next/navigation";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const toggleLanguage = () => {
    const nextLocale = locale === "vi" ? "en" : "vi";
    // @ts-expect-error - App-wide language switcher deals with dynamic routes
    router.replace({ pathname, params }, { locale: nextLocale });
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
