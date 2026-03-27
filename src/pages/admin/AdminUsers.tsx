import { useState } from "react";
import { AdminLayout } from "./Dashboard";
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "@/store/api/usersApi";
import type { AdminUser, UserRole } from "@/store/slices/usersSlice";
import { Plus, Pencil, Trash2, Shield, ShieldCheck, Loader2, X, AlertCircle, CheckCircle2, XCircle } from "lucide-react";

const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: "مدير كامل",
  property_admin: "مدير عقارات",
};

const ROLE_COLORS: Record<UserRole, string> = {
  super_admin: "bg-gold/10 text-gold border-gold/30",
  property_admin: "bg-blue-50 text-blue-600 border-blue-200",
};

const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  super_admin: ["إدارة العقارات", "إضافة وتعديل وحذف العقارات", "إدارة المستخدمين"],
  property_admin: ["إدارة العقارات", "إضافة وتعديل وحذف العقارات"],
};

const emptyForm = { name: "", username: "", password: "", role: "property_admin" as UserRole, expiresAt: "", phone: "" };

const inputClass = "w-full bg-secondary text-foreground rounded-xl px-4 h-[50px] border-2 border-border focus:ring-2 focus:ring-gold/30 focus:border-gold outline-none transition-all text-sm";
const labelClass = "text-sm font-bold text-foreground mb-1.5 block";

