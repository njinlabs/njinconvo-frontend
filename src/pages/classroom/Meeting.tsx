import { Fragment, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { RiCloseFill, RiPencilLine, RiSave2Line } from "react-icons/ri";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import show from "../../apis/classroom/meeting/show";
import store, { MeetingParams } from "../../apis/classroom/meeting/store";
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

const defaultValues: MeetingParams = {
  title: "",
  description: "",
  is_draft: true,
};

export default function Meeting({ autoEdit = true }: { autoEdit?: boolean }) {
  const [edit, setEdit] = useState(autoEdit);
  const navigate = useNavigate();

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
      reset(showFetcher.data);
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
    <div className="flex-1 relative">
      <div className="flex justify-start items-start absolute top-0 left-0 w-full h-full">
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
                    {...register("title", { required: getLang().requiredMsg })}
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
                      onClick={(e: React.BaseSyntheticEvent) =>
                        handleSubmit((data) =>
                          toast.promise(
                            showFetcher.data?.id
                              ? updateFetcher.process({
                                  ...data,
                                  classroom_id: classroomId,
                                  id,
                                })
                              : storeFetcher.process({
                                  ...data,
                                  classroom_id: classroomId,
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
        <div className="w-1/3"></div>
      </div>
    </div>
  );
}
