import { ReactNode, useRef } from "react";
import { RiMore2Fill } from "react-icons/ri";
import DropdownMenu, { DropdownMenuRefObject } from "./dropdown/DropdownMenu";
import { Link } from "react-router-dom";

export default function List({
  title,
  subtitle,
  photo,
  options,
  to,
}: {
  title: string | ReactNode;
  subtitle: string | ReactNode;
  photo?: string | null | ReactNode;
  options?: ReactNode;
  to?: string;
}) {
  const _dropdown = useRef<DropdownMenuRefObject>();

  return (
    <div className="p-5 border border-gray-300 bg-white hover:bg-gray-100 rounded flex justify-start items-start space-x-5 relative">
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
            onClick={(e) => {
              e.stopPropagation();
              _dropdown.current?.toggle();
            }}
            className="p-2 bg-gray-100 border rounded text-gray-500"
          >
            <RiMore2Fill />
          </button>
          <DropdownMenu ref={_dropdown}>{options}</DropdownMenu>
        </div>
      )}
      {to && (
        <Link to={to} className="absolute top-0 left-0 w-full h-full"></Link>
      )}
    </div>
  );
}
