import { Fragment, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams, Link } from "react-router-dom";
import {
  RiAddBoxLine,
  RiCheckFill,
  RiCloseFill,
  RiSearch2Line,
  RiUser6Fill,
  RiLoginBoxLine,
} from "react-icons/ri";
import { toast } from "react-toastify";
import index from "../../apis/classroom";
import showByCode from "../../apis/classroom/show-by-code";
import store from "../../apis/classroom/store";
import Button from "../../components/Button";
import ClassroomList from "../../components/ClassroomList";
import NotFound from "../../components/NotFound";
import TextField from "../../components/form/TextField";
import Modal from "../../components/modal";
import { useModal } from "../../components/modal/useModal";
import getLang from "../../languages";
import { useAppSelector } from "../../redux/hooks";
import { useFetcher } from "../../utilities/fetcher";
import join from "../../apis/classroom/join";

export default function UserDashboard() {
  const { control: _composeModal } = useModal({});
  const { control: _joinModal } = useModal({});
  const { control: _infoModal } = useModal({});
  const { data: user } = useAppSelector((state) => state.user);
  const [searchParams] = useSearchParams();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      name: "",
    },
  });

  const {
    register: joinRegister,
    formState: { errors: joinErrors },
    handleSubmit: joinSubmit,
  } = useForm({
    defaultValues: {
      code: "",
    },
  });

  const classroomByCodeFetcher = useFetcher({
    api: showByCode,
    onSuccess: () => {
      _joinModal.close();
      _infoModal.open();
    },
  });

  const classroomJoinFetcher = useFetcher({
    api: join,
    onSuccess: () => {
      _infoModal.close();
      classroomFetcher.process({});
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

  useEffect(() => {
    const code = searchParams.get("join");

    if (code) {
      toast.promise(classroomByCodeFetcher.process({ code }), {
        pending: getLang().waitAMinute,
        error: getLang().failed,
      });
    }
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
            {user?.role === "teacher" ? (
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
            ) : (
              <Button
                element={"button"}
                type="button"
                color="green"
                className="flex items-center"
                onClick={() => {
                  _joinModal.open();
                }}
              >
                <RiAddBoxLine className="text-base lg:text-sm mr-2" />
                <span>{getLang().join}</span>
              </Button>
            )}
          </div>
        </div>
        {classroomFetcher.data?.data?.length ? (
          <div className="flex-1 relative">
            <div className="absolute top-0 left-0 w-full h-full overflow-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 p-5">
                {((classroomFetcher.data?.data as any[]) || []).map(
                  (item, index) => (
                    <ClassroomList
                      id={item.id}
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
      <Modal control={_joinModal} title={getLang().join}>
        <form
          onSubmit={joinSubmit(({ code }) => {
            toast.promise(classroomByCodeFetcher.process({ code }), {
              pending: getLang().waitAMinute,
              error: getLang().failed,
            });
          })}
        >
          <TextField
            type="text"
            label={getLang().classroomCode}
            containerClassName="mb-5"
            message={joinErrors.code?.message}
            {...joinRegister("code", {
              required: getLang().requiredMsg,
            })}
          />
          <Button
            element={"button"}
            type="submit"
            className="w-full"
            disabled={classroomByCodeFetcher.isLoading}
          >
            {getLang().join}
          </Button>
        </form>
      </Modal>
      <Modal control={_infoModal} title={getLang().detail}>
        <div className="flex justify-start items-center space-x-5 mb-6 group-hover:bg-gray-100">
          <div className="w-12 h-12 lg:w-16 lg:h-16 flex-shrink-0 rounded-full bg-primary-100 border border-primary-200 flex justify-center items-center overflow-hidden">
            {classroomByCodeFetcher.data?.avatar ? (
              <img
                src={classroomByCodeFetcher.data?.avatar}
                className="w-full h-full object-cover"
              />
            ) : (
              <RiUser6Fill className="text-primary-500 text-xl lg:text-4xl" />
            )}
          </div>
          <div className="flex-1 flex flex-col items-start">
            <div className="font-bold text-gray-700 font-montserrat w-full">
              {classroomByCodeFetcher.data?.name}
            </div>
            <div>{classroomByCodeFetcher.data?.teacher?.fullname}</div>
          </div>
        </div>
        <div className="flex justify-start items-center space-x-3 border-b border-gray-300 pb-5 mb-5">
          {classroomByCodeFetcher.data?.has_joined ? (
            <Button
              to={"/classroom/" + classroomByCodeFetcher.data?.id}
              element={Link}
              className="flex justify-start items-center space-x-2"
            >
              <RiLoginBoxLine />
              <span>{getLang().start}</span>
            </Button>
          ) : (
            <Button
              type="button"
              element={"button"}
              onClick={() => {
                toast.promise(
                  classroomJoinFetcher.process({
                    code: classroomByCodeFetcher.data?.code,
                  }),
                  {
                    pending: getLang().waitAMinute,
                    success: getLang().succeed,
                    error: getLang().failed,
                  }
                );
              }}
              disabled={classroomJoinFetcher.isLoading}
              className="flex justify-start items-center space-x-2"
            >
              <RiCheckFill />
              <span>{getLang().join}</span>
            </Button>
          )}
          <Button
            type="button"
            element={"button"}
            color="basic"
            className="flex justify-start items-center space-x-2"
            onClick={() => _infoModal.close()}
          >
            <RiCloseFill />
            <span>{getLang().cancel}</span>
          </Button>
        </div>
      </Modal>
    </Fragment>
  );
}
