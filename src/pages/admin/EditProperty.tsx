import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminLayout } from "./Dashboard";
import { useGetPropertyByIdQuery, useUpdatePropertyMutation } from "@/store/api/propertiesApi";
import { NEIGHBORHOODS, PROPERTY_TYPES, AMENITY_SUGGESTIONS } from "@/config";
import CustomSelect from "@/components/CustomSelect";
import { Star, Save, ArrowRight, Loader2, AlertCircle, X, Plus, Upload, GripVertical } from "lucide-react";


const inputClass = "w-full bg-secondary text-foreground rounded-xl px-5 h-[54px] border-2 border-border focus:ring-2 focus:ring-gold/30 focus:border-gold outline-none transition-all text-base";
const labelClass = "text-sm font-bold text-foreground mb-2 block";
const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">{children}</div>
);

const EditProperty = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: property, isLoading, isError } = useGetPropertyByIdQuery(id ?? "");
  const [updateProperty, { isLoading: isSaving }] = useUpdatePropertyMutation();
  const [saved, setSaved] = useState(false);
  const [amenityInput, setAmenityInput] = useState("");

  const [form, setForm] = useState({
    title: "", description: "", price: "", neighborhood: "",
    type: "", area: "", bedrooms: "", bathrooms: "",
    amenities: [] as string[], featured: false, active: true,
  });

  // Images state: existing URLs + new File uploads
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (property) {
      setForm({
        title: property.title,
        description: property.description,
        price: String(property.price),
        neighborhood: property.neighborhood,
        type: property.type,
        area: String(property.area),
        bedrooms: String(property.bedrooms),
        bathrooms: String(property.bathrooms),
        amenities: [...property.amenities],
        featured: property.featured,
        active: property.active ?? true,
      });
      setExistingImages([...property.images]);
    }
  }, [property]);

  const set = (key: keyof typeof form, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const addAmenity = (val: string) => {
    const trimmed = val.trim();
    if (trimmed && !form.amenities.includes(trimmed))
      set("amenities", [...form.amenities, trimmed]);
    setAmenityInput("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProperty({
      id: id!,
      data: {
        title: form.title,
        description: form.description,
        price: parseInt(form.price),
        neighborhood: form.neighborhood,
        type: form.type,
        area: parseInt(form.area),
        bedrooms: parseInt(form.bedrooms),
        bathrooms: parseInt(form.bathrooms),
        amenities: form.amenities,
        featured: form.featured,
        active: form.active,
        images: existingImages,
      },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const neighborhoods = NEIGHBORHOODS.filter((n) => n !== "الكل");
  const propertyTypes = PROPERTY_TYPES.filter((t) => t !== "الكل");

  const handleNewImages = (files: File[]) => {
    const imgs = files.filter((f) => f.type.startsWith("image/"));
    setNewImages((prev) => [...prev, ...imgs]);
    imgs.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => setNewPreviews((p) => [...p, reader.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const removeExisting = (i: number) =>
    setExistingImages((prev) => prev.filter((_, idx) => idx !== i));

  const removeNew = (i: number) => {
    setNewImages((prev) => prev.filter((_, idx) => idx !== i));
    setNewPreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl" dir="rtl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate("/admin/properties")}
            className="p-2 rounded-xl border border-border hover:border-gold/50 transition-colors shrink-0"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h2 className="text-2xl md:text-3xl font-black text-foreground">تعديل العقار</h2>
            {property && <p className="text-muted-foreground mt-0.5 text-sm truncate">{property.title}</p>}
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-10 h-10 animate-spin text-gold" />
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="flex flex-col items-center py-32 gap-4 text-center">
            <AlertCircle className="w-12 h-12 text-destructive" />
            <p className="font-bold text-xl text-foreground">تعذّر تحميل بيانات العقار</p>
            <button onClick={() => navigate("/admin/properties")} className="gradient-gold text-white font-bold px-6 py-3 rounded-xl">
              العودة للقائمة
            </button>
          </div>
        )}

        {/* Form */}
        {!isLoading && !isError && property && (
          <>
            {saved && (
              <div className="mb-6 bg-green-50 border-2 border-green-200 text-green-800 font-bold rounded-2xl px-6 py-4 flex items-center gap-3">
                <span className="text-2xl">✅</span>
                تم حفظ التعديلات بنجاح
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <Card>
                <label className={labelClass}>عنوان العقار <span className="text-destructive">*</span></label>
                <input type="text" value={form.title} onChange={(e) => set("title", e.target.value)} required className={inputClass} />
              </Card>

              <Card>
                <label className={labelClass}>وصف العقار <span className="text-destructive">*</span></label>
                <textarea value={form.description} onChange={(e) => set("description", e.target.value)} required rows={5}
                  className="w-full bg-secondary text-foreground rounded-xl px-5 py-4 border-2 border-border focus:ring-2 focus:ring-gold/30 focus:border-gold outline-none transition-all text-base resize-none" />
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <label className={labelClass}>السعر (جنيه مصري) <span className="text-destructive">*</span></label>
                  <input type="number" value={form.price} onChange={(e) => set("price", e.target.value)} required min="0" className={inputClass} />
                  {form.price && (
                    <p className="text-gold font-bold text-sm mt-2">{Number(form.price).toLocaleString("ar-EG")} ج.م</p>
                  )}
                </Card>
                <Card>
                  <label className={labelClass}>الحي <span className="text-destructive">*</span></label>
                  <CustomSelect value={form.neighborhood} onChange={(v) => set("neighborhood", v)}
                    options={neighborhoods.map((n) => ({ label: n, value: n }))} placeholder="اختر الحي" />
                </Card>
              </div>

              <Card>
                <label className={labelClass}>نوع العقار <span className="text-destructive">*</span></label>
                <div className="flex flex-wrap gap-3 mt-1">
                  {propertyTypes.map((t) => (
                    <button key={t} type="button" onClick={() => set("type", t)}
                      className={`px-5 py-2.5 rounded-xl font-bold text-sm border-2 transition-all ${
                        form.type === t ? "gradient-gold text-white border-transparent shadow-md" : "bg-secondary text-foreground border-border hover:border-gold/50"
                      }`}>
                      {t}
                    </button>
                  ))}
                </div>
              </Card>

              <Card>
                <h3 className="font-black text-lg text-foreground mb-5 flex items-center gap-2">
                  <span className="w-1 h-6 gradient-gold rounded-full inline-block" />المواصفات
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className={labelClass}>المساحة (م²)</label>
                    <input type="number" value={form.area} onChange={(e) => set("area", e.target.value)} min="1" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>غرف النوم</label>
                    <input type="number" value={form.bedrooms} onChange={(e) => set("bedrooms", e.target.value)} min="0" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>الحمامات</label>
                    <input type="number" value={form.bathrooms} onChange={(e) => set("bathrooms", e.target.value)} min="1" className={inputClass} />
                  </div>
                </div>
              </Card>

              <Card>
                <h3 className="font-black text-lg text-foreground mb-5 flex items-center gap-2">
                  <span className="w-1 h-6 gradient-gold rounded-full inline-block" />المميزات
                </h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {AMENITY_SUGGESTIONS.filter((a) => !form.amenities.includes(a)).map((a) => (
                    <button key={a} type="button" onClick={() => addAmenity(a)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm bg-secondary border border-border hover:border-gold/50 hover:bg-gold/5 transition-all font-medium">
                      <Plus className="w-3 h-3" />{a}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3 mb-4">
                  <input type="text" value={amenityInput} onChange={(e) => setAmenityInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAmenity(amenityInput))}
                    placeholder="أضف ميزة مخصصة..." className={`${inputClass} flex-1`} />
                  <button type="button" onClick={() => addAmenity(amenityInput)}
                    className="gradient-gold text-white font-bold px-5 rounded-xl hover:opacity-90 transition-opacity">
                    إضافة
                  </button>
                </div>
                {form.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {form.amenities.map((a) => (
                      <span key={a} className="flex items-center gap-2 bg-gold/10 text-gold border border-gold/30 px-3 py-1.5 rounded-lg text-sm font-bold">
                        {a}
                        <button type="button" onClick={() => set("amenities", form.amenities.filter((x) => x !== a))}>
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </Card>

              <Card>
                <button type="button" onClick={() => set("featured", !form.featured)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                    form.featured ? "border-gold bg-gold/5" : "border-border bg-secondary hover:border-gold/40"
                  }`}>
                  <div className="flex items-center gap-3">
                    <Star className={`w-5 h-5 ${form.featured ? "text-gold fill-gold" : "text-muted-foreground"}`} />
                    <div className="text-right">
                      <p className="font-bold text-foreground">عقار لقطة</p>
                      <p className="text-sm text-muted-foreground">يظهر في قسم العقارات المميزة في الصفحة الرئيسية</p>
                    </div>
                  </div>
                  <div className={`w-12 h-6 rounded-full transition-all ${form.featured ? "gradient-gold" : "bg-border"}`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow mt-0.5 transition-all ${form.featured ? "mr-0.5" : "mr-6"}`} />
                  </div>
                </button>
              </Card>

              {/* Active toggle */}
              <Card>
                <button type="button" onClick={() => set("active", !form.active)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                    form.active ? "border-green-400 bg-green-50" : "border-border bg-secondary hover:border-border"
                  }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${form.active ? "bg-green-500" : "bg-muted-foreground"}`} />
                    <div className="text-right">
                      <p className="font-bold text-foreground">حالة العقار</p>
                      <p className="text-sm text-muted-foreground">
                        {form.active ? "نشط — يظهر للزوار" : "مخفي — لا يظهر للزوار"}
                      </p>
                    </div>
                  </div>
                  <div className={`w-12 h-6 rounded-full transition-all ${form.active ? "bg-green-500" : "bg-border"}`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow mt-0.5 transition-all ${form.active ? "mr-0.5" : "mr-6"}`} />
                  </div>
                </button>
              </Card>

              {/* Images */}
              <Card>
                <h3 className="font-black text-lg text-foreground mb-5 flex items-center gap-2">
                  <span className="w-1 h-6 gradient-gold rounded-full inline-block" />
                  صور العقار
                </h3>

                {/* Existing images */}
                {existingImages.length > 0 && (
                  <div className="mb-5">
                    <p className={labelClass}>الصور الحالية</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {existingImages.map((src, i) => (
                        <div key={i} className="relative group rounded-xl overflow-hidden border-2 border-border">
                          <img src={src} alt="" className="w-full h-28 object-cover" />
                          {i === 0 && (
                            <span className="absolute top-2 right-2 bg-gold text-white text-xs font-bold px-2 py-0.5 rounded-full">رئيسية</span>
                          )}
                          <button
                            type="button"
                            onClick={() => removeExisting(i)}
                            className="absolute top-2 left-2 bg-destructive text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {existingImages.length === 0 && (
                  <div className="mb-4 p-4 bg-destructive/5 border border-destructive/20 rounded-xl text-sm text-destructive font-semibold">
                    ⚠️ لا توجد صور — أضف صورة واحدة على الأقل
                  </div>
                )}

                {/* Upload new */}
                <p className={labelClass}>إضافة صور جديدة</p>
                <div
                  onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => { e.preventDefault(); setDragActive(false); handleNewImages(Array.from(e.dataTransfer.files)); }}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
                    dragActive ? "border-gold bg-gold/5" : "border-border hover:border-gold/50 hover:bg-secondary/50"
                  }`}
                >
                  <input type="file" id="img-upload" multiple accept="image/*"
                    onChange={(e) => e.target.files && handleNewImages(Array.from(e.target.files))}
                    className="hidden" />
                  <label htmlFor="img-upload" className="cursor-pointer flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center shadow-md">
                      <Upload className="w-6 h-6 text-white" />
                    </div>
                    <p className="font-bold text-foreground text-sm">اسحب الصور أو انقر للاختيار</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG, WEBP</p>
                  </label>
                </div>

                {/* New previews */}
                {newPreviews.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                    {newPreviews.map((src, i) => (
                      <div key={i} className="relative group rounded-xl overflow-hidden border-2 border-gold/40">
                        <img src={src} alt="" className="w-full h-28 object-cover" />
                        <span className="absolute top-2 right-2 bg-gold/80 text-white text-xs font-bold px-2 py-0.5 rounded-full">جديدة</span>
                        <button
                          type="button"
                          onClick={() => removeNew(i)}
                          className="absolute top-2 left-2 bg-destructive text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              <button type="submit" disabled={isSaving}
                className="w-full gradient-gold text-white font-black text-lg py-5 rounded-2xl shadow-xl hover:opacity-90 transition-all flex items-center justify-center gap-3 disabled:opacity-70">
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                حفظ التعديلات
              </button>
            </form>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default EditProperty;
