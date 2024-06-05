import AnimatedPage from "src/AnimatedPage";
import InfoCard from "./info";
import TeamsCard from "./teams";

import "src/assets/css/achievements/index.css";

export default function AchievementsIndex() {
  return (
    <AnimatedPage>
      <div className="index-container">
        <div className="card-container">
          <TeamsCard />
        </div>
        <div className="card-container">
          <InfoCard />
        </div>
      </div>
    </AnimatedPage>
  );
}
