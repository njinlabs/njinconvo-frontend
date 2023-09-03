import { Fragment, ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import getLang from "../languages";
import { useAppSelector } from "../redux/hooks";
import NotAllowed from "../components/NotAllowed";

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
      <NotAllowed />
    </Fragment>
  );
}
