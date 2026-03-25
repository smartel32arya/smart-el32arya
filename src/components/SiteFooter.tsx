import { Building2, Phone, MapPin } from "lucide-react";
import { SITE_NAME, SITE_ADDRESS, WHATSAPP_DISPLAY, PHONE_NUMBERS } from "@/config";
import logo from "@/assets/logo.png";

const SiteFooter = () => {
  return (
    <footer id="contact" className="gradient-navy text-primary-foreground relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold/5 rounded-full blur-3xl"></div>
      
      <div className="container py-16 md:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="p-1.5 rounded-xl border-2 border-gold/40 bg-white/10 shadow-md inline-block">
                <img src={logo} alt="logo" className="h-14 w-auto object-contain" />
              </div>
            </div>
            <p className="text-primary-foreground/80 text-base leading-relaxed">
              أكبر منصة عقارية متخصصة في المنيا الجديدة. نساعدك في إيجاد عقارك المثالي بأفضل الأسعار.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-xl mb-5">روابط سريعة</h3>
            <ul className="space-y-3 text-base text-primary-foreground/80">
              <li><a href="/" className="hover:text-gold transition-colors hover:translate-x-1 inline-block">الرئيسية</a></li>
              <li><a href="/properties" className="hover:text-gold transition-colors hover:translate-x-1 inline-block">العقارات</a></li>
              <li><a href="/contact" className="hover:text-gold transition-colors hover:translate-x-1 inline-block">اتصل بنا</a></li>
              <li><a href="/add-property" className="hover:text-gold transition-colors hover:translate-x-1 inline-block">أضف عقارك</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-xl mb-5">تواصل معنا</h3>
            <ul className="space-y-4 text-base text-primary-foreground/80">
              <li className="flex items-center gap-3 hover:text-gold transition-colors">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-gold" />
                </div>
                <span dir="ltr">{WHATSAPP_DISPLAY}</span>
              </li>
              {PHONE_NUMBERS.map((p) => (
                <li key={p.number}>
                  <a href={`tel:+${p.number}`} className="flex items-center gap-3 hover:text-gold transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-gold" />
                    </div>
                    <span dir="ltr">{p.display}</span>
                  </a>
                </li>
              ))}
              <li className="flex items-center gap-3 hover:text-gold transition-colors">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-gold" />
                </div>
                <span>{SITE_ADDRESS}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/60 text-center sm:text-right">
          <span>© {new Date().getFullYear()} {SITE_NAME}. جميع الحقوق محفوظة.</span>
          <a
            href="https://wa.me/201153037090?text=مرحباً يوسف، أريد التواصل معك"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 gradient-gold text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-lg hover:opacity-90 hover:shadow-xl transition-all hover:-translate-y-0.5"
          >
            <span>تواصل مع المطور</span>
            <span className="opacity-80 text-xs">YussefRostom</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
