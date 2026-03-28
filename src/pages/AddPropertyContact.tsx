import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Building2, Lock, User, Eye, EyeOff, MessageCircle } from "lucide-react";
import { SITE_NAME, WHATSAPP_URL } from "@/config";
import { useAppDispatch } from "@/store/hooks";
import { propertiesApi } from "@/store/api/propertiesApi";
import { usersApi } from "@/store/api/usersApi";

const inputClass =
  "w-full bg-secondary text-foreground rounded-xl px-5 h-[54px] border-2 border-border focus:ring-2 focus:ring-gold/30 focus:border-gold outline-none transition-all text-base";

const AddPropertyContact = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "اسم المستخدم أو كلمة المرور غير صحيحة");
        setLoading(false);
        return;
      }
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminUser", JSON.stringify(data.user));
      dispatch(propertiesApi.util.resetApiState());
      dispatch(usersApi.util.resetApiState());
      navigate("/admin/add-property");
    } catch {
      setError("تعذّر الاتصال بالخادم، حاول مجدداً");
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background" dir="rtl">
      <SiteHeader />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full space-y-4">

          {/* Login card */}
          <div className="bg-white rounded-3xl shadow-xl border border-border p-8 md:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto rounded-2xl gradient-gold flex items-center justify-center mb-4 shadow-lg">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-black text-foreground mb-1">أضف عقارك</h1>
              <p className="text-muted-foreground text-sm">سجّل دخولك للبدء في إضافة عقارك</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-destructive/10 text-destructive text-sm font-semibold px-4 py-3 rounded-xl text-center">
                  {error}
                </div>
              )}

              <div>
                <label className="text-sm font-bold text-foreground mb-2 block">اسم المستخدم</label>
                <div className="relative">
                  <User className="absolute end-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="أدخل اسم المستخدم"
                    className={`${inputClass} pe-11`}
                    required
                    autoComplete="username"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-foreground mb-2 block">كلمة المرور</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute end-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="أدخل كلمة المرور"
                    className={`${inputClass} pe-11`}
                    required
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full gradient-gold text-white font-black text-base h-[54px] rounded-2xl shadow-lg hover:opacity-90 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    تسجيل الدخول
                  </>
                )}
              </button>
            </form>
          </div>

          {/* No account card */}
          <div className="bg-white rounded-2xl border border-border p-6 text-center shadow-sm">
            <p className="text-sm font-bold text-foreground mb-1">مش عندك حساب؟</p>
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
              تواصل مع إدارة الموقع وهنضيف عقارك نيابةً عنك
            </p>
            <a
              href={WHATSAPP_URL(`مرحباً، أريد إضافة عقار على منصة ${SITE_NAME}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold h-[46px] rounded-xl shadow transition-all text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              تواصل مع الإدارة عبر واتساب
            </a>
          </div>

        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default AddPropertyContact;
