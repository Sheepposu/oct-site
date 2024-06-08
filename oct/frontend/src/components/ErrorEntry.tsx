import { useContext, useEffect } from "react";
import { ErrorContext } from "src/contexts/ErrorContext";

export type ErrorState = {
    msg: string,
    createdAt: number,
    expiresAt: number
};

export default function ErrorEntry({error, time}: {error: ErrorState, time: number}) {
    const errorLength = error.expiresAt - error.createdAt;
    const expiresIn = Math.max(error.expiresAt - time, 0);
    const progress = `${expiresIn / errorLength * 100}%`;

    const dispatchError = useContext(ErrorContext);
    useEffect(() => {
        const timeoutId = setTimeout(() => dispatchError(""), expiresIn);
        return () => clearTimeout(timeoutId);
    }, [expiresIn, dispatchError]);

    return (
        <div className="error-entry">
            <p className="error-text">{error.msg}</p>
            <div className="error-bar" style={{ width: progress }}></div>
        </div>
    );
}