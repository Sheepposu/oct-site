import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { MyAchievementTeamType } from "src/api/types/AchievementTeamType";
import { AchievementExtendedType } from "src/api/types/AchievementType";
import { ErrorContext } from "src/contexts/ErrorContext";
import { SessionContext } from "src/contexts/SessionContext";

type WebsocketState = {
    ws: WebSocket;
    dispatchError: React.Dispatch<string>;
    onMutation: React.Dispatch<React.SetStateAction<WebsocketState | null>>;
    authenticated: boolean;
};

function connect(uri: string, dispatchError: React.Dispatch<string>, data: object, onMutation: React.Dispatch<React.SetStateAction<WebsocketState | null>>): WebsocketState {
    const ws = new WebSocket(uri);

    const state: WebsocketState = {
        ws,
        dispatchError,
        onMutation,
        authenticated: false
    };

    ws.addEventListener("open", (evt) => {
        console.log(evt);
        ws.send(JSON.stringify(data))
    });
    ws.addEventListener("close", (evt) => {
        console.log(evt);
        dispatchError("Connection to submissions server unexpectedly closed")
        state.authenticated = false;
        onMutation({...state});
    });
    ws.addEventListener("error", (evt) => {
        console.log(evt);
        dispatchError(`Submission server returned an unexpected error`)
    });
    ws.addEventListener("message", (evt) => {
        console.log(evt);
        onOpen(evt, state)
    });

    onMutation({...state});
    return state;
}

// function closeConnection(state: WebsocketState) {
//     state.ws.close();
// }

function onOpen(evt: MessageEvent<string>, state: WebsocketState) {
    const data = JSON.parse(evt.data);
    if (data.error !== undefined) {
        state.dispatchError(`Unexpected error from submission server: ${data.error}`);
        return;
    }

    if (data.code == 0) {
        state.authenticated = true;
        state.onMutation({...state});
    }
}

export default function AchievementProgress({ achievements, team }: { achievements: AchievementExtendedType[] | null, team: MyAchievementTeamType | null }) {
    const session = useContext(SessionContext);
    const [state, setState] = useState<WebsocketState | null>(null);
    const { data } = useQuery({
        queryKey: ["wsauth"],
        queryFn: () => fetch("/api/achievements/wsauth/").then((resp) => resp.json())
    });
    const dispatchError = useContext(ErrorContext);

    useEffect(() => {
        if (data === undefined || data === null) {
            return;
        }

        if (state !== null) {
            return;
        }

        connect(session.wsUri, dispatchError, data, setState);
    }, [session.wsUri, dispatchError, data, state]);

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
            <button className={submitCls}>Submit</button>
        </div>
    );
}