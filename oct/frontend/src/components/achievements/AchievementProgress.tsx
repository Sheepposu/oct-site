import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { MyAchievementTeamType } from "src/api/types/AchievementTeamType";
import { AchievementExtendedType } from "src/api/types/AchievementType";
import { SessionContext } from "src/contexts/SessionContext";

class AchievementsWebsocket {
    private ws: WebSocket;
    public authenticated: boolean = false;

    public constructor(uri: string) {
        this.ws = new WebSocket(uri);
        this.ws.addEventListener("open", this.onOpen);
        this.ws.addEventListener("close", this.onClose);
        this.ws.addEventListener("message", this.onMessage);
        this.ws.addEventListener("error", this.onError);
    }

    public auth(data: object) {
        this.authenticated = true;
        this.ws.send(JSON.stringify(data));
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
    const session = useContext(SessionContext);
    const [ws, setWs] = useState<AchievementsWebsocket | null>(null);
    const { data } = useQuery({
        queryKey: ["wsauth"],
        queryFn: () => fetch("/api/achievements/wsauth/").then((resp) => resp.json())
    });

    if (ws === null) {
        const aws = new AchievementsWebsocket(session.wsUri)
        setWs(aws);
        if (data !== undefined) {
            aws.auth(data);
        }
    } else if (!ws.authenticated && data !== undefined) {
        ws.auth(data);
    }

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