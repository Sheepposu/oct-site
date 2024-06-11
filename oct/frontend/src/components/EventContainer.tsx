import "src/assets/css/main.css";
import ErrorEntry from "./EventEntry";
import { useEffect, useState } from "react";
import { EventState } from "src/contexts/EventContext";

export default function EventContainer({ events }: { events: EventState[] }) {
  const [time, setTime] = useState(Date.now());

  useEffect(() => {
    const intervalId = setInterval(() => setTime(Date.now()), 10);
    return () => clearInterval(intervalId);
  });

  return (
    <div className="event-container">
      {events.map((event, index) => (
        <ErrorEntry key={index} event={event} time={time} />
      ))}
    </div>
  );
}
