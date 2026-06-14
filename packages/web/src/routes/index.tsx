import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { AppLayout } from "../layouts/AppLayout";
import { AuthLayout } from "../layouts/AuthLayout";
import { LoadingSpinner } from "../components/shared/LoadingSpinner";

const Login = lazy(() =>
  import("../pages/auth/Login").then((m) => ({ default: m.Login })),
);
const Register = lazy(() =>
  import("../pages/auth/Register").then((m) => ({ default: m.Register })),
);
const Dashboard = lazy(() =>
  import("../pages/dashboard/Dashboard").then((m) => ({
    default: m.Dashboard,
  })),
);
const Settings = lazy(() =>
  import("../pages/dashboard/Settings").then((m) => ({ default: m.Settings })),
);
const CacheDemo = lazy(() =>
  import("../pages/dashboard/CacheDemo").then((m) => ({
    default: m.CacheDemo,
  })),
);
const NotFound = lazy(() =>
  import("../pages/NotFound").then((m) => ({ default: m.NotFound })),
);

export function AppRoutes() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <Routes>
        {/* Public auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected app routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/cache-demo" element={<CacheDemo />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
