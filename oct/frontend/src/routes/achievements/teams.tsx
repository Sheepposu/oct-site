import { FormEvent, useContext } from "react";
import AnimatedPage from "src/AnimatedPage";
import { useCreateTeam, useGetTeams, useJoinTeam, useLeaveTeam } from "src/api/query";

import "src/assets/css/achievements/teams.css";
import "src/assets/css/tournaments/tournament/index.css";
import "src/assets/css/main.css";
import Button from "src/components/Button";

import TeamCard from "src/components/achievements/TeamCard";
import { SessionContext } from "src/contexts/SessionContext";
import { EventContext } from "src/contexts/EventContext";
import { MyAchievementTeamType } from "src/api/types/AchievementTeamType";

export default function TeamsCard() {
  const session = useContext(SessionContext);
  const dispatchEventMsg = useContext(EventContext);

  const teamsResponse = useGetTeams();
  const teams = teamsResponse.data;

  let ownTeam: MyAchievementTeamType | null = null;
  let ownPlacement: number | null = null;
  if (Array.isArray(teams))
    for (const [i, team] of teams.entries()) {
      if (team.invite !== undefined) {
        ownTeam = team as MyAchievementTeamType;
        ownPlacement = i + 1;
      }
    }

  const leaveTeam = useLeaveTeam();
  const joinTeam = useJoinTeam();
  const createTeam = useCreateTeam();

  const onCreateTeam = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    
    const name = (new FormData(evt.currentTarget)).get("name") as string;
    if (name.length < 1 || name.length > 32) {
      return dispatchEventMsg({type: "error", msg: "Team name must be between 1 and 32 characters"});
    }

    createTeam.mutate({name}, {
      onSuccess: () => createTeam.reset()
    });
  };

  const onJoinTeam = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    const invite = (new FormData(evt.currentTarget)).get("code") as string;
    if (invite === "") {
      return dispatchEventMsg({type: "error", msg: "Input an invite code first"});
    }

    joinTeam.mutate({invite}, {
      onSuccess: () => joinTeam.reset()
    });
  };

  const onLeaveTeam = () => {
    leaveTeam.mutate({}, {
      onSuccess: () => leaveTeam.reset()
    });
  };

  const copyInvite = () => {
    navigator.clipboard.writeText((ownTeam as MyAchievementTeamType).invite);
    dispatchEventMsg({
      type: "info",
      msg: "Copied team code to clipboard!",
    });
  };

  return (
    <div className="info-container">
      <h1 className="info-title">Teams</h1>
      <p className="info-subtitle">Your Team</p>
      <div className="info-your-team-container">
        {session.isAuthenticated == false ? (
          <div className="teams-card-container">
            <p style={{ paddingLeft: "20px" }}>Not authenticated.</p>
          </div>
        ) : teamsResponse.isLoading ? (
          <div className="teams-card-container" style={{ height: "130px" }}>
            <p style={{ paddingLeft: "20px" }}>Loading...</p>
          </div>
        ) : ownTeam === null ? (
          <div className="teams-card-container">
            <p style={{ paddingLeft: "20px" }}>You're not in a team</p>
          </div>
        ) : (
          <AnimatedPage>
            <TeamCard
              team={ownTeam}
              hidePlayers={false}
              placement={ownPlacement as number}
            />
          </AnimatedPage>
        )}
        {teamsResponse.isLoading || !session.isAuthenticated ? (
          <></>
        ) : (
          <div className="info-buttons-container">
            <div>
              {ownTeam !== null ? (
                <Button
                  color="#fc1e1e"
                  onClick={onLeaveTeam}
                  unavailable={leaveTeam.isPending}
                >
                  Leave Team
                </Button>
              ) : (
                <form onSubmit={onCreateTeam}>
                  <Button type="submit" color="#06c926" unavailable={createTeam.isPending || joinTeam.isPending}>
                    Create Team
                  </Button>
                  <input
                    type="text"
                    name="name"
                    placeholder="Insert team name..."
                    style={{ marginLeft: "8px", width: "200px" }}
                  />
                </form>
              )}
            </div>
            <div>
              {ownTeam !== null ? (
                <Button
                  color="#06c926"
                  onClick={copyInvite}
                >
                  Copy Team Code
                </Button>
              ) : (
                <form onSubmit={onJoinTeam}>
                  <input
                    type="text"
                    name="code"
                    style={{ marginRight: "8px" }}
                  />
                  <Button type="submit" unavailable={joinTeam.isPending || createTeam.isPending}>
                    Join Team
                  </Button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
      <p className="info-subtitle">Teams</p>
      <div className="info-teams-container">
        {teams?.map((team, index) => (
          <AnimatedPage>
            <TeamCard
              key={index}
              team={team}
              hidePlayers={true}
              placement={index + 1}
            />
          </AnimatedPage>
        ))}
      </div>
    </div>
  );
}
