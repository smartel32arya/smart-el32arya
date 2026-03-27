import { useState, useEffect } from "react";
import { AdminLayout } from "./Dashboard";
import { User, Phone, Lock, Save, Loader2, CheckCircle2 } from "lucide-react";
import { SITE_NAME } from "@/config";

const BASE_URL = import.meta.env.VITE_API_URL ?? "";

const inputClass =
  "w-full bg-secondary text-foreground rounded-xl px-4 h-[50px] border-2 border-border focus:ring-2 focus:ring-gold/30 focus:border-gold outline-none transition-all text-sm";
const labelClass = "text-sm font-bold text-foreground mb-1.5 block";

interface ProfileData {
  name: string;
  username: string;
  phone: string;
  role: string;
  expiresAt: string | null;
  createdAt: string;
}

const Profile = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loadError, setLoadError] = useState("");

  const [infoForm, setInfoForm] = useState({ name: "", phone: "" });
  const [infoError, setInfoError] = useState("");
  const [infoSuccess, setInfoSuccess] = useState(false);
  const [savingInfo, setSavingInfo] = useState(false);

  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

  const token = localStorage.getItem("adminToken") ?? "";

  // Load profile
  useEffect(() => {
    if (!BASE_URL) {
      // fallback to localStorage when no backend
      const stored = (() => { try { return JSON.parse(localStorage.getItem("adminUser") ?? "{}"); } catch { return {}; } })();
      setProfile(stored);
      setInfoForm({ name: stored.name ?? "", phone: stored.phone ?? "" });
      return;
    }
    fetch(`${BASE_URL}/users/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => {
        setProfile(data);
        setInfoForm({ name: data.name ?? "", phone: data.phone ?? "" });
      })
      .catch(() => setLoadError("تعذّر تحميل بيانات الحساب"));
  }, []);

  const handleInfoSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setInfoError("");
    setInfoSuccess(false);
    setSavingInfo(true);
    try {
      if (!BASE_URL) {
        // mock: update localStorage
        const stored = (() => { try { return JSON.parse(localStorage.getItem("adminUser") ?? "{}"); } catch { return {}; } })();
        const updated = { ...stored, name: infoForm.name, phone: infoForm.phone };
        localStorage.setItem("adminUser", JSON.stringify(updated));
        setProfile(updated);
        setInfoSuccess(true);
        return;
      }
      const res = await fetch(`${BASE_URL}/users/me`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: infoForm.name, phone: infoForm.phone }),
      });
      const data = await res.json();
      if (!res.ok) { setInfoError(data.message ?? "حدث خطأ"); return; }
      setProfile(data);
      localStorage.setItem("adminUser", JSON.stringify(data));
      setInfoSuccess(true);
    } catch {
      setInfoError("تعذّر الاتصال بالخادم");
    } finally {
      setSavingInfo(false);
    }
  };

  const handlePwSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError("");
    setPwSuccess(false);
    if (pwForm.newPassword !== pwForm.confirm) {
      setPwError("كلمة المرور الجديدة غير متطابقة");
      return;
    }
    if (pwForm.newPassword.length < 6) {
      setPwError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }
    setSavingPw(true);
    try {
      if (!BASE_URL) {
        setPwSuccess(true);
        setPwForm({ currentPassword: "", newPassword: "", confirm: "" });
        return;
      }
      const res = await fetch(`${BASE_URL}/users/me`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }),
      });
      const data = await res.json();
      if (!res.ok) { setPwError(data.message ?? "حدث خطأ"); return; }
      setPwSuccess(true);
      setPwForm({ currentPassword: "", newPassword: "", confirm: "" });
    } catch {
      setPwError("تعذّر الاتصال بالخادم");
    } finally {
      setSavingPw(false);
    }
  };

  const ROLE_LABELS: Record<string, string> = {
    super_admin: "مدير كامل",
    property_admin: "مدير عقارات",
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl" dir="rtl">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-black text-foreground">الملف الشخصي</h2>
          <p className="text-muted-foreground mt-1">عرض وتعديل بيانات حسابك</p>
        </div>

        {loadError && (
          <div className="mb-6 bg-destructive/10 border-2 border-destructive/30 text-destructive font-bold rounded-2xl px-6 py-4 text-sm">
            {loadError}
          </div>
        )}

        {/* Info card */}
        {profile && (
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl gradient-gold flex items-center justify-center text-white font-black text-2xl shrink-0">
                {profile.name?.charAt(0) ?? "؟"}
              </div>
              <div>
                <p className="font-black text-foreground text-lg">{profile.name}</p>
                <p className="text-muted-foreground text-sm" dir="ltr">@{profile.username}</p>
                <span className="inline-block mt-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/30">
                  {ROLE_LABELS[profile.role] ?? profile.role}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground border-t border-border pt-4">
              <div>
                <span className="font-semibold text-foreground">تاريخ الإنشاء: </span>
                {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString("ar-EG") : "—"}
              </div>
              {profile.role === "property_admin" && (
                <div>
                  <span className="font-semibold text-foreground">صالح حتى: </span>
                  {profile.expiresAt ? (() => {
                    const expired = new Date(profile.expiresAt) < new Date();
                    return (
                      <span className={expired ? "text-destructive font-bold" : ""}>
                        {new Date(profile.expiresAt).toLocaleDateString("ar-EG")}
                        {expired && " (منتهية)"}
                      </span>
                    );
                  })() : "—"}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Edit info */}
        <div className="bg-white rounded-2xl border border-border p-6 shadow-sm mb-6">
          <h3 className="font-black text-foreground mb-5 flex items-center gap-2">
            <User className="w-5 h-5 text-gold" />
            تعديل البيانات
          </h3>
          <form onSubmit={handleInfoSave} className="space-y-4">
            <div>
              <label className={labelClass}>الاسم</label>
              <input
                type="text"
                value={infoForm.name}
                onChange={(e) => { setInfoForm((p) => ({ ...p, name: e.target.value })); setInfoSuccess(false); }}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>رقم الهاتف</label>
              <input
                type="tel"
                value={infoForm.phone}
                onChange={(e) => { setInfoForm((p) => ({ ...p, phone: e.target.value })); setInfoSuccess(false); }}
                placeholder="01XXXXXXXXX"
                className={inputClass}
                dir="ltr"
              />
            </div>
            {infoError && <p className="text-destructive text-sm font-semibold bg-destructive/5 border border-destructive/20 px-4 py-2.5 rounded-xl">{infoError}</p>}
            {infoSuccess && (
              <p className="text-green-600 text-sm font-semibold bg-green-50 border border-green-200 px-4 py-2.5 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> تم حفظ البيانات بنجاح
              </p>
            )}
            <button
              type="submit"
              disabled={savingInfo}
              className="gradient-gold text-white font-bold px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-70"
            >
              {savingInfo ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              حفظ
            </button>
          </form>
        </div>

        {/* Change password */}
        <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
          <h3 className="font-black text-foreground mb-5 flex items-center gap-2">
            <Lock className="w-5 h-5 text-gold" />
            تغيير كلمة المرور
          </h3>
          <form onSubmit={handlePwSave} className="space-y-4">
            <div>
              <label className={labelClass}>كلمة المرور الحالية</label>
              <input
                type="password"
                value={pwForm.currentPassword}
                onChange={(e) => { setPwForm((p) => ({ ...p, currentPassword: e.target.value })); setPwSuccess(false); }}
                required
                placeholder="••••••••"
                className={inputClass}
                dir="ltr"
              />
            </div>
            <div>
              <label className={labelClass}>كلمة المرور الجديدة</label>
              <input
                type="password"
                value={pwForm.newPassword}
                onChange={(e) => { setPwForm((p) => ({ ...p, newPassword: e.target.value })); setPwSuccess(false); }}
                required
                placeholder="••••••••"
                className={inputClass}
                dir="ltr"
              />
            </div>
            <div>
              <label className={labelClass}>تأكيد كلمة المرور الجديدة</label>
              <input
                type="password"
                value={pwForm.confirm}
                onChange={(e) => { setPwForm((p) => ({ ...p, confirm: e.target.value })); setPwSuccess(false); }}
                required
                placeholder="••••••••"
                className={inputClass}
                dir="ltr"
              />
            </div>
            {pwError && <p className="text-destructive text-sm font-semibold bg-destructive/5 border border-destructive/20 px-4 py-2.5 rounded-xl">{pwError}</p>}
            {pwSuccess && (
              <p className="text-green-600 text-sm font-semibold bg-green-50 border border-green-200 px-4 py-2.5 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> تم تغيير كلمة المرور بنجاح
              </p>
            )}
            <button
              type="submit"
              disabled={savingPw}
              className="gradient-gold text-white font-bold px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-70"
            >
              {savingPw ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              تغيير كلمة المرور
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Profile;
