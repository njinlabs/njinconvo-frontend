import { Fragment, useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import {
  RiAddCircleFill,
  RiCloseFill,
  RiDeleteBin2Line,
  RiPencilLine,
  RiSave2Line,
} from "react-icons/ri";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import show from "../../apis/classroom/meeting/show";
import store, {
  LinkType,
  MeetingParams,
} from "../../apis/classroom/meeting/store";
import Button from "../../components/Button";
import MarkdownField from "../../components/form/MarkdownField";
import SwitchField from "../../components/form/SwitchField";
import TextField from "../../components/form/TextField";
import getLang from "../../languages";
import { useAppDispatch } from "../../redux/hooks";
import { setWeb } from "../../redux/slices/web";
import { useFetcher } from "../../utilities/fetcher";
import MDEditor from "@uiw/react-md-editor";
import NotAllowed from "../../components/NotAllowed";
import update from "../../apis/classroom/meeting/update";
import List from "../../components/List";
import MiniButton from "../../components/MiniButton";
import Modal from "../../components/modal";
import { useModal } from "../../components/modal/useModal";
import { DropdownItem } from "../../components/dropdown";

const defaultValues: MeetingParams = {
  title: "",
  description: "",
  is_draft: true,
  links: [],
};

const linkDefaultValues: LinkType = {
  rowId: "",
  title: "",
  url: "",
};

export default function Meeting({ autoEdit = true }: { autoEdit?: boolean }) {
  const [edit, setEdit] = useState(autoEdit);
  const navigate = useNavigate();
  const { control: _composeLink } = useModal({});

  const dispatch = useAppDispatch();
  const { classroomId, id } = useParams();
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
    append,
    fields,
    update: updateLink,
    remove,
  } = useFieldArray({
    control,
    name: "links",
  });

  const showFetcher = useFetcher({
    api: show,
  });

  const storeFetcher = useFetcher({
    api: store,
    onSuccess: (data) => {
      setEdit(false);
      navigate(`/classroom/${classroomId}/meeting/${data.id}`, {
        replace: true,
      });
    },
  });

  const updateFetcher = useFetcher({
    api: update,
    onSuccess: () => {
      setEdit(false);
      showFetcher.process({ id: id!, classroomId: classroomId! });
    },
  });

  useEffect(() => {
    dispatch(
      setWeb({
        pageTitle: showFetcher.data?.id
          ? showFetcher.data?.title
          : getLang().newMeeting,
      })
    );

    if (showFetcher.data) {
      reset({
        ...showFetcher.data,
        links: (showFetcher.data?.links || []).map(
          ({ id, ...item }: LinkType) => ({ rowId: id, ...item })
        ),
      });
    }
  }, [showFetcher.data]);

  useEffect(() => {
    if (classroomId && id) {
      showFetcher.process({ id, classroomId });
    }
  }, [classroomId, id]);

  if (!autoEdit && !showFetcher.data && !showFetcher.isLoading)
    return <NotAllowed />;

  return (
    <Fragment>
      <div className="flex-1 relative">
        <div className="flex justify-start items-stretch absolute top-0 left-0 w-full h-full">
          <div className="flex-1 border-r border-gray-300 h-full flex flex-col">
            <div className="flex-1 border-b border-gray-300 relative">
              <div className="absolute top-0 left-0 w-full h-full overflow-auto p-5">
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
                      {showFetcher.data?.title}
                    </div>
                    <MDEditor.Markdown
                      source={showFetcher.data?.description}
                      className="mt-5 !prose !max-w-full !text-gray-600 !font-roboto"
                    />
                  </Fragment>
                )}
              </div>
            </div>
            {(showFetcher.data?.classroom?.classroom_role === "teacher" ||
              autoEdit) && (
              <div className="flex justify-between items-center p-5">
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
                        />
                      )}
                    />
                    <div className="flex items-center justify-end space-x-5">
                      {!autoEdit && (
                        <Button
                          element={"button"}
                          type="button"
                          color="basic"
                          className="flex justify-start items-center space-x-2"
                          onClick={() => setEdit(false)}
                        >
                          <RiCloseFill />
                          <span>{getLang().cancel}</span>
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
                          handleSubmit(({ links, ...data }) => {
                            toast.promise(
                              showFetcher.data?.id
                                ? updateFetcher.process({
                                    ...data,
                                    links: links?.map((item) => ({
                                      ...item,
                                      id: item.rowId,
                                    })),
                                    classroom_id: classroomId,
                                    id,
                                  })
                                : storeFetcher.process({
                                    ...data,
                                    links: links?.map((item) => ({
                                      id: item.rowId,
                                      ...item,
                                    })),
                                    classroom_id: classroomId,
                                  }),
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
                        <span>{getLang().save}</span>
                      </Button>
                    </div>
                  </Fragment>
                ) : (
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
                )}
              </div>
            )}
          </div>
          <div className="w-1/3 relative">
            <div className="absolute top-0 left-0 w-full h-full overflow-auto space-border-b">
              {(showFetcher.data?.links?.length || edit) && (
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
                  {(edit ? fields.length : showFetcher.data?.links?.length) ? (
                    <div className="flex flex-col justify-start space-y-3 mb-5">
                      {(
                        ((edit
                          ? fields
                          : showFetcher.data?.links) as Array<any>) || []
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
    </Fragment>
  );
}
