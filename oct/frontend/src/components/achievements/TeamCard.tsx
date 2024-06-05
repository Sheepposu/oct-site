import "src/assets/css/achievements/teams.css";

export default function TeamCard() {
  return (
    <div className="teams-card-container">
      <p className="teams-placement">#1</p>
      <div className="teams-divider">
        <div style={{ display: "flex", alignItems: "center" }}>
          <div className="teams-icon"></div>
          <p className="teams-team-name">Super Amazing Team</p>
        </div>
        <div className="teams-points-container">
          <p className="teams-points">5</p>
        </div>
      </div>
    </div>
  );
}
