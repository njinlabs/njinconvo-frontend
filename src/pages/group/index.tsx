import { useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";
import show from "../../apis/group/show";
import { useAppDispatch } from "../../redux/hooks";
import { setWeb } from "../../redux/slices/web";
import { useFetcher } from "../../utilities/fetcher";

export default function Group() {
  const dispatch = useAppDispatch();
  const { groupId } = useParams();

  const groupShowFetcher = useFetcher({
    api: show,
  });

  useEffect(() => {
    dispatch(
      setWeb({
        active: "dashboard",
      })
    );
  }, []);

  useEffect(() => {
    groupShowFetcher.process({ id: groupId! });
  }, [groupId]);

  if (!groupShowFetcher.data) return null;

  return <Outlet context={{ group: groupShowFetcher.data }} />;
}
