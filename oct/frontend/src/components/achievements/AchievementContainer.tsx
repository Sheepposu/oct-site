import { MyAchievementTeamType } from "src/api/types/AchievementTeamType";
import Achievement from "./Achievement";
import { AchievementExtendedType } from "src/api/types/AchievementType";

function* generateAchievements(achievements: AchievementExtendedType[], team: MyAchievementTeamType | null) {
    for (const achievement of achievements) {
        yield Achievement(achievement, team);
    }
}

export default function AchievementContainer({ achievements, team }: { achievements: AchievementExtendedType[] | null, team: MyAchievementTeamType | null }) {
    return (
        <div className="achievements-container">
            { achievements !== null ? generateAchievements(achievements, team) : <div>Loading achievements...</div> }
        </div>
    );
}