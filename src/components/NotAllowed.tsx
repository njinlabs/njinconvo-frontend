import { RiErrorWarningLine } from "react-icons/ri";
import getLang from "../languages";

export default function NotAllowed() {
  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      <RiErrorWarningLine className="text-6xl text-primary-500" />
      {getLang().notAllowed}
    </div>
  );
}
