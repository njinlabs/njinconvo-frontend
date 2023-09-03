import { RiAddBoxLine, RiSearch2Line } from "react-icons/ri";
import Button from "../../components/Button";
import getLang from "../../languages";
import { useFetcher } from "../../utilities/fetcher";
import index from "../../apis/classroom";
import { useEffect, Fragment } from "react";
import ClassroomList from "../../components/ClassroomList";
import NotFound from "../../components/NotFound";
import { useForm } from "react-hook-form";
import { useModal } from "../../components/modal/useModal";
import Modal from "../../components/modal";
import TextField from "../../components/form/TextField";
import store from "../../apis/classroom/store";
import { toast } from "react-toastify";

export default function TeacherDashboard() {
  const { control: _composeModal } = useModal({});

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      name: "",
    },
  });

  const classroomStoreFetcher = useFetcher({
    api: store,
    onSuccess: () => {
      classroomFetcher.process({});
      _composeModal.close();
    },
  });

  const classroomFetcher = useFetcher({
    api: index,
  });

  useEffect(() => {
    classroomFetcher.process({});
  }, []);

  return (
    <Fragment>
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
              onClick={() => {
                _composeModal.open();
              }}
            >
              <RiAddBoxLine className="text-base lg:text-sm mr-2" />
              <span>{getLang().createClassroom}</span>
            </Button>
          </div>
        </div>
        {classroomFetcher.data?.data?.length ? (
          <div className="flex-1 relative">
            <div className="absolute top-0 left-0 w-full h-full overflow-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 p-5">
                {((classroomFetcher.data?.data as any[]) || []).map(
                  (item, index) => (
                    <ClassroomList
                      name={item.name}
                      teacher={{
                        fullname: item.teacher.fullname,
                        avatar: item.teacher.avatar,
                      }}
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
      <Modal control={_composeModal} title={getLang().createClassroom}>
        <form
          onSubmit={handleSubmit((data) => {
            toast.promise(classroomStoreFetcher.process(data), {
              pending: getLang().waitAMinute,
              success: getLang().succeed,
              error: getLang().failed,
            });
          })}
        >
          <TextField
            type="text"
            label={getLang().name}
            containerClassName="mb-5"
            message={errors.name?.message}
            {...register("name", {
              required: getLang().requiredMsg,
            })}
          />
          <Button
            element={"button"}
            type="submit"
            className="w-full"
            disabled={classroomStoreFetcher.isLoading}
          >
            {getLang().createClassroom}
          </Button>
        </form>
      </Modal>
    </Fragment>
  );
}
