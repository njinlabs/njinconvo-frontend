import { RiAddBoxLine, RiSearch2Line } from "react-icons/ri";
import Button from "../../components/Button";
import getLang from "../../languages";
import { useFetcher } from "../../utilities/fetcher";
import index from "../../apis/classroom";
import { useEffect } from "react";
import ClassroomList from "../../components/ClassroomList";
import NotFound from "../../components/NotFound";

export default function TeacherDashboard() {
  const classroomFetcher = useFetcher({
    api: index,
  });

  useEffect(() => {
    classroomFetcher.process({});
  }, []);

  return (
    <div className="flex-1 flex flex-col">
      <div className="border-b border-gray-400 flex justify-start items-center">
        <div className="border-r border-gray-400 flex-1 lg:flex-0 w-auto lg:w-1/3 relative">
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
            color="green"
            className="flex items-center"
          >
            <RiAddBoxLine className="text-base lg:text-sm m-0 lg:mr-2" />
            <span>{getLang().createClassroom}</span>
          </Button>
        </div>
      </div>
      {classroomFetcher.data?.data?.length ? (
        <div className="flex-1 relative">
          <div className="absolute top-0 left-0 w-full h-full overflow-auto">
            <div className="grid grid-cols-3 gap-5 p-5">
              {((classroomFetcher.data?.data as any[]) || []).map(
                (item, index) => (
                  <ClassroomList
                    name={item.name}
                    teacher={item.teacher}
                    participants={item.participants}
                    key={`${index}`}
                  />
                )
              )}
            </div>
          </div>
        </div>
      ) : (
        <NotFound />
      )}
    </div>
  );
}
