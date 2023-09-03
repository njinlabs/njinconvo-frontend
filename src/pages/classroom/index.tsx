import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setWeb } from "../../redux/slices/web";

export default function Classroom() {
  const dispatch = useAppDispatch();
  const { data: user } = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(
      setWeb({
        active: user?.role === "administrator" ? "classroom" : "dashboard",
      })
    );
  }, []);

  return <Outlet />;
}
