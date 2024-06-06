import { useGetAchievements } from "src/api/query";
import { AchievementExtendedType } from "src/api/types/AchievementType";
import "src/assets/css/achievements/completion.css";
import Achievement from "src/components/achievements/Achievement";

export default function AchievementCompletionPage() {
    // const session = useSession();

    // if (!session.isAuthenticated) {
    //     return (
    //         <div>Login to view this page</div>
    //     );
    // }

    const { data, status } = useGetAchievements();

    function* generateAchievements(achievements: AchievementExtendedType[]) {
        for (const achievement of achievements) {
            yield Achievement(achievement);
        }
    }

    return (
        <div className="page-container">
            <div className="achievements-container">
                {status === "success" ? generateAchievements(data) : <div>Loading...</div>}
            </div>

            <div className="progress-container">
                <div className="total-achievements-container">
                    <div className="total-achievements-inner-container">
                        <h1>Total Achievements</h1>
                        <h1>15/24</h1>
                        <div className="progress-bar">
                            <div className="progress-bar-inner"></div>
                        </div>
                    </div>
                    <button id="submit-button">Submit</button>
                </div>
                <div className="leaderboard">
                    <h1>Leaderboard</h1>
                    <div className="leaderboard-entry">
                        <div className="leaderboard-foreground-container">
                            <div className="placement-container first">
                                <p className="placement-text">#1</p>
                            </div>
                            <img className="placement-img" src="https://a.ppy.sh/14895608?1686006091.jpeg"></img>
                            <p className="placement-text">This Is A Super Long Team Name</p>
                        </div>
                        <h1 className="placement-text points">8</h1>
                    </div>
                </div>
            </div>
        </div>
    );
}
