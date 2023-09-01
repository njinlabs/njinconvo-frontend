import { ReactNode, HTMLProps, ComponentProps } from "react";
import { Link } from "react-router-dom";
import { IconType } from "react-icons";
import { RiAddLine } from "react-icons/ri";

export type ButtonProps<T extends typeof Link | "button" = "button"> = {
  element: T;
  children?: ReactNode;
  icon: IconType;
};

export default function DropdownItem<T extends typeof Link | "button">({
  element: Element = "button",
  children,
  color = "primary",
  className,
  icon: Icon = RiAddLine,
  ...props
}: ButtonProps<any> & HTMLProps<HTMLButtonElement> & ComponentProps<T>) {
  return (
    <Element
      {...props}
      className={`rounded flex items-center py-4 justify-start text-left bg-white hover:bg-gray-100 text-gray-600 text-sm ${className}`}
    >
      <div className="w-12 flex justify-center text-gray-800">
        <Icon className="text-lg" />
      </div>
      <div className="flex-1">{children}</div>
    </Element>
  );
}
