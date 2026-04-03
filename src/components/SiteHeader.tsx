import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE_NAME } from "@/config";
import logo from "@/assets/logo.png";

const navLinks = [
  { label: "الرئيسية", href: "/", isRoute: true },
  { label: "العقارات", href: "/properties", isRoute: true },
];

const SiteHeader = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-border/50 shadow-sm">
      <div className="container flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center group">
          <div className="p-1.5 rounded-xl border-2 border-gold/40 shadow-md group-hover:border-gold transition-colors bg-white">
            <img
              src={logo}
              alt="logo"
              className="h-10 md:h-12 w-auto object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
                (e.currentTarget.nextElementSibling as HTMLElement)!.style.display = "flex";
              }}
            />
            <Building2
              className="h-10 md:h-12 w-10 text-gold hidden items-center justify-center"
              aria-hidden="true"
            />
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) =>
            link.isRoute ? (
              <Link
                key={link.label}
                to={link.href}
                className={`font-semibold text-sm px-4 py-2 rounded-lg transition-all ${
                  isActive(link.href)
                    ? "bg-gold text-white shadow-md"
                    : "text-muted-foreground hover:text-gold hover:bg-secondary/50"
                }`}
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className="text-muted-foreground hover:text-gold hover:bg-secondary/50 transition-all font-semibold text-sm px-4 py-2 rounded-lg"
              >
                {link.label}
              </a>
            )
          )}
        </nav>

        {/* CTA + Mobile Toggle */}
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button className="hidden md:inline-flex gradient-gold text-gold-foreground hover:opacity-90 font-bold border-0 shadow-lg hover:shadow-xl transition-all px-6">
              تسجيل دخول
            </Button>
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-secondary/80 transition-colors"
            aria-label="القائمة"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card animate-fade-in">
          <nav className="container py-4 flex flex-col gap-3">
            {navLinks.map((link) =>
              link.isRoute ? (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`py-3 px-4 rounded-lg font-medium text-base transition-colors ${
                    isActive(link.href)
                      ? "bg-gold text-white font-bold"
                      : "text-foreground hover:text-gold hover:bg-secondary"
                  }`}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-foreground hover:text-gold py-3 px-4 rounded-lg hover:bg-secondary transition-colors font-medium text-base"
                >
                  {link.label}
                </a>
              )
            )}
            <Link to="/login" onClick={() => setMobileOpen(false)}>
              <Button className="gradient-gold text-gold-foreground hover:opacity-90 font-bold border-0 mt-2 w-full">
                تسجيل دخول
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default SiteHeader;
