import { Link } from "react-router-dom";
import { ReactNode, ComponentProps } from "react";

type NavbarListProps = {
  children: ReactNode;
  active?: boolean;
};

export default function NavbarList({
  children,
  active = false,
  ...props
}: NavbarListProps & ComponentProps<typeof Link>) {
  return (
    <Link
      className={`py-3 px-5 ${
        active
          ? "bg-primary-500 text-white"
          : "bg-transparent hover:bg-primary-100 text-gray-600"
      } rounded`}
      {...props}
    >
      {children}
    </Link>
  );
}
