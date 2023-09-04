import { RouteObject } from "react-router-dom";
import Classroom from "../pages/classroom";
import Detail from "../pages/classroom/Detail";
import Private from "../pages/Private";

const classroomRoute: RouteObject = {
  path: "classroom",
  element: <Classroom />,
  children: [
    {
      path: ":id",
      element: (
        <Private privateFor={["teacher", "student"]}>
          <Detail />
        </Private>
      ),
    },
  ],
};

export default classroomRoute;
