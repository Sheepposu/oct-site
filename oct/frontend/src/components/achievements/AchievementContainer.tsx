import { AchievementTeamExtendedType } from "src/api/types/AchievementTeamType";
import Achievement from "./Achievement";
import { useGetAchievements } from "src/api/query";

export default function AchievementContainer({ team }: { team: AchievementTeamExtendedType | null }) {
    const { data: achievements } = useGetAchievements();

    return (
        <div className="achievements-container">
            { achievements !== undefined ? achievements.map(
                (achievement, index) => <Achievement key={index} achievement={achievement} team={team} />
            ) : <div>Loading achievements...</div> }
        </div>
    );
}