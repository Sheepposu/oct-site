import { useContext } from "react";
import { useGetTeams } from "src/api/query";
import { AchievementCompletionType } from "src/api/types/AchievementCompletionType";
import { AchievementPlayerExtendedType } from "src/api/types/AchievementPlayerType";
import { AchievementExtendedType } from "src/api/types/AchievementType";
import { SessionContext } from "src/contexts/SessionContext";

function timeAgo(timestamp: string) {
  const times: [number, string][] = [
    [60, "minute"],
    [60, "hour"],
    [24, "day"]
  ];
  const now = Date.now();
  const completion = Date.parse(timestamp);

  let leftover1 = Math.round((now - completion) / 1000);
  let label1 = "second";
  let leftover2: number | null = null;
  let label2: string | null = null;
  for (const [div, label] of times) {
    if (leftover1 < div) {
      break;
    }

    leftover2 = leftover1 % div;
    label2 = label1;
    leftover1 = Math.floor(leftover1 / div);
    label1 = label;
  }

  if (leftover1 !== 1) {
    label1 += "s";
  }

  if (leftover2 === null) {
    return `${leftover1} ${label1} ago`;
  }

  if (leftover2 !== 1) {
    label2 += "s";
  }

  return `${leftover1} ${label1} ${leftover2} ${label2} ago`;
}

export default function Achievement({
  achievement,
}: {
  achievement: AchievementExtendedType;
}) {
  const session = useContext(SessionContext);
  const { data: teams } = useGetTeams();
  const players: [AchievementPlayerExtendedType, AchievementCompletionType][] = [];
  let completed: boolean = false;

  // get players with achievement completed and check if team completed
  if (teams !== undefined) {
    for (const team of teams) {
      if (!("players" in team)) {
        continue;
      }

      let teamCompleted = false;
      let sameTeam = false;
      for (const player of team.players) {
        if (player.user.id === session.user?.id) {
          sameTeam = true;
        }

        for (const completion of player.completions) {
          if (completion.achievement_id === achievement.id) {
            players.push([player, completion]);
            teamCompleted = true;
            break;
          }
        }
      }

      if (teamCompleted && sameTeam) {
        completed = true;
      }
    }
  }

  const infoCls = "achievement-info-container" + (completed ? " complete" : " incomplete");

  return (
    <div className="achievement">
      <div className={infoCls}>
        <div className="achievement-info">
          <h1>{achievement.name}</h1>
          <p>
            {achievement.completions} completions | {achievement.description}
          </p>
        </div>
        <h1>{completed ? "Complete" : "Incomplete"}</h1>
      </div>
      {achievement.beatmap === null ? (
        ""
      ) : (
        <a
          href={`https://osu.ppy.sh/b/${achievement.beatmap.id}`}
          target="_blank"
        >
          <div className="achievement-details-container">
            <img
              className="achievement-details-cover"
              src={achievement.beatmap.cover}
            ></img>
            <div className="achievement-details-beatmap-info">
              <p className="achievement-details-beatmap-info-text">
                {achievement.beatmap.artist} - {achievement.beatmap.title}
              </p>
              <p className="achievement-details-beatmap-info-text">
                [{achievement.beatmap.version}]
              </p>
            </div>
            <h1 className="achievement-details-star-rating">
              {achievement.beatmap.star_rating}*
            </h1>
          </div>
        </a>
      )}
      { 
        players.length == 0 ? "" : <>
        <hr/>
        <div className="achievement-players-container">
          {
            players.map(
              ([player, completion]) => 
              <div className="achievement-players-entry">
                <img className="achievement-players-entry-pfp" src={player.user.osu_avatar}></img>
                <div>
                  <p><b>{player.user.osu_username}</b></p>
                  <p style={{fontSize: "14px"}}>{timeAgo(completion.time_completed)}</p>
                </div>
              </div>
            )
          }
        </div></>
      }
    </div>
  );
}
