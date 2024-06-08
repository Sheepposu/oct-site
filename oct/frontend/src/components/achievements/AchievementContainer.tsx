import { MyAchievementTeamType } from "src/api/types/AchievementTeamType";
import Achievement from "./Achievement";
import { AchievementExtendedType } from "src/api/types/AchievementType";

export default function AchievementContainer({ achievements, team }: { achievements: AchievementExtendedType[] | null, team: MyAchievementTeamType | null }) {
    return (
        <div className="achievements-container">
            { achievements !== null ? achievements.map(
                (achievement, index) => <Achievement key={index} achievement={achievement} team={team} />
            ) : <div>Loading achievements...</div> }
        </div>
    );
}