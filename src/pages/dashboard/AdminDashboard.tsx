import moment from "moment";
import { useEffect, useMemo } from "react";
import { AxisOptions, Chart } from "react-charts";
import {
  RiGroup2Line,
  RiPresentationLine,
  RiUser2Line,
  RiUser6Line,
} from "react-icons/ri";
import index from "../../apis/stats";
import StatsCard from "../../components/StatsCard";
import getLang from "../../languages";
import { useFetcher } from "../../utilities/fetcher";

type AccessesStat = {
  date: Date;
  total: number;
};

export default function AdminDashboard() {
  const statsFetcher = useFetcher({
    api: index,
  });

  useEffect(() => {
    statsFetcher.process({});
  }, []);

  const primaryAx = useMemo(
    (): AxisOptions<AccessesStat> => ({
      getValue: (datum) => datum.date,
    }),
    [statsFetcher.data]
  );

  const secondaryAx = useMemo(
    (): AxisOptions<AccessesStat>[] => [
      {
        getValue: (datum) => datum.total,
      },
    ],
    [statsFetcher.data]
  );

  if (!statsFetcher.data) return null;

  return (
    <div className="flex-1 relative overflow-auto">
      <div className="flex flex-col lg:flex-row justify-start items-start lg:items-stretch absolute top-0 left-0 w-full h-auto lg:h-full">
        <div className="border-b lg:border-b-0 border-r-0 lg:border-r border-gray-400 flex-0 lg:flex-1 h-64 lg:h-full p-5 order-2 lg:order-1 w-full">
          <div className="w-full h-full">
            <Chart
              options={{
                data: [
                  {
                    label: getLang().access,
                    data: (statsFetcher.data?.access_stats || []).map(
                      (data: { date: string; total: number }) => ({
                        date: moment(data.date).toDate(),
                        total: data.total,
                      })
                    ),
                  },
                ],
                primaryAxis: primaryAx,
                secondaryAxes: secondaryAx,
              }}
            />
          </div>
        </div>
        <div className="w-full lg:w-1/4 p-5 overflow-auto h-auto order-1 lg:order-2">
          <div className="grid grid-cols-1 grid-flow-row gap-5">
            <StatsCard
              icon={RiUser2Line}
              value={statsFetcher.data?.leads_count}
              label={getLang().lead}
              colorClass="bg-primary-100 border border-primary-200 text-primary-600"
            />
            <StatsCard
              icon={RiUser6Line}
              value={statsFetcher.data?.participants_count}
              label={getLang().participants}
              colorClass="bg-primary-100 border border-primary-200 text-primary-600"
            />
            <StatsCard
              icon={RiGroup2Line}
              value={statsFetcher.data?.groups_count}
              label={getLang().group}
              colorClass="bg-primary-100 border border-primary-200 text-primary-600"
            />
            <StatsCard
              icon={RiPresentationLine}
              value={statsFetcher.data?.meetings_count}
              label={getLang().meeting}
              colorClass="bg-primary-100 border border-primary-200 text-primary-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
