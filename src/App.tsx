import type { JSX } from "react";
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";

import { ThemeProvider } from "@/configs/ThemeContext";
import { LanguageProvider } from "@/configs/LanguageContext";
import { useTheme } from "@/hooks/useTheme";
import { GuestGuard } from "@/components/shared/GuestGuard";
import { HomeGuard } from "@/components/shared/HomeGuard";
import { AuthGuard } from "@/components/shared/AuthGuard";
import { ProtectedGuard } from "@/components/shared/ProtectedGuard";
import { SharedAccessGuard } from "@/components/shared/SharedAccessGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useBootstrapAuth } from "@/hooks/useBootstrapAuth";
import { useApplyNameCase } from "@/hooks/useNameFormat";
import LoginPage from "@/pages/LoginPage";
import HomePage from "@/pages/HomePage";
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const DistributorsPage = lazy(() => import("@/pages/DistributorsPage"));
const MedicinesPage = lazy(() => import("@/pages/MedicinesPage"));
const MedicineClassificationPage = lazy(() => import("@/pages/MedicineClassificationPage"));
const BusinessParametersPage = lazy(() => import("@/pages/BusinessParametersPage"));
const SystemParametersPage = lazy(() => import("@/pages/SystemParametersPage"));
const BackgroundJobsPage = lazy(() => import("@/pages/BackgroundJobsPage"));
const PharmacyProfilePage = lazy(() => import("@/pages/PharmacyProfilePage"));
const RolesPage = lazy(() => import("@/pages/RolesPage"));
const UsersPage = lazy(() => import("@/pages/UsersPage"));
const PharmaciesPage = lazy(() => import("@/pages/PharmaciesPage"));
const PurchaseOrdersPage = lazy(() => import("@/pages/PurchaseOrdersPage"));
const InvoicesPage = lazy(() => import("@/pages/InvoicesPage"));
const StockPage = lazy(() => import("@/pages/StockPage"));
const CustomersPage = lazy(() => import("@/pages/CustomersPage"));
const StockDisposalsPage = lazy(() => import("@/pages/StockDisposalsPage"));
const StockReturnsPage = lazy(() => import("@/pages/StockReturnsPage"));
const StockMovementsPage = lazy(() => import("@/pages/StockMovementsPage"));
const PosPage = lazy(() => import("@/pages/PosPage"));
const SalesPage = lazy(() => import("@/pages/SalesPage"));
const ShiftsPage = lazy(() => import("@/pages/ShiftsPage"));
const AuditLogsPage = lazy(() => import("@/pages/AuditLogsPage"));
const ProfileSettingsPage = lazy(() => import("@/pages/ProfileSettingsPage"));
const ReportsPage = lazy(() => import("@/pages/ReportsPage"));
const StoragePage = lazy(() => import("@/pages/StoragePage"));
const InventoryPage = lazy(() => import("@/pages/InventoryPage"));
const DoctorsPage = lazy(() => import("@/pages/DoctorsPage"));
const PrescriptionsPage = lazy(() => import("@/pages/PrescriptionsPage"));
const MedicalRecordsPage = lazy(() => import("@/pages/MedicalRecordsPage"));
const ExaminationsPage = lazy(() => import("@/pages/ExaminationsPage"));
import StatusPage from "@/pages/StatusPage";
import { PermissionGate } from "@/components/shared/PermissionGate";

function AppRoutes(): JSX.Element {
  const { isBootstrapping } = useBootstrapAuth();
  useApplyNameCase();
  const { theme } = useTheme();

  if (isBootstrapping) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Toaster richColors theme={theme} position="bottom-right" closeButton />
      <BrowserRouter>
      <Suspense fallback={null}>
      <Routes>
        <Route element={<GuestGuard />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route element={<HomeGuard />}>
          <Route path="/" element={<HomePage />} />
        </Route>

        {/* Shared routes — platform users OR pharmacy-selected staff (e.g. OWNER) */}
        <Route element={<SharedAccessGuard />}>
          <Route element={<DashboardLayout />}>
            <Route element={<PermissionGate perm="users.read" />}>
              <Route path="/users" element={<UsersPage />} />
            </Route>
            <Route element={<PermissionGate perm="roles.read" />}>
              <Route path="/roles" element={<RolesPage />} />
            </Route>
          </Route>
        </Route>

        {/* Global admin routes — platform users only, no pharmacy required */}
        <Route element={<AuthGuard />}>
          <Route element={<DashboardLayout />}>
            <Route path="/pharmacies" element={<PharmaciesPage />} />
            <Route path="/system-parameters" element={<SystemParametersPage />} />
            <Route path="/background-jobs" element={<BackgroundJobsPage />} />
          </Route>
        </Route>

        {/* Pharmacy routes — auth + pharmacy selection required */}
        <Route element={<ProtectedGuard />}>
          <Route element={<DashboardLayout />}>
            <Route path="/profile" element={<ProfileSettingsPage />} />
            {/* Each page requires the permission registered for its path in configs/navigation.ts */}
            <Route element={<PermissionGate />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/business-parameters" element={<BusinessParametersPage />} />
            <Route path="/pos" element={<PosPage />} />
            <Route path="/sales" element={<SalesPage />} />
            <Route path="/shifts" element={<ShiftsPage />} />
            <Route path="/audit-logs" element={<AuditLogsPage />} />
            <Route path="/stock" element={<StockPage />} />
            {/* Labels are printed from the stock page now. */}
            <Route path="/stock-labels" element={<Navigate to="/stock" replace />} />
            <Route path="/stock-disposals" element={<StockDisposalsPage />} />
            <Route path="/stock-returns" element={<StockReturnsPage />} />
            <Route path="/stock-movements" element={<StockMovementsPage />} />
            <Route path="/storage" element={<StoragePage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/medicines" element={<MedicinesPage />} />
            <Route path="/medicine-classification" element={<MedicineClassificationPage />} />
            <Route path="/prescriptions" element={<PrescriptionsPage />} />
            <Route path="/doctors" element={<DoctorsPage />} />
            <Route path="/purchase-orders" element={<PurchaseOrdersPage />} />
            <Route path="/invoices" element={<InvoicesPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/examinations" element={<ExaminationsPage />} />
            <Route path="/medical-records" element={<MedicalRecordsPage />} />
            <Route path="/distributors" element={<DistributorsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/pharmacy-profile" element={<PharmacyProfilePage />} />
            </Route>
            <Route path="*" element={<StatusPage kind="not-found" />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      </Suspense>
    </BrowserRouter>
    </>
  );
}

export function App(): JSX.Element {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppRoutes />
      </LanguageProvider>
    </ThemeProvider>
  );
}
