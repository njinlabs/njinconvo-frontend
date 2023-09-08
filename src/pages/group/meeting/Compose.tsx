import MDEditor from "@uiw/react-md-editor";
import {
  Fragment,
  LegacyRef,
  useEffect,
  useRef,
  useState,
  BaseSyntheticEvent,
} from "react";
import {
  Controller,
  FieldArrayWithId,
  useFieldArray,
  useForm,
} from "react-hook-form";
import {
  RiAddCircleFill,
  RiCloseFill,
  RiDeleteBin2Line,
  RiDownloadCloud2Line,
  RiListOrdered2,
  RiMore2Fill,
  RiPencilLine,
  RiSave2Line,
} from "react-icons/ri";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import store, {
  FileType,
  LinkType,
  MeetingParams,
} from "../../../apis/group/meeting/store";
import update from "../../../apis/group/meeting/update";
import Button from "../../../components/Button";
import List from "../../../components/List";
import MiniButton from "../../../components/MiniButton";
import NotAllowed from "../../../components/NotAllowed";
import { DropdownItem } from "../../../components/dropdown";
import DropdownMenu, {
  DropdownMenuRefObject,
} from "../../../components/dropdown/DropdownMenu";
import MarkdownField from "../../../components/form/MarkdownField";
import SwitchField from "../../../components/form/SwitchField";
import TextField from "../../../components/form/TextField";
import Modal from "../../../components/modal";
import { useModal } from "../../../components/modal/useModal";
import getLang from "../../../languages";
import { useAppDispatch } from "../../../redux/hooks";
import { setWeb } from "../../../redux/slices/web";
import { useFetcher } from "../../../utilities/fetcher";
import showSelf from "../../../apis/group/meeting/attendance/show-self";
import saveSelf from "../../../apis/group/meeting/attendance/save-self";

const defaultValues: MeetingParams = {
  title: "",
  description: "",
  is_draft: true,
  links: [],
  files: [],
};

const linkDefaultValues: LinkType = {
  rowId: "",
  title: "",
  url: "",
};

