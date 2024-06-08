import { useContext, useEffect } from "react";
import { EventContext, EventState } from "src/contexts/EventContext";

export default function EventEntry({event, time}: {event: EventState, time: number}) {
    const eventLength = event.expiresAt - event.createdAt;
    const expiresIn = Math.max(event.expiresAt - time, 0);
    const progress = `${expiresIn / eventLength * 100}%`;

    const dispatchEventMsg = useContext(EventContext);
    useEffect(() => {
        const timeoutId = setTimeout(() => dispatchEventMsg({type: "error", msg: ""}), expiresIn);
        return () => clearTimeout(timeoutId);
    }, [expiresIn, dispatchEventMsg]);

    return (
        <div className={"event-entry "+event.type}>
            <p className="event-text">{event.msg}</p>
            <div className="event-bar" style={{ width: progress }}></div>
        </div>
    );
}