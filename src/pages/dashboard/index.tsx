import { useEffect } from "react";
import getLang from "../../languages";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setWeb } from "../../redux/slices/web";
import TeacherDashboard from "./TeacherDashboard";

export default function Dashboard() {
  const { data: user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      setWeb({
        active: "dashboard",
        pageTitle: getLang().dashboard,
      })
    );
  }, []);

  if (user?.role === "teacher") return <TeacherDashboard />;
  return null;
}
