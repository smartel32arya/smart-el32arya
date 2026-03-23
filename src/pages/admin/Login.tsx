import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Lock, User, Eye, EyeOff } from "lucide-react";
import { SITE_NAME } from "@/config";

const inputClass =
  "w-full bg-secondary text-foreground rounded-xl px-5 h-[54px] border-2 border-border focus:ring-2 focus:ring-gold/30 focus:border-gold outline-none transition-all text-base";

const Login = () => {
  const navigate = useNavigate();
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
      navigate("/admin");
    } catch {
      setError("تعذّر الاتصال بالخادم، حاول مجدداً");
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError("");
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-navy-dark via-navy to-navy-light flex items-center justify-center p-4"
      dir="rtl"
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-gold mb-4 shadow-2xl">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white mb-1">{SITE_NAME}</h1>
          <p className="text-white/60 text-sm">لوحة تحكم الإدارة</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="flex items-center gap-3 mb-7">
            <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-black text-foreground">تسجيل الدخول</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-bold text-foreground mb-2 block">اسم المستخدم</label>
              <div className="relative">
                <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  placeholder="أدخل اسم المستخدم"
                  className={`${inputClass} pr-12`}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-foreground mb-2 block">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="أدخل كلمة المرور"
                  className={`${inputClass} pr-12 pl-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-destructive/5 border-2 border-destructive/20 text-destructive px-4 py-3 rounded-xl text-sm font-semibold">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-gold text-white font-black text-base h-[54px] rounded-xl shadow-lg hover:opacity-90 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جاري تسجيل الدخول...
                </>
              ) : (
                "تسجيل الدخول"
              )}
            </button>
          </form>


        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/")}
            className="text-white/70 hover:text-white text-sm transition-colors font-medium"
          >
            ← العودة للموقع
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
