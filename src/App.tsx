import type { JSX } from "react";
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
import LoginPage from "@/pages/LoginPage";
import HomePage from "@/pages/HomePage";
import DashboardPage from "@/pages/DashboardPage";
import DistributorsPage from "@/pages/DistributorsPage";
import MedicinesPage from "@/pages/MedicinesPage";
import MedicineClassificationPage from "@/pages/MedicineClassificationPage";
import BusinessParametersPage from "@/pages/BusinessParametersPage";
import SystemParametersPage from "@/pages/SystemParametersPage";
import RolesPage from "@/pages/RolesPage";
import UsersPage from "@/pages/UsersPage";
import PharmaciesPage from "@/pages/PharmaciesPage";
import PurchaseOrdersPage from "@/pages/PurchaseOrdersPage";
import InvoicesPage from "@/pages/InvoicesPage";
import StockPage from "@/pages/StockPage";
import CustomersPage from "@/pages/CustomersPage";
import StockDisposalsPage from "@/pages/StockDisposalsPage";
import StockReturnsPage from "@/pages/StockReturnsPage";
import StockMovementsPage from "@/pages/StockMovementsPage";
import PosPage from "@/pages/PosPage";
import SalesPage from "@/pages/SalesPage";
import ProfileSettingsPage from "@/pages/ProfileSettingsPage";
import ReportsPage from "@/pages/ReportsPage";
import StoragePage from "@/pages/StoragePage";
import InventoryPage from "@/pages/InventoryPage";
import ComingSoonPage from "@/pages/ComingSoonPage";

function AppRoutes(): JSX.Element {
  const { isBootstrapping } = useBootstrapAuth();
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
            <Route path="/users" element={<UsersPage />} />
            <Route path="/roles" element={<RolesPage />} />
          </Route>
        </Route>

        {/* Global admin routes — platform users only, no pharmacy required */}
        <Route element={<AuthGuard />}>
          <Route element={<DashboardLayout />}>
            <Route path="/pharmacies" element={<PharmaciesPage />} />
            <Route path="/system-parameters" element={<SystemParametersPage />} />
          </Route>
        </Route>

        {/* Pharmacy routes — auth + pharmacy selection required */}
        <Route element={<ProtectedGuard />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/business-parameters" element={<BusinessParametersPage />} />
            <Route path="/pos" element={<PosPage />} />
            <Route path="/sales" element={<SalesPage />} />
            <Route path="/stock" element={<StockPage />} />
            <Route path="/stock-disposals" element={<StockDisposalsPage />} />
            <Route path="/stock-returns" element={<StockReturnsPage />} />
            <Route path="/stock-movements" element={<StockMovementsPage />} />
            <Route path="/storage" element={<StoragePage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/medicines" element={<MedicinesPage />} />
            <Route path="/medicine-classification" element={<MedicineClassificationPage />} />
            <Route path="/prescriptions" element={<ComingSoonPage titleKey="navPrescriptions" />} />
            <Route path="/purchase-orders" element={<PurchaseOrdersPage />} />
            <Route path="/invoices" element={<InvoicesPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/distributors" element={<DistributorsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<ComingSoonPage titleKey="navSettings" />} />
            <Route path="/profile" element={<ProfileSettingsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
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
