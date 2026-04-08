import { createBrowserRouter } from "react-router";
import RootLayout from "../layout/RootLayout";
import Home from "../pages/Home";
import Coverage from "../pages/Coverage";
import Services from "../pages/Services";
import Pricing from "../pages/Pricing";
import AuthLayout from "../layout/AuthLayout";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import PrivateRoute from "./PrivateRoute";
import Rider from "../pages/Rider";
import AboutUs from "../pages/AboutUs";
import SendParcel from "../pages/SendParcel";
import ErrorPage from "../pages/ErrorPage";

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
            path: "services", element: <Services />
        },
        {
            path: "pricing", element: <Pricing />
        },
        {
            path: "rider", element:<PrivateRoute><Rider></Rider></PrivateRoute>
        },
        {
            path: "coverage", element: <PrivateRoute><Coverage></Coverage></PrivateRoute>,
            loader: () => fetch('/serviceCenters.json').then(res => res.json())
        },
        {
            path: "about-us", element: <AboutUs></AboutUs>,
        },
        {
            path: "send-parcel", element: <PrivateRoute><SendParcel></SendParcel></PrivateRoute>,
        },
        {
            path: "*",
            element: <ErrorPage />
        }
    ]
  },
  {
    path: "/",
    Component: AuthLayout,
    errorElement: <ErrorPage />,
    children: [
      {
       path: "login", Component: Login
      },
      {
        path: "register", Component: Register
      }
    ]
  },
]);