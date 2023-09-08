import { RouteObject } from "react-router-dom";
import Compose from "../pages/group/meeting/Compose";
import Attendance from "../pages/group/meeting/Attendance";
import Meeting from "../pages/group/meeting";

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
