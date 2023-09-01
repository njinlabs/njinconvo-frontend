import { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { Outlet, useNavigate } from "react-router-dom";
import { CgChevronDown } from "react-icons/cg";
import { DropdownItem, DropdownMenu } from "../components/dropdown";
import { DropdownMenuRefObject } from "../components/dropdown/DropdownMenu";
import { RiLogoutCircleLine } from "react-icons/ri";
import { useFetcher } from "../utilities/fetcher";
import signOut from "../apis/auth/sign/sign-out";
import getLang from "../languages";
import { toast } from "react-toastify";
import client from "../apis/client";
import checkToken from "../apis/auth/check-token";
import NavbarList from "../components/NavbarList";

export default function Layout() {
  const cookie = useCookies(["token"]);
  const cookies = cookie[0];
  const removeCookies = cookie[2];
  const [mount, setMount] = useState(false);
  const navigate = useNavigate();
  const _dropdown = useRef<DropdownMenuRefObject>();

  const logoutFetcher = useFetcher({
    api: signOut,
    onSuccess: () => {
      removeCookies("token", {
        path: "/",
      });
    },
  });

  const checkTokenFetcher = useFetcher({
    api: checkToken,
    onSuccess: () => {
      setMount(true);
    },
    onFail: (e) => {
      if (e?.response?.status === 401) {
        removeCookies("token", {
          path: "/",
        });

        toast.error(getLang().sessionExpired);
      }
    },
  });

  useEffect(() => {
    if (!cookies.token) {
      navigate("/auth", {
        replace: true,
      });
    } else {
      client.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${cookies.token}`;
      checkTokenFetcher.process({});
    }
  }, [cookies]);

  if (!mount) return null;

  return (
    <div className="w-full min-h-screen bg-gray-200 flex flex-col justify-start px-8 pb-8">
      <div className="h-20 flex justify-between items-center">
        <div className="h-16 w-auto lg:w-72 bg-white rounded flex justify-center items-center">
          Logo
        </div>
        <div className="w-1/2 flex justify-center space-x-1">
          <NavbarList to="/" active>
            {getLang().dashboard}
          </NavbarList>
          <NavbarList to="/">{getLang().classroom}</NavbarList>
          <NavbarList to="/">{getLang().user}</NavbarList>
          <NavbarList to="/">{getLang().setting}</NavbarList>
        </div>
        <div
          onBlur={(e) => _dropdown.current?.onBlur(e)}
          className="relative flex items-center justify-end space-x-3 w-auto lg:w-72 p-3 px-5 rounded"
        >
          <div className="w-12 h-12 rounded-full bg-white" />
          <div className="flex-1">
            <div className="font-bold font-nunito-sans line-clamp-1">
              Akbar Aditama Supriyono Putra
            </div>
            <div className="text-sm">{getLang().administrator}</div>
          </div>
          <div>
            <CgChevronDown />
          </div>
          <button
            type="button"
            className="absolute top-0 left-0 w-full h-full rounded"
            onClick={() => _dropdown.current?.toggle()}
          ></button>
          <DropdownMenu ref={_dropdown}>
            <DropdownItem
              onClick={() =>
                toast.promise(logoutFetcher.process({}), {
                  pending: getLang().waitAMinute,
                  success: getLang().succeed,
                  error: getLang().failed,
                })
              }
              icon={RiLogoutCircleLine}
              element="button"
            >
              {getLang().logout}
            </DropdownItem>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex-1 bg-white rounded border border-gray-400">
        <Outlet />
      </div>
    </div>
  );
}
