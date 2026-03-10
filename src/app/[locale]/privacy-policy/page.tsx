import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
    title: "Privacy Policy | TankMentor",
    description: "TankMentor Privacy Policy and data protection measures.",
};

export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen bg-white font-body">
            <Navbar />
            
            <section className="pt-32 pb-20 px-6 lg:px-20 bg-background/50">
                <div className="max-w-4xl mx-auto">
                    <span className="text-accent font-bold text-xs uppercase tracking-widest mb-4 block font-display">QUY ĐỊNH PHÁP LÝ</span>
                    <h1 className="text-4xl md:text-6xl font-black text-primary mb-12 font-display">Chính Sách Bảo Mật</h1>
                    
                    <div className="prose prose-lg max-w-none text-gray-600 font-medium space-y-8">
                        <section>
                            <h2 className="text-2xl font-black text-primary mb-4 font-display uppercase tracking-tight">1. Thu Thập Thông Tin</h2>
                            <p>Chúng tôi chỉ thu thập những thông tin cần thiết như Họ tên, Email, Số điện thoại và lĩnh vực bạn quan tâm khi bạn đăng ký tư vấn hoặc bản tin (newsletter).</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-black text-primary mb-4 font-display uppercase tracking-tight">2. Sử Dụng Thông Tin</h2>
                            <p>Thông tin của bạn được sử dụng để:
                                <ul className="list-disc pl-6 mt-4 space-y-2">
                                    <li>Liên hệ tư vấn các khóa học và lộ trình Mentoring.</li>
                                    <li>Gửi các bài blog, tài liệu chuyên môn hàng tuần.</li>
                                    <li>Cá nhân hóa trải nghiệm học tập của bạn.</li>
                                </ul>
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-black text-primary mb-4 font-display uppercase tracking-tight">3. Cam Kết Bảo Mật</h2>
                            <p>TankMentor tuyệt đối không bán, trao đổi hoặc tiết lộ thông tin cá nhân của bạn cho bên thứ ba vì bất kỳ mục đích thương mại nào.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-black text-primary mb-4 font-display uppercase tracking-tight">4. Cập Nhật Chính Sách</h2>
                            <p>Chính sách này có thể được cập nhật thường xuyên để đảm bảo phù hợp với quy định của pháp luật và nhu cầu của người dùng. Mọi thay đổi sẽ được công bố chính thức tại website này.</p>
                        </section>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
