import { useState } from "react";
import { Session } from "src/types/SessionType";

export function getSession(): Session {
    const [session, setSession] = useState<Session | null>(null);

    if (session !== null) {
        return session;
    }

    const newSession = JSON.parse(document.getElementById("data")?.textContent as string);
    setSession(newSession);
    return newSession;
}