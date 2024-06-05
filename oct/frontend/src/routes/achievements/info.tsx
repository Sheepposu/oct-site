import "src/assets/css/tournaments/tournament/index.css";

export default function InfoCard() {
  return (
    <div className="info-container">
      <h1 className="info-title">Offline Chat Achievement Hunt</h1>
      <p className="info-text">June 8th - June 16th (UTC Time)</p>
      <p className="info-subtitle">About</p>
      <p className="info-text">
        Offline Chat Achievement Hunt is a team event with the objective of
        collecting achievements! Note that "achievement" does <b>not</b> refer
        to osu's official medals. The event will feature a wide variety of
        achievements and categories on the site and teams will compete to get as
        many points as possible before the event ends.
      </p>
      <p className="info-subtitle">Teams</p>
      <p className="info-text">
        Teams are comprised of 1-5 people. There is a maximum to prevent teams
        from becoming too large and gaining a sizeable advantage.
      </p>
      <p className="info-subtitle">Points</p>
      <p className="info-text">
        Each achievement gains your team between 10 and 100 points. Achievements
        have a base of 100 points and decrease depending on how many teams have
        completed the achievement at a given moment. This means that your points
        can decrease as other teams complete achievements.
      </p>
    </div>
  );
}
