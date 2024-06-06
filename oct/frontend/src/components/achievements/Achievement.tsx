import { AchievementExtendedType } from "src/api/types/AchievementType";

export default function Achievement(achievement: AchievementExtendedType) {
    return (
        <div className="achievement">
            <div className="achievement-info-container complete">
                <div className="achievement-info">
                    <h1>[{achievement.category}] {achievement.name}</h1>
                    <p>Achievement description</p>
                </div>
                <h1>Complete</h1>
            </div>
            <div className="achievement-details-container">

            </div>
        </div>
    );
}