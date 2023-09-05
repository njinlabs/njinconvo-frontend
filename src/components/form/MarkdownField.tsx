import MDEditor from "@uiw/react-md-editor";
import { ComponentProps } from "react";
export type MarkdownFieldProps = {
  containerClassName?: string;
  label?: string;
  className?: string;
  message?: string | boolean;
  prefix?: any;
  value?: string;
  onChange?: () => void;
};

const MarkdownField = ({
  containerClassName = "",
  label,
  className,
  message,
  value = "",
  onChange = () => {},
  ...props
}: MarkdownFieldProps & ComponentProps<typeof MDEditor>) => {
  return (
    <div className={containerClassName}>
      {label && <label>{label}</label>}
      <MDEditor
        {...props}
        value={value}
        onChange={onChange}
        className={className}
      />
      {typeof message === "string" && (
        <div className="text-sm text-red-600">{message}</div>
      )}
    </div>
  );
};

export default MarkdownField;
