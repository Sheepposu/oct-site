import { AchievementTeamType } from "src/api/types/AchievementTeamType";
import "src/assets/css/achievements/teams.css";

export default function TeamCard({
  team,
  hidePlayers,
  placement
}: {
  team: AchievementTeamType;
  hidePlayers: boolean;
  placement: number;
}) {
  return (
    <div className="teams-card-container">
      <div className="teams-card-info-container">
        <p className={`teams-placement n${placement}`}>
          {placement}
        </p>
        {/* <div className="teams-icon"></div> */}
        <p className="teams-team-name">{team.name}</p>
        <p className="teams-points">{team.points}</p>
      </div>
      {hidePlayers ? (
        ""
      ) : (
        team.players.map((player) => (
          <div className="teams-card-player">
            <img
              src={player.user.osu_avatar}
              className="teams-card-player-image"
            />
            <p className="teams-card-player-text">
              {player.user.osu_username}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
