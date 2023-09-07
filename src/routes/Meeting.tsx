import { RouteObject } from "react-router-dom";
import Compose from "../pages/classroom/meeting/Compose";
import Attendance from "../pages/classroom/meeting/Attendance";
import Meeting from "../pages/classroom/meeting";

const meetingRoute: RouteObject = {
  path: "meeting",
  children: [
    {
      path: "",
      index: true,
      element: <Compose />,
    },
    {
      path: ":meetingId",
      element: <Meeting />,
      children: [
        {
          path: "",
          index: true,
          element: <Compose autoEdit={false} />,
        },
        {
          path: "attendance",
          element: <Attendance />,
        },
      ],
    },
  ],
};

export default meetingRoute;
