import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Building2, Home, Plus, Menu, X, Globe, List, Users,
  TrendingUp, Eye, EyeOff, Star, UserCheck, ShieldCheck,
} from "lucide-react";
import { SITE_NAME } from "@/config";
import { useGetPropertiesQuery, useGetFeaturedPropertiesQuery } from "@/store/api/propertiesApi";
import { useGetUsersQuery } from "@/store/api/usersApi";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const currentUser = (() => {
    try { return JSON.parse(localStorage.getItem("adminUser") ?? "{}"); } catch { return {}; }
  })();
  const isSuperAdmin = currentUser?.role === "super_admin";

  const navItems = [
    { label: "الرئيسية", href: "/admin", icon: Home },
    { label: "إدارة العقارات", href: "/admin/properties", icon: List },
    { label: "إضافة عقار جديد", href: "/admin/add-property", icon: Plus },
    ...(isSuperAdmin ? [{ label: "إدارة المستخدمين", href: "/admin/users", icon: Users }] : []),
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-secondary/30" dir="rtl">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-border px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-secondary transition-colors">
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <div className="flex items-center gap-2">
          <span className="font-black text-lg">لوحة التحكم</span>
          <Building2 className="w-6 h-6 text-gold" />
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:sticky top-0 right-0 h-screen bg-white border-l border-border
          w-72 transition-transform duration-300 z-50 flex flex-col overflow-y-auto
          ${sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
        `}>
          {/* Mobile sidebar header with close button */}
          <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-border">
            <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg hover:bg-secondary transition-colors">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="font-black text-base">القائمة</span>
              <Building2 className="w-5 h-5 text-gold" />
            </div>
          </div>

          <div className="p-6 border-b border-border hidden lg:block">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-black text-base text-foreground">{SITE_NAME}</h1>
                <p className="text-xs text-muted-foreground">لوحة التحكم</p>
              </div>
            </div>
            <Link to="/" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-muted-foreground text-sm font-medium">
              <Globe className="w-4 h-4" />
              العودة للموقع
            </Link>
          </div>

          <nav className="p-4 space-y-1 flex-1">
            <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-secondary transition-colors lg:hidden mb-3 border-b border-border pb-4" onClick={() => setSidebarOpen(false)}>
              <Globe className="w-5 h-5" />
              <span className="font-medium">العودة للموقع</span>
            </Link>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium
                    ${isActive(item.href)
                      ? "gradient-gold text-white shadow-md"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        <main className="flex-1 p-4 lg:p-8 min-w-0">{children}</main>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { data: propertiesData } = useGetPropertiesQuery({ neighborhood: "الكل", type: "الكل", priceRange: "all", sort: "newest", page: 1 });
  const { data: featured = [] } = useGetFeaturedPropertiesQuery();
  const { data: allUsers = [] } = useGetUsersQuery();

  const allProperties = propertiesData?.data ?? [];
  const propStats = {
    total: propertiesData?.total ?? 0,
    active: allProperties.filter((p) => p.active).length,
    inactive: allProperties.filter((p) => !p.active).length,
  };

  const currentUser = (() => {
    try { return JSON.parse(localStorage.getItem("adminUser") ?? "{}"); } catch { return {}; }
  })();
  const isSuperAdmin = currentUser?.role === "super_admin";

  const userStats = {
    total: allUsers.length,
    active: allUsers.filter((u) => u.active).length,
  };

  // Last 5 properties
  const recentProperties = [...allProperties].slice(-5).reverse();

  const statCards = [
    { label: "إجمالي العقارات", value: propStats.total, icon: Building2, color: "text-gold", bg: "bg-gold/10" },
    { label: "عقارات نشطة", value: propStats.active, icon: Eye, color: "text-green-600", bg: "bg-green-50" },
    { label: "عقارات مخفية", value: propStats.inactive, icon: EyeOff, color: "text-orange-500", bg: "bg-orange-50" },
    { label: "عقارات مميزة", value: featured.length, icon: Star, color: "text-yellow-500", bg: "bg-yellow-50" },
    ...(isSuperAdmin ? [
      { label: "إجمالي المستخدمين", value: userStats.total, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
      { label: "مستخدمون نشطون", value: userStats.active, icon: UserCheck, color: "text-purple-600", bg: "bg-purple-50" },
    ] : []),
  ];

  const quickActions = [
    { label: "إضافة عقار جديد", desc: "أضف عقاراً للمنصة", href: "/admin/add-property", icon: Plus, color: "gradient-gold" },
    { label: "إدارة العقارات", desc: "تعديل وحذف العقارات", href: "/admin/properties", icon: List, color: "bg-blue-500" },
    ...(isSuperAdmin ? [{ label: "إدارة المستخدمين", desc: "صلاحيات وحسابات الأدمن", href: "/admin/users", icon: ShieldCheck, color: "bg-purple-500" }] : []),
  ];

  return (
    <AdminLayout>
      <div className="max-w-6xl space-y-8">

        {/* Header */}
        <div>
          <h2 className="text-3xl font-black text-foreground">مرحباً بك في لوحة التحكم</h2>
          <p className="text-muted-foreground mt-1">نظرة عامة على المنصة</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {statCards.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-white rounded-2xl border border-border p-5 shadow-sm flex flex-col items-center text-center gap-2">
                <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div className={`text-3xl font-black ${s.color}`}>{s.value}</div>
                <div className="text-muted-foreground text-xs font-semibold leading-tight">{s.label}</div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
          <h3 className="text-lg font-black text-foreground mb-5 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-gold" />
            إجراءات سريعة
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((a) => {
              const Icon = a.icon;
              return (
                <Link
                  key={a.href}
                  to={a.href}
                  className="flex items-center gap-4 p-4 rounded-xl border-2 border-border hover:border-gold/40 hover:bg-gold/5 transition-all group"
                >
                  <div className={`w-12 h-12 rounded-xl ${a.color} flex items-center justify-center shrink-0`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-black text-foreground text-sm group-hover:text-gold transition-colors">{a.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{a.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Properties */}
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h3 className="font-black text-foreground flex items-center gap-2">
              <Building2 className="w-5 h-5 text-gold" />
              آخر العقارات المضافة
            </h3>
            <Link to="/admin/properties" className="text-sm text-gold font-bold hover:underline">
              عرض الكل
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentProperties.length === 0 ? (
              <p className="text-center text-muted-foreground py-8 text-sm">لا توجد عقارات بعد</p>
            ) : (
              recentProperties.map((p) => (
                <div key={p.id} className="flex items-center justify-between px-6 py-4 hover:bg-secondary/30 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    {p.images?.[0] && (
                      <img src={p.images[0]} alt={p.title} className="w-10 h-10 rounded-lg object-cover shrink-0 hidden sm:block" />
                    )}
                    <div className="min-w-0">
                      <p className="font-bold text-foreground text-sm truncate">{p.title}</p>
                      <p className="text-xs text-muted-foreground">{p.neighborhood} • {p.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                      p.active ? "bg-green-50 text-green-600 border-green-200" : "bg-secondary text-muted-foreground border-border"
                    }`}>
                      {p.active ? "نشط" : "مخفي"}
                    </span>
                    <Link to={`/admin/edit-property/${p.id}`} className="text-xs text-gold font-bold hover:underline">
                      تعديل
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Users - super_admin only */}
        {isSuperAdmin && (
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h3 className="font-black text-foreground flex items-center gap-2">
              <Users className="w-5 h-5 text-gold" />
              المستخدمون
            </h3>
            <Link to="/admin/users" className="text-sm text-gold font-bold hover:underline">
              إدارة المستخدمين
            </Link>
          </div>
          <div className="divide-y divide-border">
            {allUsers.map((u) => (
              <div key={u.id} className="flex items-center justify-between px-6 py-4 hover:bg-secondary/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full gradient-gold flex items-center justify-center text-white font-black text-sm shrink-0">
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm">{u.name}</p>
                    <p className="text-xs text-muted-foreground" dir="ltr">@{u.username}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                    u.role === "super_admin"
                      ? "bg-gold/10 text-gold border-gold/30"
                      : "bg-blue-50 text-blue-600 border-blue-200"
                  }`}>
                    {u.role === "super_admin" ? "مدير كامل" : "مدير عقارات"}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                    u.active ? "bg-green-50 text-green-600 border-green-200" : "bg-secondary text-muted-foreground border-border"
                  }`}>
                    {u.active ? "نشط" : "معطّل"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        )}

      </div>
    </AdminLayout>
  );
};

export default Dashboard;
export { AdminLayout };
