import moment from "moment";
import index from "../../apis/user";
import Table from "../../components/table/table";
import { UserData } from "../../redux/slices/user";
import { useFetcher } from "../../utilities/fetcher";
import { useEffect } from "react";
import { RiUser6Fill, RiPencilLine, RiDeleteBin2Line } from "react-icons/ri";
import MiniButton from "../../components/MiniButton";
import { useAppDispatch } from "../../redux/hooks";
import { setWeb } from "../../redux/slices/web";
import getLang from "../../languages";

export default function User() {
  const dispatch = useAppDispatch();
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
    <Table
      loading={userFetcher.isLoading}
      data={(userFetcher.data?.data || []) as UserData[]}
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
          render: (value) => moment(value).format("DD/MM/YYYY"),
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
  );
}
