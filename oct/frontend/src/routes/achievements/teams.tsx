import AnimatedPage from "src/AnimatedPage";
import { useGetTeam, useGetTeams } from "src/api/query";
import { AchievementTeamType } from "src/api/types/AchievementTeamType";
import "src/assets/css/achievements/teams.css";
import "src/assets/css/tournaments/tournament/index.css";
import Button from "src/components/Button";

import TeamCard from "src/components/achievements/TeamCard";
import { useSession } from "src/util/auth";

export default function TeamsCard() {
  const session = useSession();

  const teamsResponse = useGetTeams();
  const teams = teamsResponse.data;

  const ownTeamResponse = useGetTeam();
  const ownTeam = ownTeamResponse.data as AchievementTeamType;
  console.log(ownTeamResponse.isLoading);

  return (
    <div className="info-container">
      <h1 className="info-title">Teams</h1>
      <p className="info-subtitle">Your Team</p>
      <div className="info-your-team-container">
        {session.isAuthenticated == false ? (
          <div className="teams-card-container">Not Authenticated.</div>
        ) : ownTeamResponse.isLoading ? (
          <div>Loading</div>
        ) : (
          <AnimatedPage>
            <TeamCard team={ownTeam} />
          </AnimatedPage>
        )}

        <div className="info-buttons-container">
          <div>
            <Button color="#06c926">Create Team</Button>
          </div>
          <div>
            <form>
              <input type="text" style={{ marginRight: "8px" }} />
              <Button type="submit">Join Team</Button>
            </form>
          </div>
        </div>
      </div>
      <p className="info-subtitle">Teams</p>
      <div className="info-teams-container">
        {teams?.map((team, index) => (
          <AnimatedPage>
            <TeamCard key={index} team={team} />
          </AnimatedPage>
        ))}
      </div>
    </div>
  );
}
