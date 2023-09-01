import moment from "moment";
import index from "../../apis/user";
import Table from "../../components/table/Table";
import { UserData } from "../../redux/slices/user";
import { useFetcher } from "../../utilities/fetcher";
import { Fragment, useEffect } from "react";
import {
  RiUser6Fill,
  RiPencilLine,
  RiDeleteBin2Line,
  RiAddBoxLine,
} from "react-icons/ri";
import MiniButton from "../../components/MiniButton";
import { useAppDispatch } from "../../redux/hooks";
import { setWeb } from "../../redux/slices/web";
import getLang from "../../languages";
import Modal from "../../components/modal";
import { useModal } from "../../components/modal/useModal";
import Button from "../../components/Button";
import TextField from "../../components/form/TextField";
import { BasicSelectField } from "../../components/form/select-field";
import DateField from "../../components/form/DateField";
import { useForm, Controller } from "react-hook-form";
import store from "../../apis/user/store";
import { toast } from "react-toastify";

const defaultValues: UserData = {
  fullname: "",
  email: "",
  password: "",
  gender: "",
  role: "",
  birthday: "",
};

export default function User() {
  const dispatch = useAppDispatch();
  const { control: _composeModal } = useModal({});
  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues,
  });

  const storeUserFetcher = useFetcher({
    api: store,
    onSuccess: () => {
      _composeModal.close();
      userFetcher.process({});
    },
  });

  const userFetcher = useFetcher({
    api: index,
  });

  useEffect(() => {
    userFetcher.process({});
    dispatch(
      setWeb({
        active: "User",
      })
    );
  }, []);

  return (
    <Fragment>
      <Table
        loading={userFetcher.isLoading}
        data={(userFetcher.data?.data || []) as UserData[]}
        buttons={
          <Fragment>
            <Button
              element={"button"}
              type="button"
              color="green"
              onClick={() => {
                reset(defaultValues);
                _composeModal.open();
              }}
              className="flex items-center"
            >
              <RiAddBoxLine className="text-base lg:text-sm m-0 lg:mr-2" />
              <span className="hidden lg:block">{getLang().new}</span>
            </Button>
          </Fragment>
        }
        columns={[
          "indexing",
          {
            key: "avatar",
            label: getLang().photo,
            render: (value) => (
              <div className="w-8 h-8 rounded-full bg-primary-100 relative overflow-hidden flex justify-center items-center">
                {value ? (
                  <img
                    src={value as string}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <RiUser6Fill className="text-xl text-primary-500" />
                )}
              </div>
            ),
          },
          {
            key: "fullname",
            label: getLang().fullname,
            props: {
              style: {
                width: 300,
              },
            },
          },
          {
            key: "email",
            label: getLang().email,
          },
          {
            key: "gender",
            label: getLang().gender,
            render: (value) =>
              getLang()[value as keyof ReturnType<typeof getLang>],
          },
          {
            key: "role",
            label: getLang().role,
            render: (value) =>
              getLang()[value as keyof ReturnType<typeof getLang>],
          },
          {
            key: "birthday",
            label: getLang().birthday,
            render: (value) => moment(value as string).format("DD/MM/YYYY"),
          },
          {
            key: null,
            label: getLang().action,
            action: true,
            render: () => (
              <div className="flex items-center justify-start space-x-2">
                <MiniButton element={"button"} type="button" color="yellow">
                  <RiPencilLine className="text-lg" />
                </MiniButton>
                <MiniButton element={"button"} type="button" color="red">
                  <RiDeleteBin2Line className="text-lg" />
                </MiniButton>
              </div>
            ),
          },
        ]}
      />
      <Modal control={_composeModal} title={getLang().addUser}>
        <form
          onSubmit={handleSubmit((data) =>
            toast.promise(storeUserFetcher.process(data), {
              pending: getLang().waitAMinute,
              success: getLang().succeed,
              error: getLang().failed,
            })
          )}
        >
          <TextField
            type="text"
            label={getLang().fullname}
            containerClassName="mb-5"
            message={errors.fullname?.message}
            {...register("fullname", { required: getLang().requiredMsg })}
          />
          <TextField
            type="email"
            label={getLang().email}
            containerClassName="mb-5"
            message={errors.email?.message}
            {...register("email", { required: getLang().requiredMsg })}
          />
          <TextField
            type="password"
            label={getLang().password}
            containerClassName="mb-5"
            {...register("password")}
          />
          <Controller
            control={control}
            name="gender"
            rules={{ required: getLang().requiredMsg }}
            render={({ field: { value, onChange } }) => (
              <BasicSelectField
                value={value}
                onChange={(value) => onChange((value as any).value)}
                label={getLang().gender}
                message={errors.gender?.message}
                containerClassName="mb-5"
                options={[
                  {
                    value: "male",
                    label: getLang().male,
                  },
                  {
                    value: "female",
                    label: getLang().female,
                  },
                ]}
              />
            )}
          />
          <Controller
            control={control}
            name="role"
            rules={{ required: getLang().requiredMsg }}
            render={({ field: { value, onChange } }) => (
              <BasicSelectField
                value={value}
                onChange={(val) => onChange((val as any).value)}
                message={errors.role?.message}
                label={getLang().role}
                containerClassName="mb-5"
                options={[
                  {
                    value: "administrator",
                    label: getLang().administrator,
                  },
                  {
                    value: "teacher",
                    label: getLang().teacher,
                  },
                  {
                    value: "student",
                    label: getLang().student,
                  },
                ]}
              />
            )}
          />
          <DateField
            label={getLang().birthday}
            containerClassName="mb-5"
            message={errors.birthday?.message}
            {...register("birthday", { required: getLang().requiredMsg })}
          />
          <Button
            type="submit"
            element="button"
            className="w-full"
            disabled={storeUserFetcher.isLoading}
          >
            {getLang().add}
          </Button>
        </form>
      </Modal>
    </Fragment>
  );
}
