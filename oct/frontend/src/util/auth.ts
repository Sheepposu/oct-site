import { useState } from "react";
import { Session } from "src/types/SessionType";

export function getSession(): Session {
    const [session, setSession] = useState<Session | null>(null);

    if (session === null) {
        // this element should always be present on the page
        setSession(JSON.parse(
            document.getElementById("data")?.textContent as string
        ));
    }

    return session as Session;
}