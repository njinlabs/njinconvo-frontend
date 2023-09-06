import { ComponentProps, ReactNode, useRef } from "react";
import { RiMore2Fill } from "react-icons/ri";
import { Link } from "react-router-dom";
import DropdownMenu, { DropdownMenuRefObject } from "./dropdown/DropdownMenu";

type ListProps<T extends typeof Link | "a"> = {
  title: string | ReactNode;
  subtitle: string | ReactNode;
  photo?: string | null | ReactNode;
  options?: ReactNode;
  element?: T;
};

export default function List<T extends typeof Link | "a">({
  title,
  subtitle,
  photo,
  options,
  element: Element = "a" as T,
  ...props
}: ListProps<T> & ComponentProps<T>) {
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
        <div
          className="relative z-10"
          onBlur={(e) => _dropdown.current?.onBlur(e)}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
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

      {Element && (
        <Element
          {...(props as any)}
          className="absolute top-0 left-0 w-full h-full"
        ></Element>
      )}
    </div>
  );
}
