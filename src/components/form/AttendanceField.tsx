import getLang from "../../languages";

export default function AttendanceField({
  name,
  status,
  onChange = () => {},
}: {
  name: string;
  status?: string;
  onChange?: (status: string) => void;
}) {
  return (
    <div className="p-5 flex flex-col lg:flex-row justify-start items-start lg:items-center space-y-2 lg:space-y-0">
      <div className="font-bold text-gray-700 flex-1">{name}</div>
      <div className="flex justify-start items-center space-x-3">
        <button
          type="button"
          className={`h-10 px-2 ${
            status === "present" ? "bg-primary-600 text-white" : ""
          } text-xs rounded border uppercase`}
          onClick={() => onChange("present")}
        >
          {getLang().present}
        </button>
        <button
          type="button"
          className={`h-10 px-2 ${
            status === "sick" ? "bg-primary-600 text-white" : ""
          } text-xs rounded border uppercase`}
          onClick={() => onChange("sick")}
        >
          {getLang().sick}
        </button>
        <button
          type="button"
          className={`h-10 px-2 ${
            status === "permission" ? "bg-primary-600 text-white" : ""
          } text-xs rounded border uppercase`}
          onClick={() => onChange("permission")}
        >
          {getLang().permission}
        </button>
        <button
          type="button"
          className={`h-10 px-2 ${
            status === "absent" ? "bg-primary-600 text-white" : ""
          } text-xs rounded border uppercase`}
          onClick={() => onChange("absent")}
        >
          {getLang().absent}
        </button>
      </div>
    </div>
  );
}
