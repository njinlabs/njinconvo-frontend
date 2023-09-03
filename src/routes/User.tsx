import { RouteObject } from "react-router-dom";
import User from "../pages/user";
import Private from "../pages/Private";

const userRoute: RouteObject = {
  path: "user",
  element: (
    <Private privateFor={["administrator"]}>
      <User />
    </Private>
  ),
};

export default userRoute;
