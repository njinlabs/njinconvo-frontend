import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

export default function Auth() {
  const [cookies] = useCookies(["token"]);
  const { state } = useLocation();
  const [mount, setMount] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (cookies.token) {
      navigate(state?.next || "/", {
        replace: true,
      });
    }

    setMount(true);
  }, [cookies]);

  if (!mount) return null;

  return <Outlet />;
}
