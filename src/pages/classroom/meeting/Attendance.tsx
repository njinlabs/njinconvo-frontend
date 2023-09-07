import { Fragment, useEffect, BaseSyntheticEvent } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useOutletContext } from "react-router-dom";
import DateTimeField from "../../../components/form/DateTimeFields";
import SwitchField from "../../../components/form/SwitchField";
import getLang from "../../../languages";
import { useAppDispatch } from "../../../redux/hooks";
import { setWeb } from "../../../redux/slices/web";
import { useFetcher } from "../../../utilities/fetcher";
import participants from "../../../apis/classroom/participants";
import AttendanceField from "../../../components/form/AttendanceField";
import Button from "../../../components/Button";
import { RiSave2Line } from "react-icons/ri";
import show from "../../../apis/classroom/meeting/attendance/show";
import store, {
  AttendaceDetailType,
  AttendanceParams,
} from "../../../apis/classroom/meeting/attendance/store";
import { toast } from "react-toastify";
import moment from "moment";

const defaultValues: AttendanceParams = {
  allow_self_attendance: false,
  show_it_to_participants: false,
  details: [],
};

export default function Attendance() {
  const { meeting, classroom } = useOutletContext<{
    meeting: any;
    classroom: any;
  }>();
  const dispatch = useAppDispatch();
  const {
    control,
    register,
    watch,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  const { fields, append } = useFieldArray({
    control,
    name: "details",
  });

  const participantsFetcher = useFetcher({
    api: participants,
  });

  const attendanceFetcher = useFetcher({
    api: show,
    onSuccess: (data) => {
      reset({
        allow_self_attendance: data.allow_self_attendance,
        self_attendance_due: moment(data.self_attendance_due).format(
          "YYYY-MM-DD HH:mm"
        ),
        show_it_to_participants: data.show_it_to_participants,
        details: ((data.details as Array<any>) || []).map((detail) => ({
          user_id: detail.user_id,
          status: detail.status,
        })),
      });
    },
  });

  const saveFetcher = useFetcher({
    api: store,
  });

  useEffect(() => {
    dispatch(
      setWeb({
        pageTitle: `${getLang().attendance} ${meeting.title}`,
      })
    );
  }, [meeting]);

  useEffect(() => {
    participantsFetcher.process({ id: classroom.id });
  }, [classroom]);

  useEffect(() => {
    if (classroom.id && meeting.id) {
      attendanceFetcher.process({ classroomId: classroom.id, id: meeting.id });
    }
  }, [classroom, meeting]);

  return (
    <Fragment>
      <div className="flex-1 relative">
        <div className="block lg:flex justify-start items-stretch absolute top-0 left-0 w-full h-full overflow-auto lg:overflow-hidden">
          <div className="flex-1 border-r border-gray-300 h-auto lg:h-full flex flex-col">
            <div className="flex-1 border-b border-gray-300 relative order-2 lg:order-1">
              <div className="static lg:absolute top-0 left-0 w-full h-full overflow-auto space-border-b">
                {((participantsFetcher.data as Array<any>) || [])
                  .filter((item) => item.classroom_role === "student")
                  .map((item, index) => {
                    const findIndex = fields.findIndex(
                      (el) => el.user_id === item.id
                    );
                    if (findIndex < 0)
                      return (
                        <AttendanceField
                          name={item.fullname}
                          onChange={(value) =>
                            append({
                              user_id: item.id,
                              status: value as AttendaceDetailType["status"],
                            })
                          }
                        />
                      );
                    return (
                      <Controller
                        control={control}
                        name={`details.${findIndex}.status`}
                        key={`${index}`}
                        render={({ field: { value, onChange } }) => (
                          <AttendanceField
                            status={value}
                            onChange={onChange}
                            name={item.fullname}
                            key={`${index}`}
                          />
                        )}
                      />
                    );
                  })}
              </div>
            </div>
            <div className="flex justify-between items-center p-5 sticky lg:static top-0 left-0 w-full bg-white border-b border-gray-300 lg:border-b-0 order-1 lg:order-2">
              <Button
                type="button"
                element={"button"}
                onClick={(
                  e: BaseSyntheticEvent<object, any, any> | undefined
                ) =>
                  handleSubmit(({ self_attendance_due, ...data }) =>
                    toast.promise(
                      saveFetcher.process({
                        classroomId: classroom.id,
                        id: meeting.id,
                        self_attendance_due: moment(self_attendance_due).format(
                          "YYYY-MM-DD HH:mm:ss"
                        ),
                        ...data,
                      }),
                      {
                        pending: getLang().waitAMinute,
                        error: getLang().failed,
                        success: getLang().succeed,
                      }
                    )
                  )(e)
                }
                disabled={saveFetcher.isLoading}
                className="flex justify-start items-center space-x-2"
              >
                <RiSave2Line />
                <span>{getLang().save}</span>
              </Button>
            </div>
          </div>
          <div className="w-full lg:w-1/3 relative">
            <div className="static lg:absolute top-0 left-0 w-full h-full overflow-auto space-border-b">
              <div className="p-5">
                <Controller
                  control={control}
                  name="allow_self_attendance"
                  render={({ field: { value, onChange } }) => (
                    <SwitchField
                      label={getLang().allowSelfAttendance}
                      value={value}
                      onChange={onChange}
                    />
                  )}
                />
                {watch("allow_self_attendance") && (
                  <DateTimeField
                    containerClassName="mt-5"
                    label={getLang().selfAttendanceDue}
                    message={errors.self_attendance_due?.message}
                    {...register("self_attendance_due", {
                      required: getLang().requiredMsg,
                    })}
                  />
                )}
              </div>
              <div className="p-5">
                <Controller
                  control={control}
                  name="show_it_to_participants"
                  render={({ field: { value, onChange } }) => (
                    <SwitchField
                      label={getLang().showItToParticipants}
                      value={value}
                      onChange={onChange}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
