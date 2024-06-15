import { useGetAchievements, useGetTeams } from "src/api/query";
import AchievementContainer from "src/components/achievements/AchievementContainer";
import AchievementLeaderboard from "src/components/achievements/AchievementLeaderboard";
import AchievementProgress, { WebsocketState } from "src/components/achievements/AchievementProgress";

import "src/assets/css/achievements/completion.css";
import { useContext, useEffect, useState } from "react";
import { SessionContext } from "src/contexts/SessionContext";
import { Helmet } from "react-helmet";
import { AchievementTeamExtendedType, AchievementTeamType } from "src/api/types/AchievementTeamType";

const EVENT_START = 1718416800000;

function getMyTeam(teams?: Array<AchievementTeamExtendedType | AchievementTeamType>): AchievementTeamExtendedType | null {
  if (teams !== undefined)
    for (const team of teams) {
      if ("invite" in team) {
        return team as AchievementTeamExtendedType;
      }
  }

  return null;
}

function HiddenAchievementCompletionPage({ time }: { time: number }) {
  const delta = EVENT_START - time;

  const days = Math.floor((delta / (1000 * 60 * 60 * 24)) % 60);
  const hours = Math.floor((delta / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((delta / (1000 * 60)) % 60);
  const seconds = Math.floor((delta / 1000) % 60);
  const timeString = [days, hours, minutes, seconds]
    .map((n) => (n < 10 ? "0" + n : "" + n))
    .join(":");

  return (
    <div style={{ margin: "auto", textAlign: "center", marginTop: "50px" }}>
      <Helmet>
        <title>{timeString}</title>
      </Helmet>
      <h1 style={{ fontSize: "100px" }}>Starts in {timeString}</h1>
    </div>
  );
}

function LimitedAchievementCompletionPage({ team }: { team: AchievementTeamExtendedType | null }) {
  return (
    <div className="page-container">
      <Helmet>
        <title>OCAH Achievements</title>
      </Helmet>
      <AchievementContainer team={team} />
      <div className="progress-container">
        <AchievementLeaderboard />
      </div>
    </div>
  );
}

function FullAchievementCompletionPage(
  {
    team,
    state,
    setState
  }:
  {
    team: AchievementTeamExtendedType | null,
    state: WebsocketState | null,
    setState: React.Dispatch<React.SetStateAction<WebsocketState | null>>
  }) {
  return (
    <div className="page-container">
      <Helmet>
        <title>OCAH Achievements</title>
      </Helmet>
      <AchievementContainer team={team} />
      <div className="progress-container">
        <AchievementProgress state={state} setState={setState} team={team} />
        <AchievementLeaderboard />
      </div>
    </div>
  );
}

export default function AchievementCompletionPage() {
  const session = useContext(SessionContext);

  useGetAchievements(false);
  const { data: teams } = useGetTeams();
  const team = getMyTeam(teams);

  const [time, setTime] = useState<number>(Date.now());
  const [state, setState] = useState<WebsocketState | null>(null);

  useEffect(() => {
    if (time >= EVENT_START || session.debug) {
      return;
    }

    const intervalId = setInterval(() => setTime(Date.now()), 1000);
    return () => clearInterval(intervalId);
  });

  if (time < EVENT_START && !session.debug) {
    return <HiddenAchievementCompletionPage time={time} />;
  }

  return (
    team !== null
      ? <FullAchievementCompletionPage state={state} setState={setState} team={team} />
      : <LimitedAchievementCompletionPage team={team} />
  );
}
