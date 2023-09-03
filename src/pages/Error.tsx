import { useRouteError } from "react-router-dom";
import { Fragment } from "react";
import { Helmet } from "react-helmet-async";
import getLang from "../languages";

export default function Error() {
  const error = useRouteError() as { status: number };
  return (
    <Fragment>
      <Helmet>
        <title>{getLang().sorry}</title>
      </Helmet>
      <div className="w-full h-screen bg-gray flex flex-col justify-center items-center">
        <div className="text-center text-6xl text-primary-500 font-bold font-montserrat">
          {error.status}
        </div>
      </div>
    </Fragment>
  );
}
