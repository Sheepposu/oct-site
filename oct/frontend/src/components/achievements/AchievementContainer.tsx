import { AchievementTeamExtendedType } from "src/api/types/AchievementTeamType";
import Achievement from "./Achievement";
import { useGetAchievements } from "src/api/query";
import { AchievementExtendedType } from "src/api/types/AchievementType";
import "src/assets/css/achievements/completion.css";

export default function AchievementContainer({
  team,
}: {
  team: AchievementTeamExtendedType | null;
}) {
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
        Object.keys(sortedAchievements).map((key) => (
          <>
            <div className="achievement-category">{key}</div>
            {sortedAchievements[key].map((achievement, index) => (
              <Achievement
                key={index + 1}
                achievement={achievement}
                team={team}
              />
            ))}
          </>
        ))
      ) : (
        // achievements.map((achievement, index) =>
        //   <Achievement key={index} achievement={achievement} team={team} />
        // )
        <div>Loading achievements...</div>
      )}
    </div>
  );
}
