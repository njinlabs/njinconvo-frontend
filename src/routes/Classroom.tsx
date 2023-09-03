import { RouteObject } from "react-router-dom";
import Classroom from "../pages/classroom";
import Detail from "../pages/classroom/Detail";

const classroomRoute: RouteObject = {
  path: "classroom",
  element: <Classroom />,
  children: [
    {
      path: ":id",
      element: <Detail />,
    },
  ],
};

export default classroomRoute;
