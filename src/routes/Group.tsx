import { RouteObject } from "react-router-dom";
import Group from "../pages/group";
import Detail from "../pages/group/Detail";
import meetingRoute from "./Meeting";

const groupRoute: RouteObject = {
  path: "group",
  element: <Group />,
  children: [
    {
      path: ":groupId",
      element: <Group />,
      children: [
        {
          path: "",
          element: <Detail />,
        },
        meetingRoute,
      ],
    },
  ],
};

export default groupRoute;
