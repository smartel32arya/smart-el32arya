import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowRight, Search } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background" dir="rtl">
      <SiteHeader />

      <main className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="text-center max-w-lg mx-auto">

          {/* 404 Visual */}
          <div className="relative mb-8 select-none">
            <p className="text-[10rem] md:text-[14rem] font-black leading-none text-transparent bg-clip-text bg-gradient-to-br from-gold/30 to-gold/10">
              404
            </p>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full gradient-gold flex items-center justify-center shadow-2xl">
                <Search className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>

          {/* Text */}
          <h1 className="text-2xl md:text-3xl font-black text-foreground mb-3">
            الصفحة غير موجودة
          </h1>
          <p className="text-muted-foreground text-base md:text-lg mb-10 leading-relaxed">
            يبدو أن الصفحة التي تبحث عنها لم تعد موجودة أو تم نقلها
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 gradient-gold text-white font-bold px-8 py-4 rounded-2xl shadow-lg hover:opacity-90 hover:shadow-xl transition-all hover:-translate-y-0.5 w-full sm:w-auto justify-center"
            >
              <Home className="w-5 h-5" />
              الرئيسية
            </Link>
            <Link
              to="/properties"
              className="flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-foreground font-bold px-8 py-4 rounded-2xl border-2 border-border hover:border-gold/40 transition-all w-full sm:w-auto justify-center"
            >
              <ArrowRight className="w-5 h-5" />
              تصفح العقارات
            </Link>
          </div>

        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default NotFound;
