import SiteHeader from "@/components/SiteHeader";
import HeroSection from "@/components/HeroSection";
import FeaturedProperties from "@/components/FeaturedProperties";
import SiteFooter from "@/components/SiteFooter";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <HeroSection />
      <FeaturedProperties />

      {/* Why Us Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-secondary via-background to-secondary relative overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />

        <div className="container relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-foreground mb-5">
              لماذا <span className="text-gradient-gold">سمارت العقارية؟</span>
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-base md:text-lg leading-relaxed">
              نحن أكبر منصة عقارية متخصصة في المنيا الجديدة. نقدم لك تجربة بحث سهلة وموثوقة مع مجموعة واسعة من العقارات المتنوعة بأسعار تنافسية.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto mb-16">
            {[
              { num: "+٥٠", label: "عقار متاح", icon: "🏢" },
              { num: "+١٠٠٠", label: "عميل سعيد", icon: "😊" },
              { num: "+١٠", label: "سنوات خبرة", icon: "⭐" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-2xl p-8 border border-border shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center group"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{stat.icon}</div>
                <div className="text-gold font-black text-4xl mb-2">{stat.num}</div>
                <div className="text-muted-foreground font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { title: "بحث متقدم", desc: "نظام بحث ذكي يساعدك في إيجاد العقار المناسب بسرعة", icon: "🔍" },
              { title: "عقارات موثوقة", desc: "جميع العقارات معتمدة ومفحوصة من قبل فريقنا", icon: "✅" },
              { title: "أسعار تنافسية", desc: "أفضل الأسعار في السوق مع إمكانية التفاوض", icon: "💰" },
              { title: "دعم مستمر", desc: "فريق دعم متاح على مدار الساعة لمساعدتك", icon: "🤝" },
              { title: "معاينة افتراضية", desc: "صور عالية الجودة ومعلومات تفصيلية لكل عقار", icon: "📸" },
              { title: "إجراءات سريعة", desc: "نسهل عليك إجراءات الشراء والتسجيل", icon: "⚡" },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-xl p-6 border border-border hover:border-gold/40 transition-all duration-300 group hover:shadow-lg"
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{feature.icon}</div>
                <h3 className="font-bold text-lg text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
};

export default Index;
