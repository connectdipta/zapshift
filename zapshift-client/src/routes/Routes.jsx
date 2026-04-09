import { createBrowserRouter, Navigate } from "react-router";
import RootLayout from "../layout/RootLayout";
import DashboardLayout from "../layout/DashboardLayout";
import Home from "../pages/Home/Home";
import Coverage from "../pages/Home/Coverage";
import Pricing from "../pages/Home/Pricing";
import AuthLayout from "../layout/AuthLayout";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import RiderRoute from "./RiderRoute";
import DashboardHomeRedirect from "./DashboardHomeRedirect";
import Rider from "../pages/Home/Rider";
import AboutUs from "../pages/Home/AboutUs";
import SendParcel from "../pages/Home/SendParcel";
import UserSendParcel from "../pages/dashboard/user/UserSendParcel";
import ErrorPage from "../pages/Home/ErrorPage";
import AdminDashboardOverview from "../pages/dashboard/admin/AdminDashboardOverview";
import AdminShipping from "../pages/dashboard/admin/AdminShipping";
import AdminManageParcel from "../pages/dashboard/admin/AdminManageParcel";
import AdminUsers from "../pages/dashboard/admin/AdminUsers";
import AdminRiders from "../pages/dashboard/admin/AdminRiders";
import AdminDeliveryManagement from "../pages/dashboard/admin/AdminDeliveryManagement";
import AdminPayments from "../pages/dashboard/admin/AdminPayments";
import UserDashboardHome from "../pages/dashboard/user/UserDashboardHome";
import UserParcels from "../pages/dashboard/user/UserParcels";
import UserParcelView from "../pages/dashboard/user/UserParcelView";
import UserTrackParcel from "../pages/dashboard/user/UserTrackParcel";
import UserPayParcel from "../pages/dashboard/user/UserPayParcel";
import UserInvoices from "../pages/dashboard/user/UserInvoices";
import UserSettings from "../pages/dashboard/user/UserSettings";
import PricingPlan from "../pages/dashboard/PricingPlan";
import CoverageArea from "../pages/dashboard/CoverageArea";
import RiderDashboard from "../pages/dashboard/rider/RiderDashboard";
import RiderDeliveries from "../pages/dashboard/rider/RiderDeliveries";
import RiderPickups from "../pages/dashboard/rider/RiderPickups";
import RiderHistory from "../pages/dashboard/rider/RiderHistory";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    errorElement: <ErrorPage />,
    children: [
        {
            index: true, Component:Home
        },
        {
            path: "pricing", element: <Pricing />
        },
        {
          path: "rider", element:<Rider></Rider>
        },
        {
          path: "coverage", element: <Coverage></Coverage>,
            loader: () => fetch('/serviceCenters.json').then(res => res.json())
        },
        {
            path: "about-us", element: <AboutUs></AboutUs>,
        },
        {
          path: "send-parcel", element: <SendParcel></SendParcel>,
        },
        {
          path: "pay/:id",
          element: <PrivateRoute><UserPayParcel /></PrivateRoute>,
        },
        {
            path: "*",
            element: <ErrorPage />
        }
    ]
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "signin",
        element: <Navigate to="/login" replace />,
      },
      {
        path: "signup",
        element: <Navigate to="/register" replace />,
      },
    ],
  },

{
  path: "/dashboard",
  element: (
    <PrivateRoute>
      <DashboardLayout />
    </PrivateRoute>
  ),
  children: [
    {
      index: true,
      element: <DashboardHomeRedirect />,
    },
    {
      path: "admin",
      element: <AdminRoute><AdminDashboardOverview /></AdminRoute>,
    },
    {
      path: "parcels",
      element: <AdminRoute><AdminShipping /></AdminRoute>,
    },
    {
      path: "parcels/:id",
      element: <UserParcelView />,
    },
    {
      path: "manage/:id",
      element: <AdminRoute><AdminManageParcel /></AdminRoute>,
    },
    {
      path: "users",
      element: <AdminRoute><AdminUsers /></AdminRoute>,
    },
    {
      path: "riders",
      element: <AdminRoute><AdminRiders /></AdminRoute>,
    },
    {
      path: "delivery",
      element: <AdminRoute><AdminDeliveryManagement /></AdminRoute>,
    },
    {
      path: "payments",
      element: <AdminRoute><AdminPayments /></AdminRoute>,
    },
    {
      path: "user",
      element: <UserDashboardHome />,
    },
    {
      path: "user/parcels",
      element: <UserParcels />,
    },
    {
      path: "user/parcels/:id",
      element: <UserParcelView />,
    },
    {
      path: "user/send-parcel",
      element: <UserSendParcel />,
    },
    {
      path: "user/pay/:id",
      element: <UserPayParcel />,
    },
    {
      path: "user/track",
      element: <UserTrackParcel />,
    },
    {
      path: "user/invoices",
      element: <UserInvoices />,
    },
    {
      path: "rider",
      element: <RiderRoute><RiderDashboard /></RiderRoute>,
    },
    {
      path: "rider/deliveries",
      element: <RiderRoute><RiderDeliveries /></RiderRoute>,
    },
    {
      path: "rider/pickups",
      element: <RiderRoute><RiderPickups /></RiderRoute>,
    },
    {
      path: "rider/history",
      element: <RiderRoute><RiderHistory /></RiderRoute>,
    },
    {
      path: "send-parcel",
      element: <UserSendParcel />,
    },
    {
      path: "pay/:id",
      element: <UserPayParcel />,
    },
    {
      path: "track",
      element: <UserTrackParcel />,
    },
    {
      path: "invoices",
      element: <UserInvoices />,
    },
    {
      path: "settings",
      element: <UserSettings />,
    },
    {
      path: "pricing-plan",
      element: <PricingPlan />,
    },
    {
      path: "coverage-area",
      element: <CoverageArea />,
    },
  ],
}
]);