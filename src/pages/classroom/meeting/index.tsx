import { Outlet, useOutletContext, useParams } from "react-router-dom";
import { useFetcher } from "../../../utilities/fetcher";
import show from "../../../apis/classroom/meeting/show";
import { useEffect } from "react";

export default function Meeting() {
  const { meetingId } = useParams();
  const { classroom } = useOutletContext<{ classroom: any }>();

  const showFetcher = useFetcher({
    api: show,
  });

  useEffect(() => {
    showFetcher.process({ id: meetingId!, classroomId: classroom.id });
  }, [meetingId]);

  if (!showFetcher.data) return null;

  return (
    <Outlet
      context={{
        classroom,
        meeting: showFetcher.data,
        refetchMeeting: () =>
          showFetcher.process({ id: meetingId!, classroomId: classroom.id }),
      }}
    />
  );
}