const AdminUsers = () => {
  const { data: users = [], isLoading, isError, refetch } = useGetUsersQuery();
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const currentUserId = (() => {
    try { return JSON.parse(localStorage.getItem("adminUser") ?? "{}").id; } catch { return null; }
  })();

  const [modal, setModal] = useState<{ open: boolean; editing: AdminUser | null }>({ open: false, editing: null });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");

  const stats = {
    total: users.length,
    superAdmins: users.filter((u) => u.role === "super_admin").length,
    propertyAdmins: users.filter((u) => u.role === "property_admin").length,
  };

  const openAdd = () => {
    setForm(emptyForm);
    setFormError("");
    setModal({ open: true, editing: null });
  };

  const openEdit = (user: AdminUser) => {
    setForm({ name: user.name, username: user.username, password: "", role: user.role, expiresAt: user.expiresAt ? user.expiresAt.split("T")[0] : "", phone: user.phone ?? "" });
    setFormError("");
    setModal({ open: true, editing: user });
  };

  const closeModal = () => setModal({ open: false, editing: null });

  const handleSave = async () => {
    if (!form.name.trim() || !form.username.trim()) {
      setFormError("الاسم واسم المستخدم مطلوبان");
      return;
    }
    if (!modal.editing && !form.password.trim()) {
      setFormError("كلمة المرور مطلوبة");
      return;
    }
    const phonePattern = /^(\+?20)?01[0125]\d{8}$/;
    if (!modal.editing && form.phone && !phonePattern.test(form.phone)) {
      setFormError("رقم الهاتف غير صحيح، يجب أن يكون رقم مصري صحيح");
      return;
    }
    setFormError("");
    try {
      if (modal.editing) {
        const payload: Record<string, unknown> = { name: form.name, username: form.username, role: form.role, phone: form.phone, expiresAt: form.expiresAt || null };
        if (form.password.trim()) payload.password = form.password;
        await updateUser({ id: modal.editing.id, data: payload }).unwrap();
      } else {
        await createUser({ name: form.name, username: form.username, password: form.password, role: form.role, phone: form.phone, expiresAt: form.expiresAt || null }).unwrap();
      }
      closeModal();
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ??
        "حدث خطأ، حاول مجدداً";
      setFormError(msg);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteUser(id);
    setDeleteId(null);
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl" dir="rtl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-foreground">إدارة المستخدمين</h2>
            <p className="text-muted-foreground mt-1">{stats.total} مستخدم إجمالاً</p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 gradient-gold text-white font-bold px-5 py-3 rounded-xl shadow-lg hover:opacity-90 transition-all self-start sm:self-auto"
          >
            <Plus className="w-5 h-5" />
            إضافة مستخدم
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: "الإجمالي", value: stats.total, color: "text-foreground" },
            { label: "مدير كامل", value: stats.superAdmins, color: "text-gold" },
            { label: "مدير عقارات", value: stats.propertyAdmins, color: "text-blue-600" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-border p-5 text-center shadow-sm">
              <div className={`text-3xl font-black mb-1 ${s.color}`}>{s.value}</div>
              <div className="text-muted-foreground text-sm font-semibold">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Roles legend */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {(Object.keys(ROLE_LABELS) as UserRole[]).map((role) => (
            <div key={role} className="bg-white rounded-2xl border border-border p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                {role === "super_admin" ? <ShieldCheck className="w-5 h-5 text-gold" /> : <Shield className="w-5 h-5 text-blue-500" />}
                <span className="font-black text-foreground">{ROLE_LABELS[role]}</span>
              </div>
              <ul className="space-y-1">
                {ROLE_PERMISSIONS[role].map((p) => (
                  <li key={p} className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          {isError ? (
            <div className="flex flex-col items-center py-20 gap-3 text-center">
              <AlertCircle className="w-10 h-10 text-destructive" />
              <p className="font-bold text-foreground">تعذّر تحميل المستخدمين</p>
              <button onClick={refetch} className="gradient-gold text-white font-bold px-5 py-2.5 rounded-xl text-sm">إعادة المحاولة</button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-secondary border-b border-border text-muted-foreground text-xs font-bold uppercase tracking-wider">
                    <th className="px-4 py-3 text-right">المستخدم</th>
                    <th className="px-4 py-3 text-right">الصلاحية</th>
                    <th className="px-4 py-3 text-center">الحالة</th>
                    <th className="px-4 py-3 text-right hidden md:table-cell">صالح حتى</th>
                    <th className="px-4 py-3 text-right hidden md:table-cell">تاريخ الإضافة</th>
                    <th className="px-4 py-3 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading
                    ? Array.from({ length: 3 }).map((_, i) => (
                        <tr key={i} className="border-b border-border animate-pulse">
                          {[1,2,3,4,5,6].map((j) => (
                            <td key={j} className="px-4 py-4"><div className="h-4 bg-muted rounded w-3/4" /></td>
                          ))}
                        </tr>
                      ))
                    : users.map((user) => (
                        <tr key={user.id} className="border-b border-border hover:bg-secondary/40 transition-colors">
                          <td className="px-4 py-4">
                            <div>
                              <p className="font-bold text-foreground">{user.name}</p>
                              <p className="text-muted-foreground text-xs" dir="ltr">@{user.username}</p>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${ROLE_COLORS[user.role]}`}>
                              {user.role === "super_admin" ? <ShieldCheck className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                              {ROLE_LABELS[user.role]}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            {user.active
                              ? <CheckCircle2 className="w-4 h-4 text-green-500 mx-auto" />
                              : <XCircle className="w-4 h-4 text-destructive mx-auto" />
                            }
                          </td>
                          <td className="px-4 py-4 hidden md:table-cell">
                            {user.expiresAt ? (() => {
                              const expired = new Date(user.expiresAt) < new Date();
                              return (
                                <span className={`text-xs font-semibold ${expired ? "text-destructive" : "text-muted-foreground"}`}>
                                  {new Date(user.expiresAt).toLocaleDateString("ar-EG")}
                                  {expired && <span className="mr-1">(منتهية)</span>}
                                </span>
                              );
                            })() : <span className="text-muted-foreground text-xs">—</span>}
                          </td>
                          <td className="px-4 py-4 text-muted-foreground text-xs hidden md:table-cell">{user.createdAt}</td>
                          <td className="px-4 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button onClick={() => openEdit(user)} className="p-2 rounded-lg bg-secondary hover:bg-gold/10 hover:text-gold transition-colors">
                                <Pencil className="w-4 h-4" />
                              </button>
                              {user.id !== currentUserId && (
                                <button onClick={() => setDeleteId(user.id)} className="p-2 rounded-lg bg-secondary hover:bg-destructive/10 hover:text-destructive transition-colors">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                  }
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {modal.open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl" dir="rtl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-xl text-foreground">
                {modal.editing ? "تعديل المستخدم" : "إضافة مستخدم جديد"}
              </h3>
              <button onClick={closeModal} className="p-2 rounded-lg hover:bg-secondary transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>الاسم <span className="text-destructive">*</span></label>
                <input type="text" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="الاسم الكامل" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>اسم المستخدم <span className="text-destructive">*</span></label>
                <input type="text" value={form.username}
                  onChange={(e) => { if (/[\u0600-\u06FF]/.test(e.target.value)) return; setForm((p) => ({ ...p, username: e.target.value })); }}
                  placeholder="username" className={inputClass} dir="ltr" />
              </div>
              <div>
                <label className={labelClass}>
                  كلمة المرور{" "}
                  {modal.editing
                    ? <span className="text-muted-foreground font-normal">(اتركها فارغة للإبقاء على الحالية)</span>
                    : <span className="text-destructive">*</span>
                  }
                </label>
                <input type="password" value={form.password}
                  onChange={(e) => { if (/[\u0600-\u06FF]/.test(e.target.value)) return; setForm((p) => ({ ...p, password: e.target.value })); }}
                  placeholder={modal.editing ? "••••••••" : "أدخل كلمة المرور"} className={inputClass} dir="ltr" />
              </div>
              <div>
                <label className={labelClass}>الصلاحية</label>
                <div className="flex gap-3">
                  {(Object.keys(ROLE_LABELS) as UserRole[]).map((role) => (
                    <button key={role} type="button" onClick={() => setForm((p) => ({ ...p, role }))}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm border-2 transition-all ${
                        form.role === role
                          ? role === "super_admin" ? "gradient-gold text-white border-transparent" : "bg-blue-500 text-white border-transparent"
                          : "bg-secondary text-foreground border-border hover:border-gold/50"
                      }`}>
                      {role === "super_admin" ? <ShieldCheck className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                      {ROLE_LABELS[role]}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  {ROLE_PERMISSIONS[form.role].join(" • ")}
                </p>
              </div>
              <div>
                <label className={labelClass}>رقم الهاتف <span className="text-destructive">*</span></label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="01XXXXXXXXX"
                  className={inputClass}
                  dir="ltr"
                />
              </div>
              {form.role === "property_admin" && (
                <div>
                  <label className={labelClass}>تاريخ انتهاء الصلاحية</label>
                  <input
                    type="date"
                    value={form.expiresAt}
                    onChange={(e) => setForm((p) => ({ ...p, expiresAt: e.target.value }))}
                    className={inputClass}
                    dir="ltr"
                  />
                </div>
              )}
              {formError && (
                <p className="text-destructive text-sm font-semibold bg-destructive/5 border border-destructive/20 px-4 py-2.5 rounded-xl">
                  {formError}
                </p>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={closeModal} className="flex-1 bg-secondary text-foreground font-bold py-3 rounded-xl hover:bg-secondary/80 transition-colors">
                إلغاء
              </button>
              <button onClick={handleSave} disabled={isCreating || isUpdating}
                className="flex-1 gradient-gold text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-70">
                {(isCreating || isUpdating) && <Loader2 className="w-4 h-4 animate-spin" />}
                {modal.editing ? "حفظ التعديلات" : "إضافة"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center" dir="rtl">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-destructive" />
            </div>
            <h3 className="font-black text-xl text-foreground mb-2">حذف المستخدم؟</h3>
            <p className="text-muted-foreground text-sm mb-6">هذا الإجراء لا يمكن التراجع عنه</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 bg-secondary text-foreground font-bold py-3 rounded-xl">إلغاء</button>
              <button onClick={() => handleDelete(deleteId)} disabled={isDeleting}
                className="flex-1 bg-destructive text-white font-bold py-3 rounded-xl hover:opacity-90 flex items-center justify-center gap-2">
                {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminUsers;
