import { Link } from "@/i18n/routing";

export default function RootNotFound() {
    return (
        <html lang="vi">
            <body>
                <main className="min-h-screen flex items-center justify-center p-12 text-center font-sans">
                    <div>
                        <h1 className="text-4xl font-black mb-10 text-slate-900">404 - NOT FOUND</h1>
                        <Link href="/" className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold">
                            VỀ TRANG CHỦ / BACK TO HOME
                        </Link>
                    </div>
                </main>
            </body>
        </html>
    );
}
