import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./../App.tsx";

const Dashboard = lazy(() => import("./../pages/dashboard/Dashboard.tsx"));
const Roles = lazy(() => import("./../pages/roles/Roles.tsx"));

const LazyLoad = ({ children }: { children: React.ReactNode }) => (
  <Suspense
    fallback={
      <div className="flex items-center justify-center h-full">
      <div className="w-8 h-8 border-4 border-[#7b5bf2]/30 border-t-[#7b5bf2] rounded-full animate-spin" />
      </div>
    }
  >
    {children}
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: (
          <LazyLoad>
            <Dashboard />
          </LazyLoad>
        ),
      },
      {
        path: "roles",
        element: (
          <LazyLoad>
            <Roles />
          </LazyLoad>
        ),
      },
    ],
  },
]);