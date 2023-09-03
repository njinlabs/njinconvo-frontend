import { RiUser6Fill } from "react-icons/ri";
import { Link } from "react-router-dom";
import MiniButton from "./MiniButton";
import getLang from "../languages";

export default function ClassroomList({
  id,
  name,
  teacher,
  participants,
}: {
  id: number;
  name: string;
  participants: number;
  teacher: {
    fullname: string;
    avatar: string | null;
  };
}) {
  return (
    <div className="border border-gray-300 rounded bg-white hover:shadow-md group overflow-hidden">
      <div className="flex justify-start items-center p-4 lg:p-5 space-x-5 group-hover:bg-gray-100">
        <div className="w-12 h-12 lg:w-16 lg:h-16 flex-shrink-0 rounded-full bg-primary-100 border border-primary-200 flex justify-center items-center overflow-hidden">
          {teacher.avatar ? (
            <img src={teacher.avatar} className="w-full h-full object-cover" />
          ) : (
            <RiUser6Fill className="text-primary-500 text-xl lg:text-4xl" />
          )}
        </div>
        <div className="flex-1">
          <div className="font-bold text-gray-700 font-montserrat">{name}</div>
          <div>{teacher.fullname}</div>
        </div>
      </div>
      <div className="border-t border-gray-300 p-4 lg:p-5 py-4 flex items-center justify-start space-x-3">
        <span className="text-sm flex-1">
          {participants} {getLang().participants}
        </span>
        <MiniButton
          element={Link}
          to={"/classroom/" + id}
          className="text-xs uppercase"
          color="basic"
        >
          {getLang().start}
        </MiniButton>
      </div>
    </div>
  );
}
