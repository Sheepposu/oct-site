import "src/assets/css/achievements/teams.css";
import TeamCard from "src/components/achievements/TeamCard";

export default function TeamsCard() {
  return (
    <div className="teams-container">
      <div className="teams-outside-container">
        <TeamCard />
      </div>
    </div>
  );
}
