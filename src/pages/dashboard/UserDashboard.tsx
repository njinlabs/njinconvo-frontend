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
import index from "../../apis/group";
import showByCode from "../../apis/group/show-by-code";
import store from "../../apis/group/store";
import Button from "../../components/Button";
import GroupList from "../../components/GroupList";
import NotFound from "../../components/NotFound";
import TextField from "../../components/form/TextField";
import Modal from "../../components/modal";
import { useModal } from "../../components/modal/useModal";
import getLang from "../../languages";
import { useAppSelector } from "../../redux/hooks";
import { useFetcher } from "../../utilities/fetcher";
import join from "../../apis/group/join";
import getUrl from "../../utilities/get-url";

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

  const groupByCodeFetcher = useFetcher({
    api: showByCode,
    onSuccess: () => {
      _joinModal.close();
      _infoModal.open();
    },
  });

  const groupJoinFetcher = useFetcher({
    api: join,
    onSuccess: () => {
      _infoModal.close();
      groupFetcher.process({});
    },
  });

  const groupStoreFetcher = useFetcher({
    api: store,
    onSuccess: () => {
      groupFetcher.process({});
      _composeModal.close();
    },
  });

  const groupFetcher = useFetcher({
    api: index,
  });

  useEffect(() => {
    groupFetcher.process({});
  }, []);

  useEffect(() => {
    const code = searchParams.get("join");

    if (code) {
      toast.promise(groupByCodeFetcher.process({ code }), {
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
            {user?.role === "lead" ? (
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
                <span>{getLang().createGroup}</span>
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
        {groupFetcher.data?.data?.length ? (
          <div className="flex-1 relative">
            <div className="absolute top-0 left-0 w-full h-full overflow-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 p-5">
                {((groupFetcher.data?.data as any[]) || []).map(
                  (item, index) => (
                    <GroupList
                      id={item.id}
                      name={item.name}
                      lead={{
                        fullname: item.lead.fullname,
                        avatar: item.lead.avatar
                          ? getUrl(item.lead.avatar.url)
                          : null,
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
      <Modal control={_composeModal} title={getLang().createGroup}>
        <form
          onSubmit={handleSubmit((data) => {
            toast.promise(groupStoreFetcher.process(data), {
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
            disabled={groupStoreFetcher.isLoading}
          >
            {getLang().createGroup}
          </Button>
        </form>
      </Modal>
      <Modal control={_joinModal} title={getLang().join}>
        <form
          onSubmit={joinSubmit(({ code }) => {
            toast.promise(groupByCodeFetcher.process({ code }), {
              pending: getLang().waitAMinute,
              error: getLang().failed,
            });
          })}
        >
          <TextField
            type="text"
            label={getLang().groupCode}
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
            disabled={groupByCodeFetcher.isLoading}
          >
            {getLang().join}
          </Button>
        </form>
      </Modal>
      <Modal control={_infoModal} title={getLang().detail}>
        <div className="flex justify-start items-center space-x-5 mb-6 group-hover:bg-gray-100">
          <div className="w-12 h-12 lg:w-16 lg:h-16 flex-shrink-0 rounded-full bg-primary-100 border border-primary-200 flex justify-center items-center overflow-hidden">
            {groupByCodeFetcher.data?.avatar ? (
              <img
                src={groupByCodeFetcher.data?.avatar}
                className="w-full h-full object-cover"
              />
            ) : (
              <RiUser6Fill className="text-primary-500 text-xl lg:text-4xl" />
            )}
          </div>
          <div className="flex-1 flex flex-col items-start">
            <div className="font-bold text-gray-700 font-montserrat w-full">
              {groupByCodeFetcher.data?.name}
            </div>
            <div>{groupByCodeFetcher.data?.lead?.fullname}</div>
          </div>
        </div>
        <div className="flex justify-start items-center space-x-3 border-b border-gray-300 pb-5 mb-5">
          {groupByCodeFetcher.data?.has_joined ? (
            <Button
              to={"/group/" + groupByCodeFetcher.data?.id}
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
                  groupJoinFetcher.process({
                    code: groupByCodeFetcher.data?.code,
                  }),
                  {
                    pending: getLang().waitAMinute,
                    success: getLang().succeed,
                    error: getLang().failed,
                  }
                );
              }}
              disabled={groupJoinFetcher.isLoading}
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
