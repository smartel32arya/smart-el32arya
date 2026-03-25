import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "./Dashboard";
import { Upload, X, Plus, Star, Loader2, Video } from "lucide-react";
import CustomSelect from "@/components/CustomSelect";
import { NEIGHBORHOODS, PROPERTY_TYPES, AMENITY_SUGGESTIONS } from "@/config";
import { useCreatePropertyMutation } from "@/store/api/propertiesApi";

interface PropertyFormData {
  title: string;
  description: string;
  price: string;
  neighborhood: string;
  type: string;
  area: string;
  bedrooms: string;
  bathrooms: string;
  amenities: string[];
  featured: boolean;
  active: boolean;
  images: File[];
  videos: File[];
}


const inputClass =
  "w-full bg-secondary text-foreground rounded-xl px-5 h-[54px] border-2 border-border focus:ring-2 focus:ring-gold/30 focus:border-gold outline-none transition-all text-base";

const labelClass = "text-sm font-bold text-foreground mb-2 block";

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-2xl border border-border p-6 shadow-sm ${className}`}>
    {children}
  </div>
);

const AddProperty = () => {
  const navigate = useNavigate();
  const [createProperty, { isLoading: isSaving }] = useCreatePropertyMutation();
  const [formData, setFormData] = useState<PropertyFormData>({
    title: "", description: "", price: "", neighborhood: "",
    type: "", area: "", bedrooms: "", bathrooms: "",
    amenities: [], featured: false, active: true, images: [], videos: [],
  });
  const [dragActive, setDragActive] = useState(false);
  const [dragVideoActive, setDragVideoActive] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoNames, setVideoNames] = useState<string[]>([]);
  const [amenityInput, setAmenityInput] = useState("");
  const [error, setError] = useState("");

  const set = (key: keyof PropertyFormData, value: unknown) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const handleFiles = (files: File[]) => {
    const imgs = files.filter((f) => f.type.startsWith("image/"));
    set("images", [...formData.images, ...imgs]);
    imgs.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreviews((p) => [...p, reader.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (i: number) => {
    set("images", formData.images.filter((_, idx) => idx !== i));
    setImagePreviews((p) => p.filter((_, idx) => idx !== i));
  };

  const handleVideos = (files: File[]) => {
    const vid = files.find((f) => f.type.startsWith("video/"));
    if (!vid) return;
    set("videos", [vid]);
    setVideoNames([vid.name]);
  };

  const removeVideo = (i: number) => {
    set("videos", formData.videos.filter((_, idx) => idx !== i));
    setVideoNames((p) => p.filter((_, idx) => idx !== i));
  };

  const addAmenity = (val: string) => {
    const trimmed = val.trim();
    if (trimmed && !formData.amenities.includes(trimmed)) {
      set("amenities", [...formData.amenities, trimmed]);
    }
    setAmenityInput("");
  };

  const removeAmenity = (a: string) =>
    set("amenities", formData.amenities.filter((x) => x !== a));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const fd = new FormData();
    fd.append("title", formData.title);
    fd.append("description", formData.description);
    fd.append("price", formData.price);
    fd.append("neighborhood", formData.neighborhood);
    fd.append("type", formData.type);
    fd.append("area", formData.area);
    fd.append("bedrooms", formData.bedrooms);
    fd.append("bathrooms", formData.bathrooms);
    fd.append("location", "المنيا الجديدة");
    fd.append("featured", String(formData.featured));
    fd.append("active", String(formData.active));
    fd.append("amenities", JSON.stringify(formData.amenities));
    formData.images.forEach((img) => fd.append("images", img));
    if (formData.videos[0]) fd.append("video", formData.videos[0]);

    try {
      await createProperty(fd).unwrap();
      navigate("/admin/properties");
    } catch {
      setError("حدث خطأ أثناء إضافة العقار، يرجى المحاولة مرة أخرى");
    }
  };

  // filter out "الكل" from options
  const neighborhoods = NEIGHBORHOODS.filter((n) => n !== "الكل");
  const propertyTypes = PROPERTY_TYPES.filter((t) => t !== "الكل");

  return (
    <AdminLayout>
      <div className="max-w-4xl" dir="rtl">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-foreground">إضافة عقار جديد</h2>
          <p className="text-muted-foreground mt-1">أدخل بيانات العقار بالكامل قبل النشر</p>
        </div>

        {error && (
          <div className="mb-6 bg-destructive/10 border-2 border-destructive/30 text-destructive font-bold rounded-2xl px-6 py-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Title */}
          <Card>
            <label className={labelClass}>عنوان العقار <span className="text-destructive">*</span></label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => set("title", e.target.value)}
              required
              placeholder="مثال: شقة فاخرة بإطلالة مميزة في حي الزهراء"
              className={inputClass}
            />
          </Card>

          {/* Description */}
          <Card>
            <label className={labelClass}>وصف العقار <span className="text-destructive">*</span></label>
            <textarea
              value={formData.description}
              onChange={(e) => set("description", e.target.value)}
              required
              rows={5}
              placeholder="اكتب وصفاً تفصيلياً للعقار، المميزات، الموقع، حالة التشطيب..."
              className="w-full bg-secondary text-foreground rounded-xl px-5 py-4 border-2 border-border focus:ring-2 focus:ring-gold/30 focus:border-gold outline-none transition-all text-base resize-none"
            />
          </Card>

          {/* Price + Neighborhood */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <label className={labelClass}>السعر (جنيه مصري) <span className="text-destructive">*</span></label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => set("price", e.target.value)}
                required
                min="0"
                placeholder="2500000"
                className={inputClass}
              />
              {formData.price && (
                <p className="text-gold font-bold text-sm mt-2">
                  {Number(formData.price).toLocaleString("ar-EG")} ج.م
                </p>
              )}
            </Card>

            <Card>
              <label className={labelClass}>الحي <span className="text-destructive">*</span></label>
              <CustomSelect
                value={formData.neighborhood}
                onChange={(v) => set("neighborhood", v)}
                options={neighborhoods.map((n) => ({ label: n, value: n }))}
                placeholder="اختر الحي"
              />
            </Card>
          </div>

          {/* Type */}
          <Card>
            <label className={labelClass}>نوع العقار <span className="text-destructive">*</span></label>
            <div className="flex flex-wrap gap-3 mt-1">
              {propertyTypes.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => set("type", t)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm border-2 transition-all ${
                    formData.type === t
                      ? "gradient-gold text-white border-transparent shadow-md"
                      : "bg-secondary text-foreground border-border hover:border-gold/50"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </Card>

          {/* Specs */}
          <Card>
            <h3 className="font-black text-lg text-foreground mb-5 flex items-center gap-2">
              <span className="w-1 h-6 gradient-gold rounded-full inline-block" />
              المواصفات
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className={labelClass}>المساحة (م²) <span className="text-destructive">*</span></label>
                <input type="number" value={formData.area} onChange={(e) => set("area", e.target.value)} required min="1" placeholder="150" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>غرف النوم <span className="text-destructive">*</span></label>
                <input type="number" value={formData.bedrooms} onChange={(e) => set("bedrooms", e.target.value)} required min="0" placeholder="3" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>الحمامات <span className="text-destructive">*</span></label>
                <input type="number" value={formData.bathrooms} onChange={(e) => set("bathrooms", e.target.value)} required min="1" placeholder="2" className={inputClass} />
              </div>
            </div>
          </Card>

          {/* Amenities */}
          <Card>
            <h3 className="font-black text-lg text-foreground mb-5 flex items-center gap-2">
              <span className="w-1 h-6 gradient-gold rounded-full inline-block" />
              المميزات والمرافق
            </h3>

            {/* Suggestions */}
            <div className="flex flex-wrap gap-2 mb-4">
              {AMENITY_SUGGESTIONS.filter((a) => !formData.amenities.includes(a)).map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => addAmenity(a)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm bg-secondary border border-border hover:border-gold/50 hover:bg-gold/5 transition-all text-foreground font-medium"
                >
                  <Plus className="w-3 h-3" />
                  {a}
                </button>
              ))}
            </div>

            {/* Custom input */}
            <div className="flex gap-3 mb-4">
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
                className="gradient-gold text-white font-bold px-5 rounded-xl hover:opacity-90 transition-opacity"
              >
                إضافة
              </button>
            </div>

            {/* Selected */}
            {formData.amenities.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.amenities.map((a) => (
                  <span key={a} className="flex items-center gap-2 bg-gold/10 text-gold border border-gold/30 px-3 py-1.5 rounded-lg text-sm font-bold">
                    {a}
                    <button type="button" onClick={() => removeAmenity(a)}>
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </Card>

          {/* Featured toggle */}
          <Card>
            <button
              type="button"
              onClick={() => set("featured", !formData.featured)}
              className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                formData.featured
                  ? "border-gold bg-gold/5"
                  : "border-border bg-secondary hover:border-gold/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <Star className={`w-5 h-5 ${formData.featured ? "text-gold fill-gold" : "text-muted-foreground"}`} />
                <div className="text-right">
                  <p className="font-bold text-foreground">عقار لقطة</p>
                  <p className="text-sm text-muted-foreground">يظهر في قسم العقارات المميزة في الصفحة الرئيسية</p>
                </div>
              </div>
              <div className={`w-12 h-6 rounded-full transition-all ${formData.featured ? "gradient-gold" : "bg-border"}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow mt-0.5 transition-all ${formData.featured ? "mr-0.5" : "mr-6"}`} />
              </div>
            </button>
          </Card>

          {/* Active toggle */}
          <Card>
            <button
              type="button"
              onClick={() => set("active", !formData.active)}
              className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                formData.active
                  ? "border-green-400 bg-green-50"
                  : "border-border bg-secondary hover:border-border"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${formData.active ? "bg-green-500" : "bg-muted-foreground"}`} />
                <div className="text-right">
                  <p className="font-bold text-foreground">حالة العقار</p>
                  <p className="text-sm text-muted-foreground">
                    {formData.active ? "نشط — يظهر للزوار" : "مخفي — لا يظهر للزوار"}
                  </p>
                </div>
              </div>
              <div className={`w-12 h-6 rounded-full transition-all ${formData.active ? "bg-green-500" : "bg-border"}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow mt-0.5 transition-all ${formData.active ? "mr-0.5" : "mr-6"}`} />
              </div>
            </button>
          </Card>

          {/* Image Upload */}
          <Card>
            <label className={labelClass}>صور العقار <span className="text-destructive">*</span></label>
            <div
              onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFiles(Array.from(e.dataTransfer.files)); }}
              className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer ${
                dragActive ? "border-gold bg-gold/5" : "border-border hover:border-gold/50 hover:bg-secondary/50"
              }`}
            >
              <input type="file" id="file-upload" multiple accept="image/*" onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))} className="hidden" />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-2xl gradient-gold flex items-center justify-center shadow-lg">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <p className="font-bold text-foreground">اسحب الصور هنا أو انقر للاختيار</p>
                <p className="text-sm text-muted-foreground">PNG, JPG, WEBP — حتى 10MB لكل صورة</p>
              </label>
            </div>

            {imagePreviews.length > 0 && (
              <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-4">
                {imagePreviews.map((src, i) => (
                  <div key={i} className="relative group rounded-xl overflow-hidden border-2 border-border">
                    <img src={src} alt="" className="w-full h-32 object-cover" />
                    {i === 0 && (
                      <span className="absolute top-2 right-2 bg-gold text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        رئيسية
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-2 left-2 bg-destructive text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Video Upload */}
          <Card>
            <label className={labelClass}>فيديو العقار <span className="text-muted-foreground font-normal">(اختياري — فيديو واحد فقط)</span></label>
            {formData.videos.length === 0 ? (
              <div
                onDragEnter={(e) => { e.preventDefault(); setDragVideoActive(true); }}
                onDragLeave={(e) => { e.preventDefault(); setDragVideoActive(false); }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); setDragVideoActive(false); handleVideos(Array.from(e.dataTransfer.files)); }}
                className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer ${
                  dragVideoActive ? "border-gold bg-gold/5" : "border-border hover:border-gold/50 hover:bg-secondary/50"
                }`}
              >
                <input type="file" id="video-upload" accept="video/*" onChange={(e) => e.target.files && handleVideos(Array.from(e.target.files))} className="hidden" />
                <label htmlFor="video-upload" className="cursor-pointer flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-blue-500 flex items-center justify-center shadow-lg">
                    <Video className="w-8 h-8 text-white" />
                  </div>
                  <p className="font-bold text-foreground">اسحب الفيديو هنا أو انقر للاختيار</p>
                  <p className="text-sm text-muted-foreground">MP4, MOV, AVI — فيديو واحد فقط</p>
                </label>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-secondary rounded-xl px-4 py-3 border border-border">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center shrink-0">
                    <Video className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-sm font-bold text-foreground truncate">{videoNames[0]}</p>
                </div>
                <button type="button" onClick={() => removeVideo(0)} className="p-1.5 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </Card>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSaving}
            className="w-full gradient-gold text-white font-black text-lg py-5 rounded-2xl shadow-xl hover:opacity-90 hover:shadow-2xl transition-all hover:-translate-y-0.5 flex items-center justify-center gap-3 disabled:opacity-70"
          >
            {isSaving && <Loader2 className="w-5 h-5 animate-spin" />}
            نشر العقار
          </button>

        </form>
      </div>
    </AdminLayout>
  );
};

export default AddProperty;