export default function Compose({ autoEdit = true }: { autoEdit?: boolean }) {
  const [edit, setEdit] = useState(autoEdit);
  const navigate = useNavigate();
  const { control: _composeLink } = useModal({});
  const { control: _selfAttendance } = useModal({});
  const _file = useRef<HTMLInputElement>();
  const _dropdownMore = useRef<DropdownMenuRefObject>();
  const _dropdownMoreSm = useRef<DropdownMenuRefObject>();
  const { group, meeting, refetchMeeting } = useOutletContext<{
    group: any;
    meeting: any;
    refetchMeeting: () => void;
  }>();

  const dispatch = useAppDispatch();
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues,
  });

  const {
    register: registerLink,
    handleSubmit: submitLink,
    formState: { errors: errorsLink },
    reset: resetLink,
  } = useForm({
    defaultValues: linkDefaultValues,
  });

  const {
    control: controlSelfAttendance,
    handleSubmit: submitSelfAttendance,
    reset: resetSelfAttendance,
  } = useForm({
    defaultValues: {
      status: "",
    },
  });

  const {
    append,
    fields,
    update: updateLink,
    remove,
  } = useFieldArray({
    control,
    name: "links",
  });

  const {
    append: appendFile,
    fields: files,
    remove: removeFile,
  } = useFieldArray({
    control,
    name: "files",
  });

  const storeFetcher = useFetcher({
    api: store,
    onSuccess: (data) => {
      setEdit(false);
      navigate(`/group/${group.id}/meeting/${data.id}`, {
        replace: true,
      });
    },
  });

  const updateFetcher = useFetcher({
    api: update,
    onSuccess: () => {
      setEdit(false);
      refetchMeeting();
    },
  });

  const selfFetcher = useFetcher({
    api: showSelf,
    onSuccess: (data) => {
      resetSelfAttendance({
        status: data.status,
      });
    },
  });

  const saveSelfFetcher = useFetcher({
    api: saveSelf,
    onSuccess: () => {
      _selfAttendance.close();
    },
  });

  useEffect(() => {
    dispatch(
      setWeb({
        pageTitle: meeting?.id ? meeting?.title : getLang().newMeeting,
      })
    );

    if (meeting) {
      reset({
        ...meeting,
        links: (meeting?.links || []).map(({ id, ...item }: LinkType) => ({
          ...item,
          rowId: id,
        })),
        files: (meeting?.files || []).map(({ id, ...item }: FileType) => ({
          ...item,
          rowId: id,
        })),
      });

      if (meeting.attendance?.allow_self_attendance) {
        selfFetcher.process({ groupId: group.id, id: meeting.id });
      }
    }
  }, [meeting]);

  if (!autoEdit && !meeting) return <NotAllowed />;

  return (
    <Fragment>
      <div className="flex-1 relative">
        <div className="block lg:flex justify-start items-stretch absolute top-0 left-0 w-full h-full overflow-auto lg:overflow-hidden">
          <div className="flex-1 border-r border-gray-300 h-auto lg:h-full flex flex-col">
            <div className="flex-1 border-b border-gray-300 relative order-2 lg:order-1">
              <div className="static lg:absolute top-0 left-0 w-full h-full overflow-auto p-5">
                {edit ? (
                  <Fragment>
                    <TextField
                      type="text"
                      label={getLang().title}
                      containerClassName="mb-5"
                      message={errors.title?.message}
                      {...register("title", {
                        required: getLang().requiredMsg,
                      })}
                    />
                    <Controller
                      control={control}
                      name="description"
                      render={({ field: { value, onChange } }) => (
                        <MarkdownField
                          label="Deskripsi"
                          value={value}
                          onChange={onChange}
                          preview="edit"
                        />
                      )}
                    />
                  </Fragment>
                ) : (
                  <Fragment>
                    <div className="font-bold text-xl font-montserrat text-gray-700">
                      {meeting?.title}
                    </div>
                    <MDEditor.Markdown
                      source={meeting?.description}
                      className="mt-5 !prose !max-w-full !text-gray-600 !font-roboto"
                    />
                  </Fragment>
                )}
              </div>
            </div>
            {(meeting?.group?.group_role === "lead" || autoEdit) && (
              <div className="flex justify-between items-center p-5 sticky lg:static top-0 left-0 w-full bg-white border-b border-gray-300 lg:border-b-0 order-1 lg:order-2">
                {edit ? (
                  <Fragment>
                    <Controller
                      control={control}
                      name="is_draft"
                      render={({ field: { value, onChange } }) => (
                        <SwitchField
                          value={!value}
                          onChange={(value) => onChange(!value)}
                          label={getLang().publish}
                          labelClassName="hidden lg:block"
                        />
                      )}
                    />
                    <div className="flex items-center justify-end space-x-3 lg:space-x-5">
                      {!autoEdit && (
                        <Button
                          element={"button"}
                          type="button"
                          color="basic"
                          className="flex justify-start items-center space-x-2"
                          onClick={() => setEdit(false)}
                        >
                          <RiCloseFill />
                          <span className="hidden lg:block">
                            {getLang().cancel}
                          </span>
                        </Button>
                      )}
                      <Button
                        element={"button"}
                        type="button"
                        className="flex justify-start items-center space-x-2"
                        disabled={
                          storeFetcher.isLoading || updateFetcher.isLoading
                        }
                        onClick={(e: React.BaseSyntheticEvent) =>
                          handleSubmit(({ links, files, ...data }) => {
                            const parseData = {
                              ...data,
                              links: links?.map((item) => ({
                                ...item,
                                id: item.rowId,
                              })),
                              files: files?.map((item) => ({
                                ...item,
                                id: item.rowId,
                              })),
                              group_id: group.id,
                            };

                            toast.promise(
                              meeting?.id
                                ? updateFetcher.process({
                                    ...parseData,
                                    id: meeting.id,
                                  })
                                : storeFetcher.process(parseData),
                              {
                                pending: getLang().waitAMinute,
                                success: getLang().succeed,
                                error: getLang().failed,
                              }
                            );
                          })(e)
                        }
                      >
                        <RiSave2Line />
                        <span className="hidden lg:block">
                          {getLang().save}
                        </span>
                      </Button>
                    </div>
                  </Fragment>
                ) : (
                  <Fragment>
                    <Button
                      element={"button"}
                      type="button"
                      color="basic"
                      className="flex justify-start items-center space-x-2"
                      onClick={() => setEdit(true)}
                    >
                      <RiPencilLine />
                      <span>{getLang().edit}</span>
                    </Button>

                    <div
                      className="relative"
                      onBlur={(e) => {
                        _dropdownMore.current?.onBlur(e);
                        _dropdownMoreSm.current?.onBlur(e);
                      }}
                    >
                      <Button
                        element={"button"}
                        type="button"
                        color="dark"
                        className="flex justify-start items-center space-x-2 uppercase"
                        onClick={() => {
                          _dropdownMore.current?.toggle();
                          _dropdownMoreSm.current?.toggle();
                        }}
                      >
                        <RiMore2Fill />
                        <span>{getLang().option}</span>
                      </Button>
                      <DropdownMenu
                        ref={_dropdownMore}
                        position="TopRight"
                        animation="FromBottom"
                        className="max-lg:hidden"
                      >
                        <DropdownItem
                          element={Link}
                          to="attendance"
                          icon={RiListOrdered2}
                        >
                          {getLang().attendance}
                        </DropdownItem>
                      </DropdownMenu>
                      <DropdownMenu ref={_dropdownMoreSm} className="lg:hidden">
                        <DropdownItem
                          element={Link}
                          to="attendance"
                          icon={RiListOrdered2}
                        >
                          {getLang().attendance}
                        </DropdownItem>
                      </DropdownMenu>
                    </div>
                  </Fragment>
                )}
              </div>
            )}
          </div>
          <div className="w-full lg:w-1/3 relative">
            <div className="static lg:absolute top-0 left-0 w-full h-full overflow-auto space-border-b">
              {(meeting?.links?.length || edit) && (
                <div className="p-5">
                  <div className="mb-5 flex justify-between items-center">
                    <div className="font-bold text-lg">{getLang().link}</div>
                    {edit && (
                      <MiniButton
                        element={"button"}
                        type="button"
                        color="dark"
                        onClick={() => _composeLink.open()}
                      >
                        <RiAddCircleFill />
                      </MiniButton>
                    )}
                  </div>
                  {(edit ? fields.length : meeting?.links?.length) ? (
                    <div className="flex flex-col justify-start space-y-3 mb-5">
                      {(
                        ((edit ? fields : meeting?.links) as Array<any>) || []
                      ).map((item, index) => (
                        <List
                          element={"a"}
                          href={item.url}
                          target="_blank"
                          key={`${item.id}`}
                          title={item.title}
                          subtitle={item.url}
                          options={
                            edit ? (
                              <Fragment>
                                <DropdownItem
                                  icon={RiPencilLine}
                                  element={"button"}
                                  type="button"
                                  onClick={() => {
                                    resetLink(item);
                                    _composeLink.open();
                                  }}
                                >
                                  {getLang().edit}
                                </DropdownItem>
                                <DropdownItem
                                  icon={RiDeleteBin2Line}
                                  element={"button"}
                                  type="button"
                                  onClick={() => {
                                    remove(index);
                                  }}
                                >
                                  {getLang().delete}
                                </DropdownItem>
                              </Fragment>
                            ) : undefined
                          }
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="p-5 text-center rounded border border-gray-300">
                      {getLang().noDataYet}
                    </div>
                  )}
                </div>
              )}
              {(meeting?.files?.length || edit) && (
                <div className="p-5">
                  <div className="mb-5 flex justify-between items-center">
                    <div className="font-bold text-lg">{getLang().file}</div>
                    {edit && (
                      <MiniButton
                        element={"button"}
                        type="button"
                        color="dark"
                        onClick={() => _file.current?.click()}
                      >
                        <RiAddCircleFill />
                      </MiniButton>
                    )}
                  </div>
                  {(edit ? files.length : meeting?.files?.length) ? (
                    <div className="flex flex-col justify-start space-y-3 mb-5">
                      {(
                        ((edit ? files : meeting?.files) as
                          | Array<FileType>
                          | FieldArrayWithId<MeetingParams, "files", "id">[]) ||
                        []
                      ).map((item, index) => (
                        <List
                          target="_blank"
                          key={`${item.id}`}
                          title={item.file?.name}
                          subtitle={item.file?.size}
                          options={
                            <Fragment>
                              <DropdownItem
                                icon={RiDownloadCloud2Line}
                                element={"a"}
                                href="/"
                              >
                                {getLang().download}
                              </DropdownItem>
                              {edit && (
                                <DropdownItem
                                  icon={RiDeleteBin2Line}
                                  element={"button"}
                                  type="button"
                                  onClick={() => {
                                    removeFile(index);
                                  }}
                                >
                                  {getLang().delete}
                                </DropdownItem>
                              )}
                            </Fragment>
                          }
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="p-5 text-center rounded border border-gray-300">
                      {getLang().noDataYet}
                    </div>
                  )}
                </div>
              )}
              {(meeting?.attendance?.allow_self_attendance ||
                meeting?.attendance?.show_it_to_participants) && (
                <div className="p-5 flex items-center justify-start space-x-5">
                  {meeting?.attendance?.allow_self_attendance && (
                    <Button
                      element={"button"}
                      color="basic"
                      type="button"
                      className="flex-1"
                      onClick={() => _selfAttendance.open()}
                    >
                      {getLang().confirmAttendance}
                    </Button>
                  )}
                  {meeting?.attendance?.show_it_to_participants && (
                    <Button
                      element={Link}
                      color="basic"
                      type="button"
                      className="flex-1 flex justify-center items-center text-center"
                      to="attendance"
                    >
                      {getLang().showAttendance}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal control={_composeLink} title={getLang().link}>
        <form
          onSubmit={submitLink((data) => {
            data.rowId
              ? updateLink(
                  fields.findIndex((el) => el.rowId === data.rowId),
                  data
                )
              : append(data);
            resetLink(linkDefaultValues);
            _composeLink.close();
          })}
        >
          <TextField
            type="text"
            label={getLang().title}
            containerClassName="mb-5"
            message={errorsLink.title?.message}
            {...registerLink("title", { required: getLang().requiredMsg })}
          />
          <TextField
            type="text"
            label={getLang().url}
            containerClassName="mb-5"
            message={errorsLink.url?.message}
            placeholder="http://"
            {...registerLink("url", { required: getLang().requiredMsg })}
          />
          <Button element={"button"} type="submit" className="w-full">
            {getLang().next}
          </Button>
        </form>
      </Modal>
      <input
        type="file"
        multiple
        ref={_file as LegacyRef<HTMLInputElement> | undefined}
        onChange={(e) => {
          for (const file of e.target.files || []) {
            appendFile({
              file,
            });
          }
        }}
        className="hidden"
      />
      {meeting?.attendance?.allow_self_attendance && (
        <Modal control={_selfAttendance} title="Konfirmasi Kehadiran">
          <Controller
            control={controlSelfAttendance}
            name="status"
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <div className="mb-5 grid grid-cols-4 gap-3">
                <Button
                  element={"button"}
                  type="button"
                  color={value === "present" ? "dark" : "basic"}
                  onClick={() => onChange("present")}
                >
                  {getLang().present}
                </Button>
                <Button
                  element={"button"}
                  type="button"
                  color={value === "sick" ? "dark" : "basic"}
                  onClick={() => onChange("sick")}
                >
                  {getLang().sick}
                </Button>
                <Button
                  element={"button"}
                  type="button"
                  color={value === "permission" ? "dark" : "basic"}
                  onClick={() => onChange("permission")}
                >
                  {getLang().permission}
                </Button>
                <Button
                  element={"button"}
                  type="button"
                  color={value === "absent" ? "dark" : "basic"}
                  onClick={() => onChange("absent")}
                >
                  {getLang().absent}
                </Button>
              </div>
            )}
          />
          <Button
            element={"button"}
            type="button"
            className="w-full flex justify-center items-center space-x-3"
            disabled={saveSelfFetcher.isLoading}
            onClick={(e: BaseSyntheticEvent<object, any, any>) =>
              submitSelfAttendance(({ status }) =>
                toast.promise(
                  saveSelfFetcher.process({
                    groupId: group.id,
                    id: meeting.id,
                    status: status as
                      | "present"
                      | "sick"
                      | "permission"
                      | "absent",
                  }),
                  {
                    pending: getLang().waitAMinute,
                    success: getLang().succeed,
                    error: getLang().failed,
                  }
                )
              )(e)
            }
          >
            <RiSave2Line />
            <span>{getLang().save}</span>
          </Button>
        </Modal>
      )}
    </Fragment>
  );
}
