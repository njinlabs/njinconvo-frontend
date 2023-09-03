import { useRouteError } from "react-router-dom";

export default function Error() {
  const error = useRouteError() as { status: number };
  return (
    <div className="w-full h-screen bg-gray flex flex-col justify-center items-center">
      <div className="text-center text-6xl text-primary-500 font-bold font-montserrat">
        {error.status}
      </div>
    </div>
  );
}
