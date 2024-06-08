import "src/assets/css/main.css";
import ErrorEntry, { ErrorState } from "./ErrorEntry";
import { useEffect, useState } from "react";

export default function ErrorContainer({errors}: {errors: ErrorState[]}) {
    const [time, setTime] = useState(Date.now());

    useEffect(() => {
        const intervalId = setInterval(() => setTime(Date.now()), 100);
        return () => clearInterval(intervalId);
    });

    return (
        <div className="error-container">
            {errors.map((error, index) => <ErrorEntry key={index} error={error} time={time} />)}
        </div>
    );
}