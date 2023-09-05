import { RouteObject } from "react-router-dom";
import Compose from "../pages/classroom/meeting/Compose";

const meetingRoute: RouteObject = {
  path: ":classroomId/meeting",
  children: [
    {
      path: "",
      index: true,
      element: <Compose />,
    },
  ],
};

export default meetingRoute;
