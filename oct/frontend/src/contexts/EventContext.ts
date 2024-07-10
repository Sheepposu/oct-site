import { createContext } from "react";
import { Dispatch } from "react";

export type EventStateType = "error" | "info" | "expired";

export type EventState = {
    id: number,
    type: EventStateType,
    msg: string,
    createdAt: number,
    expiresAt: number
};

export const EventContext = createContext((({ type, msg, id }: { type: EventStateType; msg?: string, id?: number }) => {console.log(type, msg, id)}) as Dispatch<{type: EventStateType, msg?: string, id?: number}>);