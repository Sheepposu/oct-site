import { AchievementTeamType } from "src/api/types/AchievementTeamType";
import "src/assets/css/achievements/teams.css";

export default function TeamCard({ team }: { team: AchievementTeamType }) {
  return (
    <div className="teams-card-container">
      <p className="teams-placement">#1</p>
      <div className="teams-divider">
        <div style={{ display: "flex", alignItems: "center" }}>
          <div className="teams-icon"></div>
          <p className="teams-team-name">{team.name}</p>
        </div>
        <div className="teams-points-container">
          <p className="teams-points">5</p>
        </div>
      </div>
    </div>
  );
}
