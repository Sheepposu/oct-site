import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { MyAchievementTeamType } from "src/api/types/AchievementTeamType";
import { AchievementExtendedType } from "src/api/types/AchievementType";
import { ErrorContext } from "src/contexts/ErrorContext";
import { SessionContext } from "src/contexts/SessionContext";

class AchievementsWebsocket {
    private ws: WebSocket;
    private dispatchError: React.Dispatch<string>;
    private data: string;
    public authenticated: boolean = false;

    public constructor(uri: string, dispatchError: React.Dispatch<string>, data: string) {
        this.ws = new WebSocket(uri);
        this.dispatchError = dispatchError;
        this.data = data;

        const self = this as AchievementsWebsocket;
        this.ws.addEventListener("open", (evt) => self.onOpen(evt));
        this.ws.addEventListener("close", (evt) => self.onClose(evt));
        this.ws.addEventListener("message", (evt) => self.onMessage(evt));
        this.ws.addEventListener("error", (evt) => self.onError(evt));
    }

    public close() {
        this.ws.close();
    }

    private onOpen(evt: Event) {
        console.log(evt);
        this.ws.send(JSON.stringify(this.data));
        this.dispatchError("the ws connection has opened");
    }

    private onClose(evt: CloseEvent) {
        console.log(evt);
        this.dispatchError("the ws connect as closed");
    }

    private onMessage(evt: MessageEvent<string>) {
        console.log(evt);
        this.dispatchError("message received "+evt.data);

        const data = JSON.parse(evt.data);
        if (data.code === 0) {
            this.authenticated = true;
        }
    }

    private onError(evt: Event) {
        console.log(evt);
        this.dispatchError("a ws error occurred");
    }
}

export default function AchievementProgress({ achievements, team }: { achievements: AchievementExtendedType[] | null, team: MyAchievementTeamType | null }) {
    const session = useContext(SessionContext);
    const [ws, setWs] = useState<AchievementsWebsocket | null>(null);
    const { data } = useQuery({
        queryKey: ["wsauth"],
        queryFn: () => fetch("/api/achievements/wsauth/").then((resp) => resp.json())
    });
    const dispatchError = useContext(ErrorContext);

    useEffect(() => {
        if (data === undefined || data === null) {
            return;
        }

        const aws = new AchievementsWebsocket(session.wsUri, dispatchError, data);
        setWs(aws);
        return () => {
            aws.close();
        }
    }, [session.wsUri, dispatchError, data]);

    if (team === null || achievements === null) {
        return <div>Loading team progress...</div>;
    }

    let achievementCount = 0;
    for (const player of team.players) {
        achievementCount += player.completions.length;
    }
    
    const submitCls = "submit-button" + (ws === null ? " disabled" : "");

    return (
        <div className="total-achievements-container">
            <div className="total-achievements-inner-container">
                <h1>Achievement progress</h1>
                <h1>{`${achievementCount}/${(achievements as AchievementExtendedType[]).length}`}</h1>
                <div className="progress-bar">
                    <div className="progress-bar-inner"></div>
                </div>
            </div>
            <button className={submitCls}>Submit</button>
        </div>
    );
}