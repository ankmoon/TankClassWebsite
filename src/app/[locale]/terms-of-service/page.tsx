import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
    title: "Terms of Service | TankMentor",
    description: "Terms and Conditions for using TankMentor services.",
};

export default function TermsOfServicePage() {
    return (
        <main className="min-h-screen bg-white font-body">
            <Navbar />
            
            <section className="pt-32 pb-20 px-6 lg:px-20 bg-background/50">
                <div className="max-w-4xl mx-auto">
                    <span className="text-accent font-bold text-xs uppercase tracking-widest mb-4 block font-display">ĐIỀU KHOẢN SỬ DỤNG</span>
                    <h1 className="text-4xl md:text-6xl font-black text-primary mb-12 font-display">Điều Khoản & Dịch Vụ</h1>
                    
                    <div className="prose prose-lg max-w-none text-gray-600 font-medium space-y-8">
                        <section>
                            <h2 className="text-2xl font-black text-primary mb-4 font-display uppercase tracking-tight">1. Phạm Vi Dịch Vụ</h2>
                            <p>TankMentor cung cấp các chương trình đào tạo, tài liệu và lộ trình Mentoring trực tiếp cho các cá nhân và doanh nghiệp trong lĩnh vực Business Analysis và Product Management.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-black text-primary mb-4 font-display uppercase tracking-tight">2. Bản Quyền Nội Dung</h2>
                            <p>Tất cả tài liệu từ blog, video, template được cung cấp tại website này thuộc bản quyền của TankMentor. Bạn không được phép sao chép hoặc phân phối lại cho mục đích thương mại khi chưa có sự đồng ý bằng văn bản.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-black text-primary mb-4 font-display uppercase tracking-tight">3. Trách Nhiệm Của Người Dùng</h2>
                            <p>Người dùng cam kết cung cấp thông tin chính xác khi đăng ký và tôn trọng các quy tắc cộng đồng trong các buổi Workshop hoặc Mentoring.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-black text-primary mb-4 font-display uppercase tracking-tight">4. Chính Sách Hoàn Phí</h2>
                            <p>Vui lòng liên hệ trực tiếp qua trang Contact để biết chi tiết về chính sách hoàn phí cho các khóa học theo từng thời điểm cụ thể.</p>
                        </section>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
