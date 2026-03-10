import { NextResponse } from "next/server";
import { Client } from "@notionhq/client";

const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});

const DATABASE_ID = process.env.NOTION_CONTACTS_ID;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, service, message } = body;

        if (!DATABASE_ID) {
            return NextResponse.json({ error: "Contact Database ID not configured" }, { status: 500 });
        }

        await notion.pages.create({
            parent: { database_id: DATABASE_ID },
            properties: {
                Name: {
                    title: [
                        {
                            text: {
                                content: name,
                            },
                        },
                    ],
                },
                Email: {
                    email: email,
                },
                Service: {
                    select: {
                        name: service || "General Inquiry",
                    },
                },
                Message: {
                    rich_text: [
                        {
                            text: {
                                content: message,
                            },
                        },
                    ],
                },
                Status: {
                    select: {
                        name: "New",
                    },
                },
            },
        });

        return NextResponse.json({ success: true, message: "Contact saved to Notion!" });
    } catch (error: any) {
        console.error("Notion Contact Error:", error);
        return NextResponse.json({ error: "Failed to send message", detail: error.message }, { status: 500 });
    }
}
