import { Fragment, useEffect } from "react";
import {
  RiAddBoxLine,
  RiChat4Line,
  RiDeleteBin2Line,
  RiMoreFill,
  RiPencilFill,
  RiSearch2Line,
  RiUser6Fill,
  RiUserAddLine,
  RiLogoutCircleLine,
} from "react-icons/ri";
import { useParams } from "react-router-dom";
import show from "../../apis/classroom/show";
import Button from "../../components/Button";
import MiniButton from "../../components/MiniButton";
import NotAllowed from "../../components/NotAllowed";
import Modal from "../../components/modal";
import { useModal } from "../../components/modal/useModal";
import getLang from "../../languages";
import { useFetcher } from "../../utilities/fetcher";
import { useAppDispatch } from "../../redux/hooks";
import { setWeb } from "../../redux/slices/web";

export default function Detail() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { control: _infoModal } = useModal({});

  const classroomShowFetcher = useFetcher({
    api: show,
    onSuccess: (data) => {
      dispatch(
        setWeb({
          pageTitle: data.name,
        })
      );
    },
  });

  useEffect(() => {
    classroomShowFetcher.process({ id: id! });
  }, [id]);

  if (!classroomShowFetcher.data && !classroomShowFetcher.isLoading)
    return <NotAllowed />;

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
            {classroomShowFetcher.data?.has_joined?.classroom_role ===
              "teacher" && (
              <Button
                element={"button"}
                type="button"
                color="green"
                className="flex items-center"
              >
                <RiAddBoxLine className="text-base lg:text-sm mr-2" />
                <span>{getLang().meeting}</span>
              </Button>
            )}
            <Button
              element={"button"}
              type="button"
              color="basic"
              className="flex items-center"
              onClick={() => {
                _infoModal.open();
              }}
            >
              <RiMoreFill className="text-base lg:text-sm" />
              {classroomShowFetcher.data?.has_joined?.classroom_role ===
                "student" && (
                <span className="ml-2 uppercase">{getLang().option}</span>
              )}
            </Button>
          </div>
        </div>
      </div>
      <Modal control={_infoModal} title={getLang().detail}>
        <div className="flex justify-start items-center space-x-5 mb-6 group-hover:bg-gray-100">
          <div className="w-12 h-12 lg:w-16 lg:h-16 flex-shrink-0 rounded-full bg-primary-100 border border-primary-200 flex justify-center items-center overflow-hidden">
            {classroomShowFetcher.data?.avatar ? (
              <img
                src={classroomShowFetcher.data?.avatar}
                className="w-full h-full object-cover"
              />
            ) : (
              <RiUser6Fill className="text-primary-500 text-xl lg:text-4xl" />
            )}
          </div>
          <div className="flex-1 flex flex-col items-start">
            <div className="font-bold text-gray-700 font-montserrat w-full">
              {classroomShowFetcher.data?.name}
            </div>
            <div>{classroomShowFetcher.data?.code}</div>
          </div>
          {classroomShowFetcher.data?.has_joined?.classroom_role ===
            "teacher" && (
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
          {classroomShowFetcher.data?.has_joined?.classroom_role ===
          "teacher" ? (
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
        <div className="font-bold text-gray-700 font-montserrat">
          {getLang().participants}
        </div>
      </Modal>
    </Fragment>
  );
}
