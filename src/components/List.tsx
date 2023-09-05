import { ReactNode, useRef } from "react";
import { RiMore2Fill } from "react-icons/ri";
import DropdownMenu, { DropdownMenuRefObject } from "./dropdown/DropdownMenu";

export default function List({
  title,
  subtitle,
  photo,
  options,
}: {
  title: string;
  subtitle: string;
  photo?: string | null | ReactNode;
  options?: ReactNode;
}) {
  const _dropdown = useRef<DropdownMenuRefObject>();

  return (
    <div className="p-3 border border-gray-300 rounded flex justify-start items-start space-x-3">
      {photo && typeof photo === "string" ? (
        <img src={photo} className="w-12 h-12 object-cover rounded-full" />
      ) : photo ? (
        <div className="w-12 h-12 relative flex items-center justify-center bg-primary-100 rounded-full">
          {photo}
        </div>
      ) : null}
      <div className={`flex-1 ${photo && "pt-0.5"}`}>
        <div className="font-bold">{title}</div>
        <div className="text-sm">{subtitle}</div>
      </div>
      {options && (
        <div className="relative" onBlur={(e) => _dropdown.current?.onBlur(e)}>
          <button
            type="button"
            onClick={() => {
              _dropdown.current?.toggle();
            }}
            className="p-2 bg-gray-100 border rounded text-gray-500"
          >
            <RiMore2Fill />
          </button>
          <DropdownMenu ref={_dropdown}>{options}</DropdownMenu>
        </div>
      )}
    </div>
  );
}
