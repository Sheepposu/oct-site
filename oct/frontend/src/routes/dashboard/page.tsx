import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserSessionContext } from "src/UserSessionProvider";
import LoadingPlaceholder from "src/components/LoadingPlaceholder";
import { DashboardType } from "src/types/DashboardType";
import axios from "axios";
import MatchCard from "src/components/MatchCard";

import "src/assets/css/dashboard.css";

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

  return (
    <div>
      <div className="user-card-container">
        <img src={session?.user?.osu_avatar} className="user-card-pfp" />
        <div
          className="user-card-info"
          style={{
            backgroundImage: `linear-gradient(to right, #F6F6F6 40%, transparent), ${session?.user?.osu_cover}`,
          }}
        >
          <p className="user-card-username">{session?.user?.osu_username}</p>
          <p>Roles: Figure this out</p>
        </div>
      </div>

      <div className="matches-box-container">
        <div className="matches-box">
          <p className="box-header-text">Matches</p>
          <div className="scroll-container">
            <div className="matches-container">
              {data.length > 0 ? (
                data.map((match, index) => (
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
