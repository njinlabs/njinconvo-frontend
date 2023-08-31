import { RouteObject, redirect } from "react-router-dom";
import Login from "../pages/auth/Login";
import Auth from "../pages/auth";

const authRoute: RouteObject = {
  path: "/auth",
  element: <Auth />,
  children: [
    {
      path: "",
      index: true,
      loader: () => {
        return redirect("/auth/login");
      },
    },
    {
      path: "login",
      element: <Login />,
    },
  ],
};

export default authRoute;
