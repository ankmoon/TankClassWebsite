import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["vi", "en"],

  // Used when no locale matches
  defaultLocale: "vi",
  
  // This helps Next.js link to the correct localized path
  pathnames: {
    "/": "/",
    "/programs": "/programs",
    "/programs/[slug]": "/programs/[slug]",
    "/blog": "/blog",
    "/blog/[slug]": "/blog/[slug]",
    "/about": "/about",
    "/contact": "/contact",
    "/resources": "/resources",
    "/privacy-policy": "/privacy-policy",
    "/terms-of-service": "/terms-of-service",
  }
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
