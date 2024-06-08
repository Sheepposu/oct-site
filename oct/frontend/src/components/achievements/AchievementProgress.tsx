import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { MyAchievementTeamType } from "src/api/types/AchievementTeamType";
import { AchievementExtendedType } from "src/api/types/AchievementType";
import { EventContext, EventStateType } from "src/contexts/EventContext";
import { SessionContext } from "src/contexts/SessionContext";

type WebsocketState = {
    ws: WebSocket;
    dispatchEventMsg: React.Dispatch<{type: EventStateType, msg: string}>;
    onMutation: React.Dispatch<React.SetStateAction<WebsocketState | null>>;
    authenticated: boolean;
};

function connect(uri: string, dispatchEventMsg: React.Dispatch<{type: EventStateType, msg: string}>, data: object, onMutation: React.Dispatch<React.SetStateAction<WebsocketState | null>>): WebsocketState {
    const ws = new WebSocket(uri);

    const state: WebsocketState = {
        ws,
        dispatchEventMsg,
        onMutation,
        authenticated: false
    };

    ws.addEventListener("open", (evt) => {
        console.log(evt);
        ws.send(JSON.stringify(data));
    });
    ws.addEventListener("close", (evt) => {
        console.log(evt);
        dispatchEventMsg({type: "error", msg: "Connection to submissions server unexpectedly closed"});
        state.authenticated = false;
        onMutation({...state});
    });
    ws.addEventListener("error", (evt) => {
        console.log(evt);
        dispatchEventMsg({type: "error", msg: `Submission server returned an unexpected error`});
    });
    ws.addEventListener("message", (evt) => {
        console.log(evt);
        onOpen(evt, state);
    });

    onMutation({...state});
    return state;
}

function sendSubmit(state: WebsocketState | null) {
    if (state === null || !state.authenticated) {
        return;
    }

    state.ws.send(JSON.stringify({code: 1}));
}

type WSAchievementType = {
    id: number,
    name: string,
    category: string
};

function onOpen(evt: MessageEvent<string>, state: WebsocketState) {
    const data = JSON.parse(evt.data);
    if (data.error !== undefined) {
        state.dispatchEventMsg({type: "error", msg: `Unexpected error from submission server: ${data.error}`});
        return;
    }

    switch (data.code) {
        case 0: {
            state.authenticated = true;
            state.onMutation({...state});
            state.dispatchEventMsg({type: "info", msg: "You are now authenticated with the submission server"});
            break;
        }
        case 1: {
            const achievements = data.achievements as WSAchievementType[];
            const msg = achievements.length === 0 ?
                "No achievements completed" :
                `You completed ${achievements.length} achievements! ${achievements.map((achievement) => achievement.name).join(", ")}`;
            state.dispatchEventMsg({type: "info", msg: msg});
            break;
        }
    }
}

export default function AchievementProgress({ achievements, team }: { achievements: AchievementExtendedType[] | null, team: MyAchievementTeamType | null }) {
    const session = useContext(SessionContext);
    const [state, setState] = useState<WebsocketState | null>(null);
    const { data } = useQuery({
        queryKey: ["wsauth"],
        queryFn: () => fetch("/api/achievements/wsauth/").then((resp) => resp.json())
    });
    const dispatchEventMsg = useContext(EventContext);

    useEffect(() => {
        if (data === undefined || data === null) {
            return;
        }

        if (state !== null) {
            return;
        }

        connect(session.wsUri, dispatchEventMsg, data, setState);
    }, [session.wsUri, dispatchEventMsg, data, state]);

    if (team === null || achievements === null) {
        return <div>Loading team progress...</div>;
    }

    let achievementCount = 0;
    for (const player of team.players) {
        achievementCount += player.completions.length;
    }
    
    const submitCls = "submit-button" + (state === null || !state.authenticated ? " disabled" : "");

    return (
        <div className="total-achievements-container">
            <div className="total-achievements-inner-container">
                <h1>Achievement progress</h1>
                <h1>{`${achievementCount}/${(achievements as AchievementExtendedType[]).length}`}</h1>
                <div className="progress-bar">
                    <div className="progress-bar-inner"></div>
                </div>
            </div>
            <div className={submitCls} onClick={() => sendSubmit(state)}>Submit</div>
        </div>
    );
}