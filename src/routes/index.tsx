import { createBrowserRouter } from "react-router-dom";
import Layout from "../pages";
import authRoutes from "./Auth";
import userRoute from "./User";
import Error from "../pages/Error";

const router = createBrowserRouter([
  authRoutes,
  {
    path: "/",
    element: <Layout />,
    errorElement: <Error />,
    children: [userRoute],
  },
]);

export default router;
