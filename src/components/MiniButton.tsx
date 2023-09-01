import { ComponentProps, HTMLProps } from "react";
import { Link } from "react-router-dom";
import { ButtonProps, colorType } from "./Button";

export default function MiniButton<T extends typeof Link | "button">({
  element: Element = "button",
  children,
  color = "primary",
  className,
  ...props
}: ButtonProps<any> & HTMLProps<HTMLButtonElement> & ComponentProps<T>) {
  return (
    <Element
      {...props}
      className={`${colorType[color]} rounded-full py-1 px-3 text-sm font-normal ${className}`}
    >
      {children}
    </Element>
  );
}
