import { RouteObject } from "react-router-dom";
import Login from "../pages/auth/Login";

const authRoute: RouteObject = {
  path: "/auth",
  children: [
    {
      path: "login",
      element: <Login />,
    },
  ],
};

export default authRoute;
