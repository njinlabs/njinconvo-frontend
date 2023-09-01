import { createBrowserRouter } from "react-router-dom";
import authRoute from "./Auth";
import Layout from "../pages";

const router = createBrowserRouter([
  authRoute,
  {
    path: "/",
    element: <Layout />,
  },
]);

export default router;
