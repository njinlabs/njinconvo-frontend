import { useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";
import show from "../../apis/group/show";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setWeb } from "../../redux/slices/web";
import { useFetcher } from "../../utilities/fetcher";
import NotFound from "../../components/NotFound";

export default function Group() {
  const dispatch = useAppDispatch();
  const { groupId } = useParams();
  const { data: user } = useAppSelector((value) => value.user);

  const groupShowFetcher = useFetcher({
    api: show,
  });

  useEffect(() => {
    dispatch(
      setWeb({
        active: user?.role === "administrator" ? "group" : "dashboard",
      })
    );
  }, []);

  useEffect(() => {
    groupShowFetcher.process({ id: groupId! });
  }, [groupId]);

  if (!groupShowFetcher.data) return <NotFound />;

  return (
    <Outlet
      context={{
        group: groupShowFetcher.data,
        refetchGroup: () =>
          groupShowFetcher.withoutReset().process({ id: groupId! }),
      }}
    />
  );
}
