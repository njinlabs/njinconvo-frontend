import { createBrowserRouter } from "react-router-dom";
import Layout from "../pages";
import authRoutes from "./Auth";
import userRoute from "./User";

const router = createBrowserRouter([
  authRoutes,
  {
    path: "/",
    element: <Layout />,
    children: [userRoute],
  },
]);

export default router;
