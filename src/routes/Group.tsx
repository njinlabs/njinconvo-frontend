import { RouteObject } from "react-router-dom";
import Group from "../pages/group";
import Detail from "../pages/group/Detail";
import meetingRoute from "./Meeting";
import List from "../pages/group/List";
import Private from "../pages/Private";

const groupRoute: RouteObject = {
  path: "group",
  children: [
    {
      path: "",
      element: (
        <Private privateFor={["administrator"]}>
          <List />
        </Private>
      ),
      index: true,
    },
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
