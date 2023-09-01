import { RouteObject } from "react-router-dom";
import User from "../pages/user";

const userRoute: RouteObject = {
  path: "user",
  element: <User />,
};

export default userRoute;
