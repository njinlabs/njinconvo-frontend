import { Fragment, useEffect } from "react";
import { RiEyeLine } from "react-icons/ri";
import index from "../../apis/group";
import MiniButton from "../../components/MiniButton";
import { useModal } from "../../components/modal/useModal";
import Table from "../../components/table/Table";
import getLang from "../../languages";
import { useAppDispatch } from "../../redux/hooks";
import { setWeb } from "../../redux/slices/web";
import { useFetcher } from "../../utilities/fetcher";
import { Link } from "react-router-dom";

export default function List() {
  const dispatch = useAppDispatch();
  const { control: _composeModal, state: _composeState } = useModal<{
    edit: boolean;
  }>({ initialState: { edit: false } });

  const indexGroupFetcher = useFetcher({
    api: index,
  });

  useEffect(() => {
    dispatch(
      setWeb({
        active: "group",
        pageTitle: getLang().group,
      })
    );
    indexGroupFetcher.process({});
  }, []);

  return (
    <Fragment>
      <Table
        loading={indexGroupFetcher.isLoading}
        data={indexGroupFetcher.data?.data || []}
        columns={[
          "indexing",
          {
            key: "name",
            label: getLang().name,
          },
          {
            key: "code",
            label: getLang().groupCode,
          },
          {
            key: "lead",
            label: getLang().lead,
            render: (value, _) => value?.fullname,
          },
          {
            key: "participants",
            label: getLang().participants,
            render: (value, _) => `${value} Peserta`,
          },
          {
            key: null,
            label: "",
            props: {
              width: 36,
            },
            action: true,
            render: (_, index) => (
              <MiniButton
                element={Link}
                to={"/group/" + indexGroupFetcher.data?.data[index]?.id}
                color="yellow"
                className="flex justify-start space-x-1 items-center"
              >
                <RiEyeLine className="text-lg" />
                <span>Lihat</span>
              </MiniButton>
            ),
          },
        ]}
        pageTotal={indexGroupFetcher.data?.page_total}
        onPageChanged={(page) =>
          indexGroupFetcher.withoutReset().process({ page })
        }
        onSearch={(search) =>
          indexGroupFetcher.remember().process({
            ...(indexGroupFetcher.savedProps || {}),
            search,
          })
        }
        sortValues={[
          {
            label: getLang().name,
            value: "name",
          },
          {
            label: getLang().groupCode,
            value: "code",
          },
          {
            label: getLang().participants,
            value: "users_count",
          },
        ]}
        onSort={(sort) =>
          indexGroupFetcher.remember().process({
            ...(indexGroupFetcher.savedProps || {}),
            order: sort?.order,
            direction: sort?.direction,
          })
        }
      />
    </Fragment>
  );
}
