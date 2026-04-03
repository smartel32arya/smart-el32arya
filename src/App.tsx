import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ScrollToTop from "./components/ScrollToTop.tsx";
import Index from "./pages/Index.tsx";
import Properties from "./pages/Properties.tsx";
import PropertyDetails from "./pages/PropertyDetails.tsx";
import NotFound from "./pages/NotFound.tsx";
import Contact from "./pages/Contact.tsx";
import Login from "./pages/admin/Login.tsx";
import Dashboard from "./pages/admin/Dashboard.tsx";
import AddProperty from "./pages/admin/AddProperty.tsx";
import AdminProperties from "./pages/admin/AdminProperties.tsx";
import EditProperty from "./pages/admin/EditProperty.tsx";
import AdminUsers from "./pages/admin/AdminUsers.tsx";
import Profile from "./pages/admin/Profile.tsx";
import AddPropertyContact from "./pages/AddPropertyContact.tsx";

const queryClient = new QueryClient();

const SuperAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const user = (() => { try { return JSON.parse(localStorage.getItem("adminUser") ?? "{}"); } catch { return {}; } })();
  return user?.role === "super_admin" ? <>{children}</> : <Navigate to="/admin" replace />;
};

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("adminToken");
  return token ? <>{children}</> : <Navigate to="/admin/login" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ScrollToTop />
          <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<AddPropertyContact />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/admin/properties" element={<PrivateRoute><AdminProperties /></PrivateRoute>} />
          <Route path="/admin/add-property" element={<PrivateRoute><AddProperty /></PrivateRoute>} />
          <Route path="/admin/edit-property/:id" element={<PrivateRoute><EditProperty /></PrivateRoute>} />
          <Route path="/admin/users" element={<PrivateRoute><SuperAdminRoute><AdminUsers /></SuperAdminRoute></PrivateRoute>} />
          <Route path="/admin/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
