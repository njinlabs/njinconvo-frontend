import { createBrowserRouter } from "react-router-dom";
import Layout from "../pages";
import authRoutes from "./Auth";
import userRoute from "./User";
import Error from "../pages/Error";
import Dashboard from "../pages/dashboard";
import groupRoute from "./Group";

const router = createBrowserRouter([
  authRoutes,
  {
    path: "/",
    element: <Layout />,
    errorElement: <Error />,
    children: [
      {
        path: "",
        element: <Dashboard />,
        index: true,
      },
      userRoute,
      groupRoute,
    ],
  },
]);

export default router;
