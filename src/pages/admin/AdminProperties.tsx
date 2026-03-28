import { useState, Fragment } from "react";
import { Link } from "react-router-dom";
import { AdminLayout } from "./Dashboard";
import { useGetAdminPropertiesQuery, useDeletePropertyMutation, PAGE_SIZE } from "@/store/api/propertiesApi";
import { NEIGHBORHOODS, PROPERTY_TYPES } from "@/config";
import { Pencil, Trash2, Plus, ChevronRight, ChevronLeft, Star, Loader2, CheckCircle2, XCircle, UserCheck, UserX, Building2 } from "lucide-react";
import CustomSelect from "@/components/CustomSelect";
import type { SortOption } from "@/store/slices/filtersSlice";
import { ErrorState } from "@/components/common/ErrorState";

const ADMIN_PAGE_SIZE = 10;

const SkeletonRow = ({ isSuperAdmin }: { isSuperAdmin: boolean }) => (
  <tr className="border-b border-border animate-pulse">
    {Array.from({ length: isSuperAdmin ? 8 : 6 }).map((_, i) => (
      <td key={i} className="px-4 py-4"><div className="h-4 bg-muted rounded w-3/4" /></td>
    ))}
  </tr>
);

const AdminProperties = () => {
  const adminUser = JSON.parse(localStorage.getItem("adminUser") ?? "{}");
  const role = adminUser?.role as string | undefined;

  const [page, setPage] = useState(1);
  const [neighborhood, setNeighborhood] = useState("الكل");
  const [type, setType] = useState("الكل");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filters = { neighborhood, type, priceRange: "all", sort: "newest" as SortOption, page };
  const { data, isLoading, isError, error, refetch, isFetching } = useGetAdminPropertiesQuery(filters);
  const [deleteProperty, { isLoading: isDeleting }] = useDeletePropertyMutation();

  const properties = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const handleDelete = async (id: string) => {
    await deleteProperty(id);
    setDeleteId(null);
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl" dir="rtl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-foreground">إدارة العقارات</h2>
            <p className="text-muted-foreground mt-1">{total} عقار إجمالاً</p>
          </div>
          <Link
            to="/admin/add-property"
            className="flex items-center gap-2 gradient-gold text-white font-bold px-5 py-3 rounded-xl shadow-lg hover:opacity-90 transition-all self-start sm:self-auto"
          >
            <Plus className="w-5 h-5" />
            إضافة عقار
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-border p-5 mb-6 flex flex-wrap gap-4">
          <div className="min-w-[180px]">
            <CustomSelect
              value={neighborhood}
              onChange={(v) => { setNeighborhood(v); setPage(1); }}
              options={NEIGHBORHOODS.map((n) => ({ label: n, value: n }))}
              placeholder="كل الأحياء"
            />
          </div>
          <div className="min-w-[180px]">
            <CustomSelect
              value={type}
              onChange={(v) => { setType(v); setPage(1); }}
              options={PROPERTY_TYPES.map((t) => ({ label: t, value: t }))}
              placeholder="كل الأنواع"
            />
          </div>
          {(neighborhood !== "الكل" || type !== "الكل") && (
            <button
              onClick={() => { setNeighborhood("الكل"); setType("الكل"); setPage(1); }}
              className="text-sm text-gold font-bold hover:underline"
            >
              مسح الفلاتر
            </button>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          {isError ? (
            <ErrorState
              statusCode={(error as any)?.status}
              apiMessage={(error as any)?.data?.message}
              onRetry={refetch}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-secondary border-b border-border text-muted-foreground text-xs font-bold uppercase tracking-wider">
                    <th className="px-4 py-3 text-right">العقار</th>
                    <th className="px-4 py-3 text-right">النوع</th>
                    <th className="px-4 py-3 text-right">الحي</th>
                    <th className="px-4 py-3 text-right">السعر</th>
                    <th className="px-4 py-3 text-center">لقطة</th>
                    <th className="px-4 py-3 text-center">نشط</th>
                    {role === "super_admin" && (
                      <>
                        <th className="px-4 py-3 text-right">المعلن</th>
                        <th className="px-4 py-3 text-center">حالة المعلن</th>
                      </>
                    )}
                    <th className="px-4 py-3 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading || (isFetching && !properties.length)
                    ? Array.from({ length: ADMIN_PAGE_SIZE }).map((_, i) => <SkeletonRow key={i} isSuperAdmin={role === "super_admin"} />)
                    : !properties.length
                    ? (
                      <tr>
                        <td colSpan={role === "super_admin" ? 9 : 7} className="py-20 text-center">
                          <div className="flex flex-col items-center gap-3 text-muted-foreground">
                            <Building2 className="w-12 h-12 opacity-30" />
                            <p className="font-bold text-base text-foreground">لا توجد عقارات</p>
                            <p className="text-sm">
                              {neighborhood !== "الكل" || type !== "الكل"
                                ? "لا توجد نتائج تطابق الفلاتر المحددة"
                                : "لم يتم إضافة أي عقارات بعد"}
                            </p>
                            {(neighborhood !== "الكل" || type !== "الكل") && (
                              <button
                                onClick={() => { setNeighborhood("الكل"); setType("الكل"); setPage(1); }}
                                className="mt-1 text-sm text-gold font-bold hover:underline"
                              >
                                مسح الفلاتر
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                    : properties.map((p) => (
                      <tr key={p.id} className="border-b border-border hover:bg-secondary/40 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img src={p.image} alt={p.title} className="w-12 h-10 rounded-lg object-cover shrink-0 border border-border" />
                            <div>
                              <p className="font-bold text-foreground line-clamp-1">{p.title}</p>
                              <p className="text-muted-foreground text-xs">{p.area} م²  •  {p.bedrooms} غرف  •  {p.bathrooms} حمام</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="bg-secondary px-2.5 py-1 rounded-lg font-semibold text-foreground text-xs">{p.type}</span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{p.neighborhood}</td>
                        <td className="px-4 py-3 font-black text-gold">{p.priceFormatted}</td>
                        <td className="px-4 py-3 text-center">
                          {p.featured
                            ? <Star className="w-4 h-4 text-gold fill-gold mx-auto" />
                            : <span className="text-muted-foreground text-xs">—</span>
                          }
                        </td>
                        <td className="px-4 py-3 text-center">
                          {p.active
                            ? <CheckCircle2 className="w-4 h-4 text-green-500 mx-auto" />
                            : <XCircle className="w-4 h-4 text-muted-foreground mx-auto" />
                          }
                        </td>
                        {role === "super_admin" && (
                          <>
                            <td className="px-4 py-3 text-muted-foreground text-xs">{p.addedBy || "—"}</td>
                            <td className="px-4 py-3 text-center">
                              {p.ownerSuspended
                                ? <UserX className="w-4 h-4 text-red-500 mx-auto" />
                                : <UserCheck className="w-4 h-4 text-green-500 mx-auto" />
                              }
                            </td>
                          </>
                        )}
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <Link
                              to={`/admin/edit-property/${p.id}`}
                              className="p-2 rounded-lg bg-secondary hover:bg-gold/10 hover:text-gold transition-colors"
                            >
                              <Pencil className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => setDeleteId(p.id)}
                              className="p-2 rounded-lg bg-secondary hover:bg-destructive/10 hover:text-destructive transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-border">
              <p className="text-sm text-muted-foreground">صفحة {page} من {totalPages}</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg border border-border hover:border-gold/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .map((p, idx, arr) => (
                    <Fragment key={p}>
                      {idx > 0 && arr[idx - 1] !== p - 1 && <span className="text-muted-foreground px-1">…</span>}
                      <button
                        onClick={() => setPage(p)}
                        className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${
                          p === page ? "gradient-gold text-white shadow-md" : "border border-border hover:border-gold/50"
                        }`}
                      >
                        {p}
                      </button>
                    </Fragment>
                  ))
                }
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg border border-border hover:border-gold/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center" dir="rtl">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-destructive" />
            </div>
            <h3 className="font-black text-xl text-foreground mb-2">حذف العقار؟</h3>
            <p className="text-muted-foreground text-sm mb-6">هذا الإجراء لا يمكن التراجع عنه</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 bg-secondary text-foreground font-bold py-3 rounded-xl hover:bg-secondary/80 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                disabled={isDeleting}
                className="flex-1 bg-destructive text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
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

export default AdminProperties;
