import { MyAchievementTeamType } from "src/api/types/AchievementTeamType";
import { AchievementExtendedType } from "src/api/types/AchievementType";

class AchievementsWebsocket {
    private ws: WebSocket;

    public constructor(uri: string) {
        this.ws = new WebSocket(uri);
        this.ws.addEventListener("open", this.onOpen);
        this.ws.addEventListener("close", this.onClose);
        this.ws.addEventListener("message", this.onMessage);
        this.ws.addEventListener("error", this.onError);
    }

    private onOpen() {

    }

    private onClose() {

    }

    private onMessage() {

    }

    private onError() {
        // TODO: notify the user an error occurred
    }
}

export default function AchievementProgress({ achievements, team }: { achievements: AchievementExtendedType[] | null, team: MyAchievementTeamType | null }) {
    if (team === null || achievements === null) {
        return <div>Loading team progress...</div>;
    }

    let achievementCount = 0;
    for (const player of team.players) {
        achievementCount += player.completions.length;
    }
    
    return (
        <div className="total-achievements-container">
            <div className="total-achievements-inner-container">
                <h1>Achievement progress</h1>
                <h1>{`${achievementCount}/${(achievements as AchievementExtendedType[]).length}`}</h1>
                <div className="progress-bar">
                    <div className="progress-bar-inner"></div>
                </div>
            </div>
            <button id="submit-button">Submit</button>
        </div>
    );
}