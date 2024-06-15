import { QueryClient, QueryClientContext, useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { useGetAchievements } from "src/api/query";
import { AchievementPlayerExtendedType } from "src/api/types/AchievementPlayerType";
import { AchievementTeamExtendedType, AchievementTeamType } from "src/api/types/AchievementTeamType";
import { AchievementExtendedType } from "src/api/types/AchievementType";
import { EventContext, EventStateType } from "src/contexts/EventContext";
import { SessionContext } from "src/contexts/SessionContext";

type WebsocketState = {
    ws: WebSocket;
    dispatchEventMsg: React.Dispatch<{type: EventStateType, msg: string}>;
    onMutation: React.Dispatch<React.SetStateAction<WebsocketState | null>>;
    queryClient: QueryClient;
    authenticated: boolean;
};

function connect(uri: string, dispatchEventMsg: React.Dispatch<{type: EventStateType, msg: string}>, data: object, onMutation: React.Dispatch<React.SetStateAction<WebsocketState | null>>, queryClient: QueryClient): WebsocketState {
    const ws = new WebSocket(uri);

    const state: WebsocketState = {
        ws,
        dispatchEventMsg,
        onMutation,
        queryClient,
        authenticated: false
    };

    ws.addEventListener("open", (evt) => {
        console.log(evt);
        ws.send(JSON.stringify(data));
    });
    ws.addEventListener("close", (evt) => {
        console.log(evt);
        dispatchEventMsg({type: "error", msg: "Connection to submissions server unexpectedly closed; reconnecting..."});
        state.authenticated = false;
        onMutation({...state});
    });
    ws.addEventListener("error", (evt) => {
        console.log(evt);
        dispatchEventMsg({type: "error", msg: "Submission server returned an unexpected error"});
    });
    ws.addEventListener("message", (evt) => {
        console.log(evt);
        onMessage(evt, state);
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
    id: number;
    name: string;
    category: string;
    time: string;
};
type RefreshReturnType = {
    achievements: WSAchievementType[];
    score: number;
    you: number;
}

function onCompletedAchievement(data: RefreshReturnType, state: WebsocketState) {
    state.queryClient.setQueryData(["achievements", "teams"], (oldTeams: Array<AchievementTeamExtendedType | AchievementTeamType>) => {
        const teams = [];

        for (const team of oldTeams) {
            if ("invite" in team) {
                const players: AchievementPlayerExtendedType[] = [];

                const myTeam = team as AchievementTeamExtendedType;
                for (const player of myTeam.players) {
                    if (player.id === data.you) {
                        players.push({
                            ...player,
                            completions: player.completions.concat(data.achievements.map((achievement) => ({
                                achievement_id: achievement.id,
                                time_completed: achievement.time
                            })))
                        });

                        myTeam.points = data.score;

                        continue;
                    }
                    players.push(player);
                }

                myTeam.players = players;
                teams.push(myTeam);
                continue;
            }
            teams.push(team)
        }

        return teams;
    });

    const completedIds = data.achievements.map((a) => a.id);
    state.queryClient.setQueryData(["achievements"], (oldAchievements: AchievementExtendedType[]) => {
        const achievements = [];
        for (const achievement of oldAchievements) {
            if (completedIds.includes(achievement.id)) {
                achievements.push({...achievement, completions: achievement.completions + 1});
                continue;
            }

            achievements.push(achievement);
        }

        return achievements;
    });
}

function onMessage(evt: MessageEvent<string>, state: WebsocketState) {
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
                `You completed ${achievements.length} achievement(s)! ${achievements.map((achievement) => achievement.name).join(", ")}`;
            state.dispatchEventMsg({type: "info", msg: msg});
            
            if (achievements.length > 0) {
                onCompletedAchievement(data, state);
            }
            
            break;
        }
    }
}

export default function AchievementProgress({ team }: { team: AchievementTeamExtendedType | null }) {
    const session = useContext(SessionContext);
    const queryClient = useContext(QueryClientContext) as QueryClient;

    const [state, setState] = useState<WebsocketState | null>(null);

    const { data } = useQuery({
        queryKey: ["wsauth"],
        queryFn: () => fetch("/api/achievements/wsauth/").then((resp) => resp.json())
    });
    const { data: achievements } = useGetAchievements();

    const dispatchEventMsg = useContext(EventContext);

    useEffect(() => {
        if (data === undefined || data === null) {
            return;
        }

        if (state !== null && state.ws.readyState != 2 && state.ws.readyState != 3) {
            return;
        }

        connect(session.wsUri, dispatchEventMsg, data, setState, queryClient);
    }, [session.wsUri, dispatchEventMsg, data, state, queryClient]);

    if (team === null || achievements === undefined) {
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
                    <div className="progress-bar-inner" style={{width: `${achievementCount / achievements.length * 100}%`}}></div>
                </div>
            </div>
            <div className={submitCls} onClick={() => sendSubmit(state)}>Submit</div>
        </div>
    );
}