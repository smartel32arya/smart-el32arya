import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "./Dashboard";
import { Upload, X, Plus, Loader2, Video, Home, DollarSign, MapPin, Sparkles, ImageIcon, Settings, RefreshCw } from "lucide-react";
import CustomSelect from "@/components/CustomSelect";
import { NEIGHBORHOODS, PROPERTY_TYPES, AMENITY_SUGGESTIONS } from "@/config";
import { useAdminActions } from "@/hooks/useAdminActions";
import { useFileUpload } from "@/hooks/useFileUpload";
import { toast } from "sonner";

interface PropertyFormData {
  title: string;
  description: string;
  price: string;
  neighborhood: string;
  type: string;
  area: string;
  listingType: "sale" | "rent";
  amenities: string[];
  featured: boolean;
  active: boolean;
  showPrice: boolean;
}

const inputClass =
  "w-full bg-secondary text-foreground rounded-xl px-4 h-[52px] border-2 border-border focus:ring-2 focus:ring-gold/30 focus:border-gold outline-none transition-all text-base";

const labelClass = "text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1.5 block";

// ── Section wrapper ──────────────────────────────────────────────────────────
const Section = ({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
    <div className="flex items-center gap-3 px-4 py-3.5 sm:px-6 sm:py-4 border-b border-border bg-secondary/30">
      <div className="w-8 h-8 rounded-lg gradient-gold flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-white" />
      </div>
      <h3 className="font-black text-sm sm:text-base text-foreground">{title}</h3>
    </div>
    <div className="p-4 sm:p-6">{children}</div>
  </div>
);

// ── Toggle row ───────────────────────────────────────────────────────────────
const Toggle = ({
  checked,
  onChange,
  label,
  description,
  activeColor = "gradient-gold",
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  description: string;
  activeColor?: string;
}) => (
  <button
    type="button"
    onClick={onChange}
    className="w-full flex items-center justify-between py-3 text-right group"
  >
    <div className="min-w-0">
      <p className="font-bold text-sm text-foreground">{label}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
    </div>
    <div
      className={`shrink-0 ms-4 w-11 h-6 rounded-full transition-all relative ${
        checked ? activeColor : "bg-border"
      }`}
    >
      <div
        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
          checked ? "right-0.5" : "left-0.5"
        }`}
      />
    </div>
  </button>
);

const AddProperty = () => {
  const navigate = useNavigate();
  const { createProperty, isCreating } = useAdminActions();
  const imageUpload = useFileUpload();
  const videoUpload = useFileUpload();
  const isSaving = isCreating;
  const [formData, setFormData] = useState<PropertyFormData>({
    title: "", description: "", price: "", neighborhood: "",
    type: "", area: "", listingType: "sale",
    amenities: [], featured: false, active: true, showPrice: true,
  });
  const [dragActive, setDragActive] = useState(false);
  const [dragVideoActive, setDragVideoActive] = useState(false);
  const [amenityInput, setAmenityInput] = useState("");
  const [isCustomNeighborhood, setIsCustomNeighborhood] = useState(false);
  const [error, setError] = useState("");

  const set = (key: keyof PropertyFormData, value: unknown) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const handleFiles = (files: File[]) => {
    imageUpload.addFiles(files, "image");
  };

  const handleVideos = (files: File[]) => {
    const vid = files.find((f) => f.type.startsWith("video/"));
    if (!vid) return;
    videoUpload.addFiles([vid], "video");
  };

  const addAmenity = (val: string) => {
    const trimmed = val.trim();
    if (trimmed && !formData.amenities.includes(trimmed))
      set("amenities", [...formData.amenities, trimmed]);
    setAmenityInput("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (Number(formData.price) < (formData.listingType === "rent" ? 1000 : 55000)) {
      toast.error(formData.listingType === "rent" ? "السعر يجب أن يكون أكبر من ١,٠٠٠ ج.م" : "السعر يجب أن يكون أكبر من ٥٥,٠٠٠ ج.م");
      return;
    }
    if (!formData.neighborhood.trim()) {
      toast.error("يرجى اختيار الحي");
      return;
    }
    if (!formData.type) {
      toast.error("يرجى اختيار نوع العقار");
      return;
    }
    const formFields = {
      title: formData.title,
      description: formData.description,
      price: formData.price,
      neighborhood: formData.neighborhood,
      type: formData.type,
      area: formData.area,
      listingType: formData.listingType,
      amenities: formData.amenities,
      featured: formData.featured,
      active: formData.active,
      showPrice: formData.showPrice,
    };
    try {
      await createProperty(formFields, imageUpload.urls, videoUpload.urls[0] ?? null);
      toast.success("تم نشر العقار بنجاح", {
        description: `"${formData.title}" أصبح متاحاً الآن للزوار`,
        duration: 4000,
      });
      navigate("/admin/properties");
    } catch (err: any) {
      toast.error("فشل نشر العقار", {
        description: err?.data?.message || "حدث خطأ، حاول مجدداً",
        duration: 5000,
      });
    }
  };

  const neighborhoods = NEIGHBORHOODS.filter((n) => n !== "الكل");
  const propertyTypes = PROPERTY_TYPES.filter((t) => t !== "الكل");
  const isSubmitDisabled = isSaving || imageUpload.isAnyUploading || videoUpload.isAnyUploading;

  return (
    <AdminLayout>
      <div className="max-w-3xl w-full" dir="rtl">

        {/* Page header */}
        <div className="mb-5 sm:mb-8">
          <h2 className="text-lg sm:text-2xl font-black text-foreground">إضافة عقار جديد</h2>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1">أدخل بيانات العقار ثم انشره مباشرة</p>
        </div>

        {error && (
          <div className="mb-6 bg-destructive/10 border border-destructive/30 text-destructive font-bold rounded-xl px-5 py-3 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* ── 1. Basic info ── */}
          <Section icon={Home} title="المعلومات الأساسية">
            <div className="space-y-4">
              <div>
                <label className={labelClass}>عنوان العقار <span className="text-destructive normal-case">*</span></label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => set("title", e.target.value)}
                  required
                  placeholder="مثال: شقة فاخرة بإطلالة مميزة في حي الزهراء"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>وصف العقار <span className="text-destructive normal-case">*</span></label>
                <textarea
                  value={formData.description}
                  onChange={(e) => set("description", e.target.value)}
                  required
                  rows={4}
                  placeholder="اكتب وصفاً تفصيلياً للعقار، المميزات، الموقع، حالة التشطيب..."
                  className="w-full bg-secondary text-foreground rounded-xl px-4 py-3 border-2 border-border focus:ring-2 focus:ring-gold/30 focus:border-gold outline-none transition-all text-sm resize-none"
                />
              </div>
            </div>
          </Section>

          {/* ── 2. Location & Type ── */}
          <Section icon={MapPin} title="الموقع والنوع">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={labelClass}>الحي <span className="text-destructive normal-case">*</span></label>
                <CustomSelect
                  value={isCustomNeighborhood ? "__custom__" : formData.neighborhood}
                  onChange={(v) => {
                    if (v === "__custom__") {
                      setIsCustomNeighborhood(true);
                      set("neighborhood", "");
                    } else {
                      setIsCustomNeighborhood(false);
                      set("neighborhood", v);
                    }
                  }}
                  options={[
                    ...neighborhoods.map((n) => ({ label: n, value: n })),
                    { label: "✏️ حي مخصص...", value: "__custom__" },
                  ]}
                  placeholder="اختر الحي"
                />
                {isCustomNeighborhood && (
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.neighborhood}
                      onChange={(e) => set("neighborhood", e.target.value)}
                      placeholder="اكتب اسم الحي..."
                      className={inputClass}
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => { setIsCustomNeighborhood(false); set("neighborhood", ""); }}
                      className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground hover:text-destructive transition-colors"
                      title="إلغاء"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className={labelClass}>
                  المساحة (م²){" "}
                  <span className="text-muted-foreground normal-case font-normal tracking-normal">اختياري</span>
                </label>
                <input
                  type="number"
                  value={formData.area}
                  onChange={(e) => set("area", e.target.value)}
                  min="1"
                  placeholder="150"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="mt-5 pt-5 border-t border-border">
              <label className={labelClass}>نوع العقار <span className="text-destructive normal-case">*</span></label>
              <div className="flex flex-wrap gap-2 mt-2">
                {propertyTypes.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => set("type", t)}
                    className={`px-4 py-2 rounded-lg font-bold text-xs border-2 transition-all ${
                      formData.type === t
                        ? "gradient-gold text-white border-transparent shadow-sm"
                        : "bg-secondary text-foreground border-border hover:border-gold/50"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-5 border-t border-border">
              <label className={labelClass}>نوع العرض <span className="text-destructive normal-case">*</span></label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {(["sale", "rent"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => set("listingType", t)}
                    className={`py-3 rounded-xl font-bold text-sm border-2 transition-all flex items-center justify-center gap-2 ${
                      formData.listingType === t
                        ? t === "rent"
                          ? "bg-blue-500 text-white border-transparent shadow-sm"
                          : "bg-green-500 text-white border-transparent shadow-sm"
                        : "bg-secondary text-foreground border-border hover:border-gold/50"
                    }`}
                  >
                    <span>{t === "rent" ? "🔑" : "🏷️"}</span>
                    {t === "rent" ? "للإيجار" : "للبيع"}
                  </button>
                ))}
              </div>
            </div>
          </Section>

          {/* ── 3. Price ── */}
          <Section icon={DollarSign} title="السعر">
            <div>
              <label className={labelClass}>السعر (جنيه مصري) <span className="text-destructive normal-case">*</span></label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => set("price", e.target.value)}
                required
                min={formData.listingType === "rent" ? "1000" : "55000"}
                placeholder={formData.listingType === "rent" ? "5,000" : "2,500,000"}
                className={`${inputClass} ${formData.price && Number(formData.price) < (formData.listingType === "rent" ? 1000 : 55000) ? "border-destructive" : ""}`}
              />
              {formData.price && Number(formData.price) < (formData.listingType === "rent" ? 1000 : 55000) ? (
                <p className="text-destructive text-xs font-bold mt-1.5">
                  {"أدخل سعر العقار الفعلي"}
                </p>
              ) : formData.price ? (
                <p className="text-gold text-xs font-bold mt-1.5">{Number(formData.price).toLocaleString("ar-EG")} ج.م</p>
              ) : null}
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <Toggle
                checked={formData.showPrice}
                onChange={() => set("showPrice", !formData.showPrice)}
                label="إظهار السعر للزوار"
                description={formData.showPrice ? "السعر مرئي على صفحة العقار" : "سيظهر زر 'اسأل عن السعر' بدلاً من الرقم"}
              />
            </div>
          </Section>

          {/* ── 4. Amenities ── */}
          <Section icon={Sparkles} title="المميزات والمرافق">
            <div className="flex flex-wrap gap-2 mb-4">
              {AMENITY_SUGGESTIONS.filter((a) => !formData.amenities.includes(a)).map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => addAmenity(a)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-secondary border border-border hover:border-gold/50 hover:bg-gold/5 transition-all font-medium"
                >
                  <Plus className="w-3 h-3" />
                  {a}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAmenity(amenityInput))}
                placeholder="أضف ميزة مخصصة..."
                className={`${inputClass} flex-1`}
              />
              <button
                type="button"
                onClick={() => addAmenity(amenityInput)}
                className="gradient-gold text-white font-bold px-4 rounded-xl hover:opacity-90 transition-opacity text-sm shrink-0"
              >
                إضافة
              </button>
            </div>
            {formData.amenities.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
                {formData.amenities.map((a) => (
                  <span key={a} className="flex items-center gap-1.5 bg-gold/10 text-gold border border-gold/30 px-3 py-1.5 rounded-lg text-xs font-bold">
                    {a}
                    <button type="button" onClick={() => set("amenities", formData.amenities.filter((x) => x !== a))}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </Section>

          {/* ── 5. Media ── */}
          <Section icon={ImageIcon} title="الصور والفيديو">
            {/* Image upload drop zone */}
            <div
              onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFiles(Array.from(e.dataTransfer.files)); }}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                dragActive ? "border-gold bg-gold/5" : "border-border hover:border-gold/40 hover:bg-secondary/40"
              }`}
            >
              <input type="file" id="file-upload" multiple accept="image/*" onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))} className="hidden" />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center shadow-md">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <p className="font-bold text-sm text-foreground">اسحب الصور هنا أو انقر للاختيار</p>
                <p className="text-xs text-muted-foreground">PNG, JPG, WEBP — حتى 5MB لكل صورة</p>
              </label>
            </div>

            {/* Per-file image UI */}
            {imageUpload.items.length > 0 && (
              <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-3">
                {imageUpload.items.map((item, i) => {
                  const previewUrl = item.status === "done" && item.url
                    ? item.url
                    : URL.createObjectURL(item.file);
                  return (
                    <div key={item.id} className="relative group rounded-xl overflow-hidden border-2 border-border aspect-square">
                      <img src={previewUrl} alt="" className="w-full h-full object-cover" />

                      {/* Uploading overlay */}
                      {item.status === "uploading" && (
                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-1">
                          <Loader2 className="w-6 h-6 text-white animate-spin" />
                          <span className="text-white text-[10px] font-bold">{item.progress}%</span>
                        </div>
                      )}

                      {/* Error overlay */}
                      {item.status === "error" && (
                        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-1 p-1">
                          <p className="text-white text-[9px] text-center leading-tight line-clamp-2">{item.error}</p>
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={() => imageUpload.retryItem(item.id)}
                              className="bg-blue-500 text-white p-1 rounded-full"
                              title="إعادة المحاولة"
                            >
                              <RefreshCw className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => imageUpload.removeItem(item.id)}
                              className="bg-destructive text-white p-1 rounded-full"
                              title="حذف"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Primary badge */}
                      {i === 0 && item.status !== "error" && (
                        <span className="absolute bottom-1 inset-x-1 text-center bg-gold text-white text-[9px] sm:text-[10px] font-bold py-0.5 rounded-md">
                          رئيسية
                        </span>
                      )}

                      {/* Remove button (done state) */}
                      {item.status === "done" && (
                        <button
                          type="button"
                          onClick={() => imageUpload.removeItem(item.id)}
                          className="absolute top-1 left-1 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Video upload */}
            <div className="mt-4 pt-4 border-t border-border">
              <label className={labelClass}>فيديو <span className="text-muted-foreground normal-case font-normal">اختياري — فيديو واحد فقط</span></label>

              {videoUpload.items.length === 0 ? (
                <div
                  onDragEnter={(e) => { e.preventDefault(); setDragVideoActive(true); }}
                  onDragLeave={(e) => { e.preventDefault(); setDragVideoActive(false); }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => { e.preventDefault(); setDragVideoActive(false); handleVideos(Array.from(e.dataTransfer.files)); }}
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
                    dragVideoActive ? "border-blue-400 bg-blue-50" : "border-border hover:border-blue-300 hover:bg-blue-50/30"
                  }`}
                >
                  <input type="file" id="video-upload" accept="video/*" onChange={(e) => e.target.files && handleVideos(Array.from(e.target.files))} className="hidden" />
                  <label htmlFor="video-upload" className="cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center shadow-sm shrink-0">
                      <Video className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-center sm:text-right">
                      <p className="font-bold text-sm text-foreground">اسحب الفيديو أو انقر للاختيار</p>
                      <p className="text-xs text-muted-foreground">MP4, MOV, AVI, WebM — حتى 100MB</p>
                    </div>
                  </label>
                </div>
              ) : (
                videoUpload.items.map((item) => (
                  <div key={item.id} className="rounded-xl border border-blue-200 bg-blue-50 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-blue-500 flex items-center justify-center shrink-0">
                          {item.status === "uploading"
                            ? <Loader2 className="w-4 h-4 text-white animate-spin" />
                            : <Video className="w-4 h-4 text-white" />
                          }
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-foreground truncate">{item.file.name}</p>
                          {item.status === "uploading" && (
                            <>
                              <p className="text-xs text-blue-600 font-medium">جاري الرفع... {item.progress}%</p>
                              <div className="w-full bg-blue-100 rounded-full h-1.5 mt-1">
                                <div
                                  className="bg-blue-500 h-1.5 rounded-full transition-all duration-200"
                                  style={{ width: `${item.progress}%` }}
                                />
                              </div>
                            </>
                          )}
                          {item.status === "done" && (
                            <p className="text-xs text-green-600 font-medium">تم الرفع بنجاح</p>
                          )}
                          {item.status === "error" && (
                            <p className="text-xs text-destructive font-medium">{item.error}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {item.status === "error" && (
                          <button
                            type="button"
                            onClick={() => videoUpload.retryItem(item.id)}
                            className="p-1.5 rounded-lg hover:bg-blue-100 text-blue-600 transition-colors"
                            title="إعادة المحاولة"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          type="button"
                          disabled={item.status === "uploading"}
                          onClick={() => videoUpload.removeItem(item.id)}
                          className="p-1.5 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors disabled:opacity-40 disabled:pointer-events-none"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Section>

          {/* ── 6. Settings ── */}
          <Section icon={Settings} title="إعدادات النشر">
            <div className="divide-y divide-border">
              <div className="pb-3">
                <Toggle
                  checked={formData.active}
                  onChange={() => set("active", !formData.active)}
                  label="نشر العقار"
                  description={formData.active ? "مرئي للزوار الآن" : "مخفي — لن يظهر للزوار"}
                  activeColor="bg-green-500"
                />
              </div>
              <div className="pt-3">
                <Toggle
                  checked={formData.featured}
                  onChange={() => set("featured", !formData.featured)}
                  label="عقار لقطة ⭐"
                  description="يظهر في قسم العقارات المميزة بالصفحة الرئيسية"
                />
              </div>
            </div>
          </Section>

          {/* ── Submit ── */}
          <div className="sticky bottom-0 bg-background/90 backdrop-blur-md pt-3 pb-4 -mx-4 px-4 lg:-mx-8 lg:px-8 border-t border-border/50 mt-2">
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="w-full gradient-gold text-white font-black text-base py-4 rounded-2xl shadow-lg hover:opacity-90 hover:shadow-xl transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-60 disabled:translate-y-0 min-h-[56px]"
            >
              {(isSaving || imageUpload.isAnyUploading || videoUpload.isAnyUploading) ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              {imageUpload.isAnyUploading || videoUpload.isAnyUploading
                ? "جاري رفع الملفات..."
                : isSaving
                ? "جاري الحفظ..."
                : "نشر العقار"}
            </button>
          </div>

        </form>
      </div>
    </AdminLayout>
  );
};

export default AddProperty;
