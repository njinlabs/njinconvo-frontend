import { RiFileListLine } from "react-icons/ri";
import getLang from "../languages";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      <RiFileListLine size={64} />
      <span className="text-center">{getLang().noDataYet}</span>
    </div>
  );
}
