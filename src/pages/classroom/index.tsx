import { useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";
import show from "../../apis/classroom/show";
import { useAppDispatch } from "../../redux/hooks";
import { setWeb } from "../../redux/slices/web";
import { useFetcher } from "../../utilities/fetcher";

export default function Classroom() {
  const dispatch = useAppDispatch();
  const { classroomId } = useParams();

  const classroomShowFetcher = useFetcher({
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
    classroomShowFetcher.process({ id: classroomId! });
  }, [classroomId]);

  if (!classroomShowFetcher.data) return null;

  return <Outlet context={{ classroom: classroomShowFetcher.data }} />;
}
