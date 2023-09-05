import { RiCheckFill, RiCloseFill } from "react-icons/ri";

type SwitchFieldProps = {
  label?: string;
  labelPosition?: "left" | "right";
  containerClassName?: string;
  value?: boolean;
  message?: string;
  onChange?: (args: boolean) => void;
};

export default function SwitchField({
  label,
  containerClassName = "",
  value = false,
  message = "",
  onChange = () => {},
  labelPosition = "right",
}: SwitchFieldProps) {
  return (
    <div className={containerClassName}>
      <div className="flex items-center space-x-2">
        {label && labelPosition === "left" && <label>{label}</label>}
        <button
          type="button"
          className={
            "w-20 h-10 rounded-full " +
            (value ? "bg-indigo-200" : "bg-gray-300")
          }
          onClick={() => {
            onChange(!value);
          }}
        >
          <div
            className={
              "w-1/2 h-full flex items-center justify-center text-2xl rounded-full border transform transition duration-300 " +
              (value
                ? "bg-indigo-500 translate-x-full border-indigo-600"
                : "bg-white translate-x-0 border-gray-400")
            }
          >
            {value ? (
              <RiCheckFill className="text-white" />
            ) : (
              <RiCloseFill className="text-gray-700" />
            )}
          </div>
        </button>
        {label && labelPosition === "right" && <label>{label}</label>}
      </div>
      {message && <div className="text-sm text-red-500">{message}</div>}
    </div>
  );
}
