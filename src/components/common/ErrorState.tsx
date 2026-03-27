import { AlertCircle, LogIn, LogOut, ArrowRight, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  statusCode?: 401 | 403 | 404 | 500 | number;
  apiMessage?: string;       // raw message from API response body
  message?: string;          // override display message
  description?: string;
  onRetry?: () => void;
  onLogin?: () => void;      // shown for 401
  onLogout?: () => void;     // shown for 403 "انتهت صلاحية الحساب"
  onBack?: () => void;       // shown for 404
}

function deriveMessage(statusCode?: number, apiMessage?: string): string {
  if (statusCode === 401) return "يجب تسجيل الدخول أولاً";
  if (statusCode === 403) {
    if (apiMessage?.includes("انتهت صلاحية الحساب")) return "انتهت صلاحية حسابك";
    return "غير مصرح بالوصول لهذا العقار";
  }
  if (statusCode === 404) return "العنصر المطلوب غير موجود";
  if (statusCode === 500) return "حدث خطأ في الخادم، حاول مجدداً لاحقاً";
  return "حدث خطأ غير متوقع";
}

export function ErrorState({
  statusCode,
  apiMessage,
  message,
  description,
  onRetry,
  onLogin,
  onLogout,
  onBack,
}: ErrorStateProps) {
  const displayMessage = message ?? deriveMessage(statusCode, apiMessage);

  const show401Login = statusCode === 401 && onLogin;
  const show403Logout = statusCode === 403 && apiMessage?.includes("انتهت صلاحية الحساب") && onLogout;
  const show404Back = statusCode === 404 && onBack;

  return (
    <div
      className="flex flex-col items-center justify-center py-24 gap-6 text-center"
      dir="rtl"
    >
      <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center ring-1 ring-destructive/20">
        <AlertCircle className="w-10 h-10 text-destructive" />
      </div>

      <div className="flex flex-col gap-2 max-w-sm">
        <p className="text-foreground font-bold text-xl">{displayMessage}</p>
        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        {show401Login && (
          <button
            onClick={onLogin}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl gradient-gold text-gold-foreground font-semibold hover:opacity-90 transition-opacity shadow-md"
          >
            <LogIn className="w-4 h-4" />
            تسجيل الدخول
          </button>
        )}

        {show403Logout && (
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-destructive text-destructive-foreground font-semibold hover:opacity-90 transition-opacity shadow-md"
          >
            <LogOut className="w-4 h-4" />
            تسجيل الخروج
          </button>
        )}

        {show404Back && (
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl glass-card text-foreground font-semibold hover:opacity-90 transition-opacity shadow-md"
          >
            <ArrowRight className="w-4 h-4" />
            العودة
          </button>
        )}

        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-muted text-foreground font-semibold hover:opacity-90 transition-opacity shadow-md"
          >
            <RefreshCw className="w-4 h-4" />
            إعادة المحاولة
          </button>
        )}
      </div>
    </div>
  );
}
