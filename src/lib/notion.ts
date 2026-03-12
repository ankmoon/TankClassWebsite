import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});

const n2m = new NotionToMarkdown({ notionClient: notion });

const DATABASE_ID = process.env.NOTION_DATABASE_ID;
const PROGRAMS_DATABASE_ID = process.env.NOTION_PROGRAMS_ID;

export async function getPublishedPosts(locale: string = "vi") {
    if (!DATABASE_ID) return [];

    const localeUpper = locale.toUpperCase(); // "VI" | "EN"

    const response = await notion.databases.query({
        database_id: DATABASE_ID,
        filter: {
            and: [
                {
                    property: "Status",
                    select: {
                        equals: "Published",
                    },
                },
                // Support Language = exact locale ("VI"/"EN") OR "both"
                {
                    or: [
                        {
                            property: "Language",
                            select: { equals: localeUpper },
                        },
                        {
                            property: "Language",
                            select: { equals: "both" },
                        },
                    ]
                }
            ]
        },
        sorts: [
            {
                property: "Date",
                direction: "descending",
            },
        ],
    });

    return response.results.map((page: any) => {
        try {
            const props = page.properties;
            const titleProp = props.Title || props.Name;
            const customCover = props.Cover?.files?.[0];
            const coverUrl = customCover?.external?.url || customCover?.file?.url ||
                page.cover?.external?.url || page.cover?.file?.url ||
                "/placeholder.jpg";

            return {
                id: page.id,
                title: titleProp?.title?.[0]?.plain_text || "Untitled",
                slug: props.Slug?.rich_text?.[0]?.plain_text || page.id,
                date: props.Date?.date?.start || new Date().toISOString(),
                category: props.Category?.select?.name || "Uncategorized",
                cover: coverUrl,
                summary: props.Summary?.rich_text?.[0]?.plain_text || "",
            };
        } catch (err) {
            console.error("Error parsing Notion page:", page.id, err);
            return null;
        }
    }).filter(Boolean);
}

export async function getPrograms(locale: string = "vi") {
    if (!PROGRAMS_DATABASE_ID) return [];

    const response = await notion.databases.query({
        database_id: PROGRAMS_DATABASE_ID,
        filter: {
            property: "Language",
            select: {
                equals: locale.toUpperCase(),
            },
        },
        sorts: [{ property: "Order", direction: "ascending" }],
    });

    return response.results.map((page: any) => {
        const props = page.properties;
        return {
            id: page.id,
            title: props.Name?.title?.[0]?.plain_text || "Untitled",
            slug: props.Slug?.rich_text?.[0]?.plain_text || page.id,
            category: props.Category?.select?.name || "General",
            description: props.Description?.rich_text?.[0]?.plain_text || "",
            price: props.Price?.rich_text?.[0]?.plain_text || "Contact",
            features: props.Features?.rich_text?.[0]?.plain_text?.split(",").map((f: string) => f.trim()) || [],
            color: props.Color?.select?.name || "blue",
            icon: props.Icon?.select?.name || "layout",
        };
    });
}

export async function getAboutPage(pageId: string) {
    const mdblocks = await n2m.pageToMarkdown(pageId);
    const mdString = n2m.toMarkdownString(mdblocks);
    const page = await notion.pages.retrieve({ page_id: pageId }) as any;

    return {
        title: page.properties.title?.title?.[0]?.plain_text || "About TankMentor",
        cover: page.cover?.external?.url || page.cover?.file?.url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2000",
        content: mdString.parent,
    };
}

export async function getPostBySlug(slug: string, locale: string = "vi") {
    if (!DATABASE_ID) return null;

    const localeUpper = locale.toUpperCase();

    const response = await notion.databases.query({
        database_id: DATABASE_ID,
        filter: {
            and: [
                {
                    property: "Slug",
                    rich_text: {
                        equals: slug,
                    },
                },
                // Support Language = exact locale ("VI"/"EN") OR "both"
                {
                    or: [
                        {
                            property: "Language",
                            select: { equals: localeUpper },
                        },
                        {
                            property: "Language",
                            select: { equals: "both" },
                        },
                    ]
                }
            ]
        },
    });

    if (response.results.length === 0) return null;

    const page = response.results[0] as any;
    const mdblocks = await n2m.pageToMarkdown(page.id);
    const mdString = n2m.toMarkdownString(mdblocks);

    const titleProp = page.properties.Title || page.properties.Name;

    return {
        title: titleProp?.title?.[0]?.plain_text || "Untitled",
        date: page.properties.Date?.date?.start || "",
        category: page.properties.Category?.select?.name || "Uncategorized",
        cover: page.cover?.external?.url || page.cover?.file?.url || "/placeholder.jpg",
        summary: page.properties.Summary?.rich_text?.[0]?.plain_text || "",
        content: mdString.parent,
    };
}

export async function getProgramBySlug(slug: string, locale: string = "vi") {
    if (!PROGRAMS_DATABASE_ID) return null;

    const response = await notion.databases.query({
        database_id: PROGRAMS_DATABASE_ID,
        filter: {
            and: [
                {
                    property: "Slug",
                    rich_text: {
                        equals: slug,
                    },
                },
                {
                    property: "Language",
                    select: {
                        equals: locale.toUpperCase(),
                    },
                }
            ]
        },
    });

    if (response.results.length === 0) return null;

    const page = response.results[0] as any;
    const mdblocks = await n2m.pageToMarkdown(page.id);
    const mdString = n2m.toMarkdownString(mdblocks);
    const props = page.properties;

    return {
        title: props.Name?.title?.[0]?.plain_text || "Untitled",
        category: props.Category?.select?.name || "General",
        description: props.Description?.rich_text?.[0]?.plain_text || "",
        price: props.Price?.rich_text?.[0]?.plain_text || "Contact",
        features: props.Features?.rich_text?.[0]?.plain_text?.split(",").map((f: string) => f.trim()) || [],
        color: props.Color?.select?.name || "blue",
        icon: props.Icon?.select?.name || "layout",
        content: mdString.parent,
        cover: page.cover?.external?.url || page.cover?.file?.url || null,
    };
}
