import Achievement from "./Achievement";
import { useGetAchievements } from "src/api/query";
import { AchievementExtendedType } from "src/api/types/AchievementType";
import "src/assets/css/achievements/completion.css";

export default function AchievementContainer() {
  const { data: achievements } = useGetAchievements();

  const sortedAchievements: { [key: string]: AchievementExtendedType[] } = {};
  if (achievements !== undefined) {
    for (const achievement of achievements as AchievementExtendedType[]) {
      if (!sortedAchievements[achievement.category]) {
        sortedAchievements[achievement.category] = [];
      }
      sortedAchievements[achievement.category].push(achievement);
    }
  }

  return (
    <div className="achievements-container">
      {achievements !== undefined ? (
        Object.keys(sortedAchievements).sort((a, b) => a.localeCompare(b)).map((key) => (
          <>
            <div className="achievement-category">{key}</div>
            {sortedAchievements[key].map((achievement, index) => (
              <Achievement key={index} achievement={achievement} />
            ))}
          </>
        ))
      ) : (
        <div>Loading achievements...</div>
      )}
    </div>
  );
}
