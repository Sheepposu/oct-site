import "src/assets/css/achievements/teams.css";
import "src/assets/css/tournaments/tournament/index.css";
import Button from "src/components/Button";

import TeamCard from "src/components/achievements/TeamCard";

export default function TeamsCard() {
  return (
    <div className="info-container">
      <h1 className="info-title">Teams</h1>
      <p className="info-subtitle">Your Team</p>
      <div className="info-your-team-container">
        <TeamCard />
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
      <div className="info-teams-container"></div>
    </div>
  );
}
