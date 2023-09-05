import { RouteObject } from "react-router-dom";
import Meeting from "../pages/classroom/Meeting";

const meetingRoute: RouteObject = {
  path: ":classroomId/meeting",
  children: [
    {
      path: "",
      index: true,
      element: <Meeting />,
    },
    {
      path: ":id",
      element: <Meeting autoEdit={false} />,
    },
  ],
};

export default meetingRoute;
