import { Navigate, Outlet, useRoutes } from "react-router-dom";
import { useContext, lazy, Suspense } from "react";

import { AppContext } from "./contexts/app.context";
import path from "./constants/path";

import MainLayout from "./layouts/MainLayout";
import SideBarLayout from "./layouts/SideBarLayout";

const Login = lazy(() => import("./pages/Login"));
const Home = lazy(() => import("./pages/Home"));
const OrderManagement = lazy(() => import("./pages/OrderManagement"));
const ProductManagement = lazy(() => import("./pages/ProductManagement"));
const DiscountManagement = lazy(() => import("./pages/DiscountManagement"));
const MonthlyReport = lazy(() => import("./pages/MonthlyReport"));
const ProductReport = lazy(() => import("./pages/ProductReport"));
const NotFound = lazy(() => import("./pages/NotFound"));

function ProtectedRoute() {
  const { isAuthenticated } = useContext(AppContext);
  return isAuthenticated ? <Outlet /> : <Navigate to={path.login} />;
}

function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext);
  return !isAuthenticated ? <Outlet /> : <Navigate to={path.home} />;
}

export default function useRouteElements() {
  const routeElements = useRoutes([
    {
      path: "",
      element: <SideBarLayout />,
      children: [ 
        {
          path: "*",
          element: (
            <Suspense>
              <NotFound />
            </Suspense>
          ),
        },
      ],
    },
    {
      path: "",
      element: <ProtectedRoute />,
      children: [
        {
          path: "",
          element: <SideBarLayout />,
          children: [
            {
              index: true,
              path: path.home,
              element: (
                <Suspense>
                  <Home/>
                </Suspense>
              ),
            },
            {
              index: true,
              path: path.orderManagement,
              element: (
                <Suspense>
                  <OrderManagement/>
                </Suspense>
              ),
            },
            {
              index: true,
              path: path.productManagement,
              element: (
                <Suspense>
                  <ProductManagement/>
                </Suspense>
              ),
            },
            {
              index: true,
              path: path.discountManagement,
              element: (
                <Suspense>
                  <DiscountManagement/>
                </Suspense>
              ),
            },
            {
              index: true,
              path: path.monthlyReport,
              element: (
                <Suspense>
                  <MonthlyReport/>
                </Suspense>
              ),
            },
            {
              index: true,
              path: path.productReport,
              element: (
                <Suspense>
                  <ProductReport/>
                </Suspense>
              ),
            },
          ],
        },
      ],
    },
    {
      path: "",
      element: <RejectedRoute />,
      children: [
        {
          path: "",
          element: <MainLayout />,
          children: [
            {
              index: true,
              path: path.login,
              element: (
                <Suspense>
                  <Login />
                </Suspense>
              ),
            },
          ],
        },
      ],
    },
  ]);
  return routeElements;
}
