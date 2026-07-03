import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@/lib/react-query';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AuthLayout } from '@/layouts/AuthLayout';
import { RootLayout } from '@/layouts/RootLayout';
import { LoginPage } from '@/features/auth/routes/LoginPage';
import { RegisterPage } from '@/features/auth/routes/RegisterPage';
import { POSPage } from '@/features/pos/routes/POSPage';
import { KitchenDashboard } from '@/features/kitchen/routes/KitchenDashboard';
import { AdminDashboard } from '@/features/admin/routes/AdminDashboard';
import { FloorPlanPage } from '@/features/tables/routes/FloorPlanPage';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
          <Route element={<ProtectedRoute><RootLayout /></ProtectedRoute>}>
            <Route path="/" element={<Navigate to="/pos" replace />} />
            <Route path="/pos" element={<POSPage />} />
            <Route path="/kitchen" element={<KitchenDashboard />} />
            <Route path="/tables" element={<FloorPlanPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
