import { useContext } from "react";
import AnimatedPage from "src/AnimatedPage";
import { useGetTeams } from "src/api/query";
import { AchievementTeamType } from "src/api/types/AchievementTeamType";
import "src/assets/css/achievements/teams.css";
import "src/assets/css/tournaments/tournament/index.css";
import "src/assets/css/main.css";
import Button from "src/components/Button";

import TeamCard from "src/components/achievements/TeamCard";
import { SessionContext } from "src/contexts/SessionContext";
import { EventContext } from "src/contexts/EventContext";

function checkLength(min: number, max: number, input: string) {
  const r = input.length > min || input.length < max;
  console.log(r);
  return input.length < min || input.length > max;
}

export default function TeamsCard() {
  const session = useContext(SessionContext);
  const dispatchEventMsg = useContext(EventContext);

  const teamsResponse = useGetTeams();
  const teams = teamsResponse.data;

  let ownTeam = null;

  async function leaveTeam() {
    const response = await fetch("/api/achievements/team/leave/", {
      method: "POST",
    });
    if (response.status === 200) {
      teamsResponse.refetch();
      dispatchEventMsg({
        type: "info",
        msg: "Successfully left team.",
      });
    } else {
      dispatchEventMsg({
        type: "error",
        msg: `Failed to leave team:`,
      });
    }
  }

  type joinTeamResponseType = {
    error?: string;
    data?: AchievementTeamType;
  };

  async function joinTeam(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const code = formData.get("code") as string;

    const response = (await fetch("/api/achievements/team/join/", {
      method: "POST",
      body: JSON.stringify({
        code: code,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).catch((err) => {
      dispatchEventMsg({
        type: "error",
        msg: `An error occured while joining the team: ${err}`,
      });
      return;
    })) as Response;

    const data: joinTeamResponseType = await response.json();

    if (data.error) {
      dispatchEventMsg({
        type: "error",
        msg: `An error occured: ${data.error}`,
      });
    }

    dispatchEventMsg({
      type: "info",
      msg: `Successfully joined team ${data.data?.name}`,
    });

    teamsResponse.refetch();
  }

  async function createTeam(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const teamName = formData.get("name") as string;

    if (checkLength(3, 32, teamName)) {
      dispatchEventMsg({
        type: "error",
        msg: "Team name needs to be between 3 and 32 characters",
      });
      return;
    }

    const response = await fetch("/api/achievements/team/new/", {
      method: "POST",
      body: JSON.stringify({
        name: teamName,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status !== 200) {
      dispatchEventMsg({
        type: "error",
        msg: "Team creation failed, ping sheppsu or aychar",
      });
      return;
    }

    dispatchEventMsg({
      type: "info",
      msg: `Team ${teamName} successfully created!`,
    });

    teamsResponse.refetch();
  }

  if (Array.isArray(teams))
    for (const team of teams) {
      if (team.own_team == true) {
        ownTeam = team;
      }
    }

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
            <TeamCard team={ownTeam} hidePlayers={false} />
          </AnimatedPage>
        )}
        {teamsResponse.isLoading == true || !session.isAuthenticated ? (
          <></>
        ) : (
          <div className="info-buttons-container">
            <div>
              {ownTeam !== null ? (
                <Button color="#fc1e1e" onClick={leaveTeam}>
                  Leave Team
                </Button>
              ) : (
                <form onSubmit={createTeam}>
                  <Button type="submit" color="#06c926">
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
                  onClick={() => {
                    navigator.clipboard.writeText(ownTeam.invite);
                  }}
                >
                  Copy Team Code
                </Button>
              ) : (
                <form onSubmit={joinTeam}>
                  <input
                    type="text"
                    name="code"
                    style={{ marginRight: "8px" }}
                  />
                  <Button type="submit">Join Team</Button>
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
            <TeamCard key={index} team={team} hidePlayers={true} />
          </AnimatedPage>
        ))}
      </div>
    </div>
  );
}
