import { forwardRef, LegacyRef, HTMLProps } from "react";
export type TextFieldProps = {
  containerClassName?: string;
  label?: string;
  className?: string;
  message?: string | boolean;
};

const TextField = forwardRef(
  (
    {
      containerClassName = "",
      label,
      className,
      message,
      ...props
    }: TextFieldProps & HTMLProps<HTMLInputElement>,
    ref: LegacyRef<HTMLInputElement>
  ) => {
    return (
      <div className={containerClassName}>
        {label && <label>{label}</label>}
        <div className="relative w-full">
          <input
            {...props}
            ref={ref}
            className={`w-full h-12 border ${
              message ? "border-red-600" : "border-gray-300"
            } px-3 rounded ${className}`}
          />
        </div>
        {typeof message === "string" && (
          <div className="text-sm text-red-600">{message}</div>
        )}
      </div>
    );
  }
);

export default TextField;
