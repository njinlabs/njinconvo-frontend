import { HTMLProps, ReactNode } from "react";
import {
  RiArrowUpDownLine,
  RiFilter2Line,
  RiSearch2Line,
} from "react-icons/ri";
import getLang from "../../languages";
import Button from "../Button";

export type TableData<T, K extends keyof T = keyof T> = {
  key: K | null;
  label?: string;
  render?: (value: T[K] | null, index: number) => ReactNode;
  action?: boolean;
  props?: HTMLProps<HTMLTableCellElement>;
};

export type TableProps<T> = {
  data: T[];
  columns: (TableData<T> | "indexing")[];
  loading?: boolean;
  buttons?: ReactNode;
};

export default function Table<T>({
  data,
  columns,
  loading,
  buttons,
}: TableProps<T>) {
  return (
    <div className="flex-1 flex flex-col relative">
      <div className="border-b border-gray-300 flex justify-start items-center">
        <div className="border-r border-gray-300 flex-1 lg:flex-0 w-auto lg:w-1/3 relative">
          <input
            type="text"
            className="w-full h-16 px-3 pl-10 lg:pl-12"
            placeholder={getLang().search + "..."}
          />
          <div className="absolute top-0 left-0 h-16 w-10 lg:w-12 flex justify-center items-center pointer-events-none">
            <RiSearch2Line />
          </div>
        </div>
        <div className="flex items-center justify-end ml-auto px-5 space-x-3">
          <Button
            element={"button"}
            type="button"
            color="basic"
            className="flex items-center"
          >
            <RiArrowUpDownLine className="text-base lg:text-sm m-0 lg:mr-2" />
            <span className="hidden lg:block">{getLang().sort}</span>
          </Button>
          <Button
            element={"button"}
            type="button"
            color="basic"
            className="flex items-center"
          >
            <RiFilter2Line className="text-base lg:text-sm m-0 lg:mr-2" />
            <span className="hidden lg:block">{getLang().filter}</span>
          </Button>
          {buttons}
        </div>
      </div>
      <div className="relative flex-1">
        <div className="absolute top-0 left-0 w-full h-full overflow-auto">
          <table
            className="min-w-full border-collapse"
            style={{ maxWidth: 9000 }}
          >
            <thead className="sticky top-0 bg-white z-10 shadow shadow-gray-300">
              <tr>
                {columns.map((item, index) => (
                  <th
                    className="py-4 px-5 text-left whitespace-nowrap"
                    key={`${index}`}
                    {...(item !== "indexing" && item.props ? item.props : {})}
                  >
                    {item === "indexing"
                      ? "#"
                      : item.label || (item.key as string)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr
                  key={`${rowIndex}`}
                  className="bg-transparent hover:bg-gray-100 group"
                >
                  {columns.map((item, index) => (
                    <td
                      key={`${index}`}
                      className={`py-4 px-5 text-sm border-b ${
                        item !== "indexing" && item.action
                          ? "sticky right-0 bg-white group-hover:bg-gray-100"
                          : ""
                      }`}
                      {...(item !== "indexing" && item.props ? item.props : {})}
                    >
                      {item === "indexing"
                        ? rowIndex + 1
                        : item.key
                        ? !item.render
                          ? (row[item.key!] as ReactNode)
                          : item.render(row[item.key!], rowIndex)
                        : item.render!(null, rowIndex)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {loading && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 z-10 flex justify-center items-center">
          <div className="py-5 px-8 bg-white rounded">
            {getLang().waitAMinute}
          </div>
        </div>
      )}
    </div>
  );
}
