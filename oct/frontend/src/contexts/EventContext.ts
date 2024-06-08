import { createContext } from "react";
import { Dispatch } from "react";

export type EventStateType = "error" | "info";

export type EventState = {
    type: EventStateType,
    msg: string,
    createdAt: number,
    expiresAt: number
};

export const EventContext = createContext((({type, msg}: {type: EventStateType, msg: string}) => {console.log(type, msg)}) as Dispatch<{type: EventStateType, msg: string}>);