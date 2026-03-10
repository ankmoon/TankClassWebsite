import { getTranslations } from "next-intl/server";
import { ReactNode } from "react";

export async function generateMetadata() {
    const t = await getTranslations("SEO.contact");
    return {
        title: t("title"),
        description: t("description"),
    };
}

export default function ContactLayout({ children }: { children: ReactNode }) {
    return children;
}
