import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserSessionContext } from "src/UserSessionProvider";
import LoadingPlaceholder from "src/components/LoadingPlaceholder";
import { DashboardType } from "src/types/DashboardType";
import axios from "axios";
import MatchCard from "src/components/MatchCard";

export default function Dashboard() {
  const { session, loading } = useContext(UserSessionContext);

  const fetchDashboardData = (): Promise<DashboardType> =>
    axios.get("/api/dashboard").then((resp) => resp.data);

  const dashboardQuery = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboardData,
  });

  if (loading || dashboardQuery.isPending) {
    return <LoadingPlaceholder />;
  }

  if (dashboardQuery.error) {
    return (
      <div>
        An error has occured while loading the dashboard:
        {dashboardQuery.error.message}
        <Link to={"/"}>
          <div>Go back home.</div>
        </Link>
      </div>
    );
  }

  const data = dashboardQuery.data;
  const matches = data.response.matches;

  return (
    <div>
      <div className="p-8 h-48 flex justify-center">
        <img
          src={session?.user?.osu_avatar}
          className="h-full relative z-20 rounded-full"
        />
        <div className="relative h-full w-5/6 flex justify-center">
          <div
            id="dashboard-card-cover"
            className={`h-full w-5/6 rounded-full z-20 absolute justify-center flex flex-col`}
          ></div>
          <img
            className="h-full w-5/6 rounded-full z-10 absolute"
            src={session?.user?.osu_cover}
          />
        </div>
        <p className="font-extrabold italic text-5xl whitespace-nowrap overflow-hidden overflow-ellipsis">
          {session?.user?.osu_username}
        </p>
        <p>Roles</p>
      </div>
      <div className="w-full h-[500px] items-center justify-center flex flex-col">
        <div className="w-5/6 h-full flex flex-grow flex-col items-center rounded-xl bg-[#E8E7E7]">
          <p className="font-bold pt-[20px] text-3xl">Matches</p>
          <div className="w-[95%] h-full overflow-y-scroll overflow-x-hidden">
            <div className="w-[calc(100%-50px)] py-0 px-5 flex flex-col items-center gap-3">
              {matches.length > 0 ? (
                matches.map((match, index) => (
                  <MatchCard key={index} match={match} />
                ))
              ) : (
                <p className="text-black font-extrabold text-7xl">No Matches</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
