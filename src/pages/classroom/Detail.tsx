import moment from "moment";
import { Fragment, useEffect } from "react";
import {
  RiAddBoxLine,
  RiChat4Line,
  RiDeleteBin2Line,
  RiInformationLine,
  RiLogoutCircleLine,
  RiPencilFill,
  RiSearch2Line,
  RiUser6Fill,
  RiUserAddLine,
} from "react-icons/ri";
import { Link, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import index from "../../apis/classroom/meeting";
import destroy from "../../apis/classroom/meeting/destroy";
import participants from "../../apis/classroom/participants";
import Button from "../../components/Button";
import List from "../../components/List";
import MiniButton from "../../components/MiniButton";
import NotAllowed from "../../components/NotAllowed";
import NotFound from "../../components/NotFound";
import { DropdownItem } from "../../components/dropdown";
import Modal from "../../components/modal";
import { useModal } from "../../components/modal/useModal";
import getLang from "../../languages";
import { useAppDispatch } from "../../redux/hooks";
import { setWeb } from "../../redux/slices/web";
import { useFetcher } from "../../utilities/fetcher";
import { warningAlert } from "../../utilities/sweet-alert";

export default function Detail() {
  const dispatch = useAppDispatch();
  const { control: _infoModal } = useModal({});
  const { classroom } = useOutletContext<{ classroom: any }>();

  const participantsFetcher = useFetcher({
    api: participants,
  });

  const meetingsFetcher = useFetcher({
    api: index,
  });

  const destroyMeetingFetcher = useFetcher({
    api: destroy,
    onSuccess: () => {
      meetingsFetcher.process({ classroomId: classroom.id! });
    },
  });

  useEffect(() => {
    dispatch(
      setWeb({
        pageTitle: classroom.name,
      })
    );
    meetingsFetcher.process({ classroomId: classroom.id });
  }, [classroom]);

  if (!classroom) return <NotAllowed />;

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
            {classroom?.has_joined?.classroom_role === "teacher" && (
              <Button
                element={Link}
                to="meeting"
                color="green"
                className="flex items-center justify-center space-x-2"
              >
                <RiAddBoxLine className="text-base lg:text-sm" />
                <span className="hidden lg:block">{getLang().meeting}</span>
              </Button>
            )}
            <Button
              element={"button"}
              type="button"
              color="basic"
              className="flex items-center"
              onClick={() => {
                if (
                  !participantsFetcher.isLoading &&
                  !participantsFetcher.data
                ) {
                  participantsFetcher.process({ id: classroom.id! });
                }
                _infoModal.open();
              }}
            >
              <RiInformationLine className="text-base lg:text-sm" />
              <span className="ml-2 uppercase">{getLang().info}</span>
            </Button>
          </div>
        </div>
        {!meetingsFetcher.data?.data?.length && !meetingsFetcher.isLoading ? (
          <NotFound />
        ) : (
          <div className="flex-1 overflow-auto">
            <div className="grid grid-flow-row grid-cols-1 lg:grid-cols-3 p-5 gap-5">
              {((meetingsFetcher.data?.data as Array<any>) || []).map(
                (item, index) => (
                  <List
                    key={`${index}`}
                    title={item.title}
                    options={
                      classroom?.has_joined?.classroom_role === "teacher" ? (
                        <Fragment>
                          <DropdownItem
                            element={"button"}
                            type="button"
                            icon={RiDeleteBin2Line}
                            className="text-red-600"
                            iconClassName="text-red-500"
                            onClick={() =>
                              warningAlert({
                                title: getLang().sure,
                                text: getLang().meetingDestroyConfirmation,
                                showCancelButton: true,
                                cancelButtonText: getLang().cancel,
                                confirmButtonText: getLang().yesConfirm,
                              }).then((value) => {
                                if (value.isConfirmed) {
                                  toast.promise(
                                    destroyMeetingFetcher.process({
                                      classroomId: classroom.id!,
                                      id: item.id,
                                    }),
                                    {
                                      pending: getLang().waitAMinute,
                                      success: getLang().succeed,
                                      error: getLang().failed,
                                    }
                                  );
                                }
                              })
                            }
                          >
                            {getLang().delete}
                          </DropdownItem>
                        </Fragment>
                      ) : undefined
                    }
                    subtitle={
                      <div
                        className={
                          classroom?.has_joined?.classroom_role === "teacher"
                            ? "mt-1"
                            : ""
                        }
                      >
                        {classroom?.has_joined?.classroom_role === "teacher" &&
                          (item.is_draft ? (
                            <span className="uppercase inline-table mr-2 text-xs bg-yellow-300 border border-yellow-400 p-1 rounded">
                              {getLang().draft}
                            </span>
                          ) : (
                            <span className="uppercase inline-table mr-2 text-xs bg-blue-300 border border-blue-400 p-1 rounded">
                              {getLang().published}
                            </span>
                          ))}
                        {moment(item.created_at).format("D MMMM YYYY, HH:mm")}
                      </div>
                    }
                    element={Link}
                    to={`/classroom/${classroom.id}/meeting/${item.id}`}
                  />
                )
              )}
            </div>
          </div>
        )}
      </div>
      <Modal control={_infoModal} title={getLang().detail}>
        <div className="flex justify-start items-center space-x-5 mb-6 group-hover:bg-gray-100">
          <div className="w-12 h-12 lg:w-16 lg:h-16 flex-shrink-0 rounded-full bg-primary-100 border border-primary-200 flex justify-center items-center overflow-hidden">
            {classroom?.avatar ? (
              <img
                src={classroom?.avatar}
                className="w-full h-full object-cover"
              />
            ) : (
              <RiUser6Fill className="text-primary-500 text-xl lg:text-4xl" />
            )}
          </div>
          <div className="flex-1 flex flex-col items-start">
            <div className="font-bold text-gray-700 font-montserrat w-full">
              {classroom?.name}
            </div>
            <div>{classroom?.code}</div>
          </div>
          {classroom?.has_joined?.classroom_role === "teacher" && (
            <MiniButton
              element={"button"}
              color="basic"
              type="button"
              className="py-2"
            >
              <RiPencilFill />
            </MiniButton>
          )}
        </div>
        <div className="flex justify-start items-center space-x-3 border-b border-gray-300 pb-5 mb-5">
          <Button
            type="button"
            element={"button"}
            color="basic"
            className="flex justify-start items-center space-x-2"
          >
            <RiChat4Line />
            <span>{getLang().chat}</span>
          </Button>
          <Button
            type="button"
            element={"button"}
            color="basic"
            className="flex justify-start items-center space-x-2"
          >
            <RiUserAddLine />
            <span>{getLang().invite}</span>
          </Button>
          {classroom?.has_joined?.classroom_role === "teacher" ? (
            <Button
              type="button"
              element={"button"}
              color="red"
              className="flex justify-start items-center space-x-2"
            >
              <RiDeleteBin2Line />
              <span>{getLang().delete}</span>
            </Button>
          ) : (
            <Button
              type="button"
              element={"button"}
              color="red"
              className="flex justify-start items-center space-x-2"
            >
              <RiLogoutCircleLine />
              <span>{getLang().leave}</span>
            </Button>
          )}
        </div>
        <div className="font-bold text-gray-700 font-montserrat mb-5">
          {getLang().participants}
        </div>
        {participantsFetcher.isLoading ? (
          <div className="text-center">{getLang().waitAMinute}</div>
        ) : (
          <div className="flex flex-col space-y-3">
            {((participantsFetcher.data as Array<any>) || []).map(
              (item, index) => (
                <List
                  key={`${index}`}
                  title={item.fullname}
                  photo={item.avatar || <RiUser6Fill />}
                  subtitle={
                    getLang()[item.classroom_role as keyof typeof getLang]
                  }
                />
              )
            )}
          </div>
        )}
      </Modal>
    </Fragment>
  );
}
