import moment from "moment";
import { Fragment, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  RiAddBoxLine,
  RiDeleteBin2Line,
  RiPencilLine,
  RiUser6Fill,
} from "react-icons/ri";
import { toast } from "react-toastify";
import index from "../../apis/user";
import destroy from "../../apis/user/destroy";
import store from "../../apis/user/store";
import update from "../../apis/user/update";
import Button from "../../components/Button";
import MiniButton from "../../components/MiniButton";
import DateField from "../../components/form/DateField";
import TextField from "../../components/form/TextField";
import { BasicSelectField } from "../../components/form/select-field";
import Modal from "../../components/modal";
import { useModal } from "../../components/modal/useModal";
import Table from "../../components/table/Table";
import getLang from "../../languages";
import { useAppDispatch } from "../../redux/hooks";
import { UserData } from "../../redux/slices/user";
import { setWeb } from "../../redux/slices/web";
import { useFetcher } from "../../utilities/fetcher";
import { warningAlert } from "../../utilities/sweet-alert";

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
  const { control: _composeModal, state: _composeState } = useModal<{
    edit: boolean;
  }>({ initialState: { edit: false } });
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

  const updateUserFetcher = useFetcher({
    api: update,
    onSuccess: () => {
      _composeModal.close();
      userFetcher.process({});
    },
  });

  const userFetcher = useFetcher({
    api: index,
  });

  const destroyFetcher = useFetcher({
    api: destroy,
    onSuccess: () => {
      userFetcher.process({});
    },
  });

  useEffect(() => {
    userFetcher.process({});
    dispatch(
      setWeb({
        active: "user",
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
                _composeModal.open({ edit: false });
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
            render: (_, index) => (
              <div className="flex items-center justify-start space-x-2">
                <MiniButton
                  element={"button"}
                  type="button"
                  color="yellow"
                  onClick={() => {
                    const { birthday, ...data } = userFetcher.data.data[index];
                    reset({
                      birthday: moment(birthday).format("YYYY-MM-DD"),
                      ...data,
                    });
                    _composeModal.open({ edit: true });
                  }}
                >
                  <RiPencilLine className="text-lg" />
                </MiniButton>
                <MiniButton
                  element={"button"}
                  type="button"
                  color="red"
                  onClick={() =>
                    warningAlert({
                      title: getLang().sure,
                      text: getLang().destroyUser,
                      showCancelButton: true,
                      cancelButtonText: getLang().cancel,
                      confirmButtonText: getLang().yesConfirm,
                    }).then((value) => {
                      if (value.isConfirmed) {
                        toast.promise(
                          destroyFetcher.process({
                            id: userFetcher.data.data[index].id,
                          }),
                          {
                            success: getLang().succeed,
                            pending: getLang().waitAMinute,
                            error: getLang().failed,
                          }
                        );
                      }
                    })
                  }
                >
                  <RiDeleteBin2Line className="text-lg" />
                </MiniButton>
              </div>
            ),
          },
        ]}
      />
      <Modal
        control={_composeModal}
        title={_composeState.edit ? getLang().editUser : getLang().addUser}
      >
        <form
          onSubmit={handleSubmit((data) =>
            toast.promise(
              _composeState.edit
                ? updateUserFetcher.process(data)
                : storeUserFetcher.process(data),
              {
                pending: getLang().waitAMinute,
                success: getLang().succeed,
                error: getLang().failed,
              }
            )
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
            disabled={storeUserFetcher.isLoading || updateUserFetcher.isLoading}
          >
            {_composeState.edit ? getLang().edit : getLang().add}
          </Button>
        </form>
      </Modal>
    </Fragment>
  );
}
