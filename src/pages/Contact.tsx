import { useState } from "react";
import { Phone, MapPin, Clock, MessageCircle, Send, ArrowLeft } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { WHATSAPP_NUMBER, WHATSAPP_DISPLAY, SITE_ADDRESS, SITE_COUNTRY, WORKING_HOURS, WHATSAPP_URL, PHONE_NUMBERS } from "@/config";

const Contact = () => {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `مرحباً، أنا ${name || "أحد العملاء"}
الموضوع: ${subject || "استفسار عام"}
الرسالة: ${message || ""}`.trim();
    window.open(WHATSAPP_URL(text), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background" dir="rtl">
      <SiteHeader />

      {/* Hero */}
      <section className="bg-gradient-to-br from-navy-dark via-navy to-navy-light py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--gold)/0.2),transparent_60%)]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="container relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-semibold border border-gold/30 mb-6">
            <span className="w-2 h-2 bg-gold rounded-full animate-pulse" />
            متاحون للرد الآن
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
            تواصل <span className="text-gradient-gold">معنا</span>
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-xl mx-auto">
            نحن هنا لمساعدتك في إيجاد عقارك المثالي — لا تتردد في التواصل
          </p>
        </div>
      </section>

      <main className="flex-1 py-16 md:py-24">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-stretch">

            {/* Left: Info Cards */}
            <div className="lg:col-span-2 flex flex-col gap-5 h-full justify-center">

              {/* Info Cards */}
              {[
                {
                  icon: Phone,
                  title: "رقم الواتساب",
                  value: WHATSAPP_DISPLAY,
                  sub: WORKING_HOURS,
                  dir: "ltr" as const,
                },
                {
                  icon: MapPin,
                  title: "العنوان",
                  value: SITE_ADDRESS,
                  sub: SITE_COUNTRY,
                  dir: "rtl" as const,
                },
                {
                  icon: Clock,
                  title: "ساعات العمل",
                  value: "٢٤/٧ على مدار الأسبوع",
                  sub: "متاحون دائماً للرد عليك",
                  dir: "rtl" as const,
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-center gap-4 bg-white rounded-2xl p-5 border border-border shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group"
                >
                  <div className="w-14 h-14 rounded-2xl gradient-gold flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-0.5">{item.title}</p>
                    <p className="text-foreground font-black text-base truncate" dir={item.dir}>{item.value}</p>
                    <p className="text-muted-foreground text-sm">{item.sub}</p>
                  </div>
                </div>
              ))}

              {/* Extra phone numbers */}
              <div className="bg-white rounded-2xl p-5 border border-border shadow-sm">
                <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-3">أرقام التواصل</p>
                <div className="space-y-2">
                  {PHONE_NUMBERS.map((p) => (
                    <a key={p.number} href={`tel:+${p.number}`}
                      className="flex items-center gap-3 hover:text-gold transition-colors group">
                      <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors">
                        <Phone className="w-4 h-4 text-gold" />
                      </div>
                      <span className="font-bold text-foreground" dir="ltr">{p.display}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* WhatsApp Direct */}
              <a
                href={WHATSAPP_URL("مرحباً، أريد الاستفسار عن عقار")}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-black text-base rounded-2xl px-6 py-5 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
              >
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-7 h-7" />
                  <div className="text-right">
                    <p className="font-black text-base leading-tight">تواصل عبر واتساب</p>
                    <p className="text-white/80 text-xs font-medium">رد فوري خلال دقائق</p>
                  </div>
                </div>
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Right: Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-3xl border border-border shadow-xl p-8 md:p-10 h-full">
                {/* Form Header */}
                <div className="mb-8">
                  <h2 className="text-2xl md:text-3xl font-black text-foreground mb-2">أرسل رسالة</h2>
                  <p className="text-muted-foreground text-sm flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                    سيتم فتح واتساب برسالتك جاهزة للإرسال
                  </p>
                </div>

                <form className="space-y-5" onSubmit={handleSend}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm font-bold text-foreground mb-2 block">الاسم الكامل</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="أدخل اسمك"
                        className="w-full bg-secondary text-foreground rounded-xl px-5 h-[54px] border-2 border-border focus:ring-2 focus:ring-gold/30 focus:border-gold outline-none transition-all text-base"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-foreground mb-2 block">الموضوع</label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="موضوع رسالتك"
                        className="w-full bg-secondary text-foreground rounded-xl px-5 h-[54px] border-2 border-border focus:ring-2 focus:ring-gold/30 focus:border-gold outline-none transition-all text-base"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-foreground mb-2 block">الرسالة</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="اكتب رسالتك هنا..."
                      rows={6}
                      className="w-full bg-secondary text-foreground rounded-xl px-5 py-4 border-2 border-border focus:ring-2 focus:ring-gold/30 focus:border-gold outline-none resize-none transition-all text-base"
                    />
                  </div>

                  {/* Preview */}
                  {(name || subject || message) && (
                    <div className="bg-[#25D366]/5 border-2 border-[#25D366]/20 rounded-xl p-4 text-sm text-foreground/80 leading-relaxed animate-fade-in">
                      <p className="text-xs font-bold text-[#25D366] mb-2 uppercase tracking-wider">معاينة الرسالة</p>
                      <p className="whitespace-pre-line">
                        {`مرحباً، أنا ${name || "..."}
الموضوع: ${subject || "..."}
الرسالة: ${message || "..."}`}
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-black text-lg rounded-2xl h-[60px] flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-0.5"
                  >
                    <Send className="w-5 h-5" />
                    إرسال عبر واتساب
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default Contact;
