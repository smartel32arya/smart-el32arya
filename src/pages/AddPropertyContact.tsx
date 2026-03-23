import { useNavigate } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Phone, MessageCircle, Lock } from "lucide-react";
import { WHATSAPP_DISPLAY, WORKING_DAYS, WHATSAPP_URL, SITE_NAME } from "@/config";

const AddPropertyContact = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background" dir="rtl">
      <SiteHeader />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="max-w-lg w-full">
          <div className="bg-white rounded-3xl shadow-xl border border-border p-8 md:p-10 text-center">
            {/* Icon */}
            <div className="w-20 h-20 mx-auto rounded-2xl gradient-gold flex items-center justify-center mb-6 shadow-xl">
              <MessageCircle className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-foreground mb-3">
              هل تريد إضافة عقارك؟
            </h1>
            <p className="text-muted-foreground mb-8 leading-relaxed text-sm md:text-base">
              للإعلان عن عقارك على منصتنا، تواصل معنا مباشرة عبر واتساب وسيقوم فريقنا بمساعدتك في نشر عقارك
            </p>

            {/* Contact info */}
            <div className="bg-secondary rounded-2xl p-5 mb-6 flex items-center justify-center gap-3">
              <Phone className="w-5 h-5 text-gold shrink-0" />
              <span className="text-xl font-black text-foreground" dir="ltr">{WHATSAPP_DISPLAY}</span>
            </div>
            <p className="text-xs text-muted-foreground mb-8">{WORKING_DAYS}</p>

            {/* WhatsApp CTA */}
            <a
              href={WHATSAPP_URL(`مرحباً، أريد إضافة عقار على منصة ${SITE_NAME}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-black text-base h-[56px] rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 mb-4"
            >
              <MessageCircle className="w-6 h-6" />
              تواصل معنا عبر واتساب
            </a>

            {/* Admin login */}
            <div className="pt-6 border-t border-border">
              <button
                onClick={() => navigate("/admin/login")}
                className="flex items-center justify-center gap-2 w-full bg-secondary hover:bg-secondary/80 text-foreground font-bold h-[48px] rounded-xl border-2 border-border hover:border-gold/40 transition-all text-sm"
              >
                <Lock className="w-4 h-4" />
                تسجيل دخول الإدارة
              </button>
            </div>

            <p className="mt-6 text-xs text-muted-foreground">
              💡 نراجع جميع العقارات قبل نشرها لضمان جودة المحتوى
            </p>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default AddPropertyContact;
