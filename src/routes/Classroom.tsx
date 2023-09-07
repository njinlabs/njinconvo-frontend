import { RouteObject } from "react-router-dom";
import Classroom from "../pages/classroom";
import Detail from "../pages/classroom/Detail";
import Private from "../pages/Private";
import meetingRoute from "./Meeting";

const classroomRoute: RouteObject = {
  path: "classroom",
  element: <Classroom />,
  children: [
    {
      path: ":classroomId",
      element: <Classroom />,
      children: [
        {
          path: "",
          element: (
            <Private privateFor={["teacher", "student"]}>
              <Detail />
            </Private>
          ),
        },
        meetingRoute,
      ],
    },
  ],
};

export default classroomRoute;
