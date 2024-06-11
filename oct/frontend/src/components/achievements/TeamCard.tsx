import { AchievementTeamType } from "src/api/types/AchievementTeamType";
import "src/assets/css/achievements/teams.css";

export default function TeamCard({ team }: { team: AchievementTeamType }) {
  let placementColor: string;
  switch (team.placement) {
    case 1:
      placementColor = "#fff419";
      break;
    case 2:
      placementColor = "#e3e3e3";
      break;
    case 3:
      placementColor = "#8a6500";
      break;
    default:
      placementColor = "#438efd";
      break;
  }
  return (
    <>
      <div className="teams-card-container">
        <p
          className="teams-placement"
          style={{ backgroundColor: placementColor }}
        >
          {team.placement}
        </p>
        <div className="teams-divider">
          <div style={{ display: "flex", alignItems: "center" }}>
            <div className="teams-icon"></div>
            <p className="teams-team-name">{team.name}</p>
          </div>
          <div className="teams-points-container">
            <p className="teams-points">{team.points}</p>
          </div>
        </div>
      </div>
      <div className="teams-card-players-container">
        {team.players.map((player) => (
          <div className="teams-card-player">
            <img
              src={player.user.osu_avatar}
              className="teams-card-player-image"
            />
            <p className="teams-card-player-text">{player.user.osu_username}</p>
          </div>
        ))}
      </div>
    </>
  );
}
