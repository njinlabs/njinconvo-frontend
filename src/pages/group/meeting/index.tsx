import { Outlet, useOutletContext, useParams } from "react-router-dom";
import { useFetcher } from "../../../utilities/fetcher";
import show from "../../../apis/group/meeting/show";
import { useEffect } from "react";

export default function Meeting() {
  const { meetingId } = useParams();
  const { group } = useOutletContext<{ group: any }>();

  const showFetcher = useFetcher({
    api: show,
  });

  useEffect(() => {
    showFetcher.process({ id: meetingId!, groupId: group.id });
  }, [meetingId]);

  if (!showFetcher.data) return null;

  return (
    <Outlet
      context={{
        group,
        meeting: showFetcher.data,
        refetchMeeting: () =>
          showFetcher.process({ id: meetingId!, groupId: group.id }),
      }}
    />
  );
}
