import { HTMLProps, LegacyRef, forwardRef } from "react";
export type TextFieldProps = {
  containerClassName?: string;
  label?: string;
  className?: string;
  message?: string | boolean;
  prefix?: any;
};

const TextField = forwardRef(
  (
    {
      containerClassName = "",
      label,
      className,
      message,
      prefix,
      ...props
    }: TextFieldProps & HTMLProps<HTMLInputElement>,
    ref: LegacyRef<HTMLInputElement>
  ) => {
    return (
      <div className={containerClassName}>
        {label && <label>{label}</label>}
        <div className="relative w-full overflow-hidden">
          <input
            {...props}
            ref={ref}
            className={`w-full h-12 border ${
              message ? "border-red-600" : "border-gray-300"
            } px-3 rounded ${className} ${prefix ? "pl-12" : ""}`}
          />
          {prefix && (
            <div className="absolute top-0 left-0 w-12 h-12 flex justify-center items-center pointer-events-none">
              {prefix}
            </div>
          )}
        </div>
        {typeof message === "string" && (
          <div className="text-sm text-red-600">{message}</div>
        )}
      </div>
    );
  }
);

export default TextField;
