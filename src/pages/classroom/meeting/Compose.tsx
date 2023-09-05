import { useEffect } from "react";
import { RiSave2Line } from "react-icons/ri";
import Button from "../../../components/Button";
import getLang from "../../../languages";
import { useAppDispatch } from "../../../redux/hooks";
import { setWeb } from "../../../redux/slices/web";
import TextField from "../../../components/form/TextField";
import MarkdownField from "../../../components/form/MarkdownField";
import { Controller, useForm } from "react-hook-form";
import store, { MeetingParams } from "../../../apis/classroom/meeting/store";
import { useFetcher } from "../../../utilities/fetcher";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import SwitchField from "../../../components/form/SwitchField";

const defaultValues: MeetingParams = {
  title: "",
  description: "",
  is_draft: true,
};

export default function Compose() {
  const dispatch = useAppDispatch();
  const { classroomId } = useParams();
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues,
  });

  const storeFetcher = useFetcher({
    api: store,
  });

  useEffect(() => {
    dispatch(
      setWeb({
        pageTitle: getLang().newMeeting,
      })
    );
  }, []);

  return (
    <div className="flex-1 relative">
      <div className="flex justify-start items-start absolute top-0 left-0 w-full h-full">
        <div className="flex-1 border-r border-gray-300 h-full flex flex-col">
          <div className="flex-1 border-b border-gray-300 relative">
            <div className="absolute top-0 left-0 w-full h-full overflow-auto p-5">
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
            </div>
          </div>
          <div className="flex justify-between items-center p-5">
            <Button
              element={"button"}
              type="button"
              className="flex justify-start items-center space-x-2"
              onClick={(e: React.BaseSyntheticEvent) =>
                handleSubmit((data) =>
                  toast.promise(
                    storeFetcher.process({
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
            <Controller
              control={control}
              name="is_draft"
              render={({ field: { value, onChange } }) => (
                <SwitchField
                  value={!value}
                  onChange={(value) => onChange(!value)}
                  labelPosition="left"
                  label={getLang().publish}
                />
              )}
            />
          </div>
        </div>
        <div className="w-1/3"></div>
      </div>
    </div>
  );
}
