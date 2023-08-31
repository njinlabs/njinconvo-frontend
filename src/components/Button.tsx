import { ReactNode, HTMLProps, ComponentProps } from "react";
import { Link } from "react-router-dom";

const colorType = {
  primary:
    "bg-primary-400 hover:bg-primary-500 text-white border border-primary-600",
  secondary:
    "bg-secondary-500 hover:bg-secondary-600 text-white border border-secondary-700",
};

export type ButtonProps<T extends typeof Link | "button" = "button"> = {
  element: T;
  children?: ReactNode;
  color?: keyof typeof colorType;
};

export default function Button<T extends typeof Link | "button">({
  element: Element = "button",
  children,
  color = "primary",
  className,
  ...props
}: ButtonProps<any> & HTMLProps<HTMLButtonElement> & ComponentProps<T>) {
  return (
    <Element
      {...props}
      className={`${colorType[color]} rounded h-12 px-3 text-sm ${className}`}
    >
      {children}
    </Element>
  );
}
