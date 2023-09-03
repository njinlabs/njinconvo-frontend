import { useAppSelector } from "../redux/hooks";
import { ReactNode, Fragment } from "react";
import { RiErrorWarningLine } from "react-icons/ri";
import getLang from "../languages";
import { Helmet } from "react-helmet-async";

export default function Private({
  privateFor,
  children,
}: {
  privateFor: string[];
  children: ReactNode;
}) {
  const { data: user } = useAppSelector((state) => state.user);

  if (privateFor.includes(user?.role || "")) return children;

  return (
    <Fragment>
      <Helmet>
        <title>{getLang().notAllowed}</title>
      </Helmet>
      <div className="flex-1 flex flex-col justify-center items-center">
        <RiErrorWarningLine className="text-6xl text-primary-500" />
        {getLang().notAllowed}
      </div>
    </Fragment>
  );
}
