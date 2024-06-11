import { useGetAchievements, useGetTeam } from "src/api/query";
import { AchievementExtendedType } from "src/api/types/AchievementType";
import AchievementContainer from "src/components/achievements/AchievementContainer";
import AchievementLeaderboard from "src/components/achievements/AchievementLeaderboard";
import AchievementProgress from "src/components/achievements/AchievementProgress";

import "src/assets/css/achievements/completion.css";
import { useContext, useEffect, useState } from "react";
import { SessionContext } from "src/contexts/SessionContext";

const EVENT_START = 1718409600000;

function HiddenAchievementCompletionPage({
    time
}: {
    time: number
}) {
    
    const delta = EVENT_START - time;

    const days = Math.floor(delta / (1000 * 60 * 60 * 24) % 60);
    const hours = Math.floor(delta / (1000 * 60 * 60) % 60);
    const minutes = Math.floor(delta / (1000 * 60) % 60);
    const seconds = Math.floor(delta / 1000 % 60);
    const timeString = [days, hours, minutes, seconds].map((n) => n < 10 ? "0" + n : "" + n).join(":");

    return (
        <div style={{margin: "auto", textAlign: "center", marginTop: "50px"}}>
            <h1 style={{fontSize: "100px"}}>Starts in {timeString}</h1>
        </div>
    );
}

function LimitedAchievementCompletionPage({ achievements }: { achievements: AchievementExtendedType[] | null }) {
    return (
        <div className="page-container">
            <AchievementContainer achievements={achievements} team={ null } />
            <div className="progress-container">
                <AchievementLeaderboard />
            </div>
        </div>
    );
}

function FullAchievementCompletionPage({ achievements, achievementsRefetch }: { achievements: AchievementExtendedType[] | null, achievementsRefetch: () => void }) {
    // TODO: handle errors
    const { data, refetch } = useGetTeam();

    const refetchAll = () => {
        achievementsRefetch();
        refetch();
    };

    return (
        <div className="page-container">
            <AchievementContainer achievements={achievements} team={data ?? null} />
            <div className="progress-container">
                <AchievementProgress achievements={achievements} refetch={refetchAll} team={data ?? null} />
                <AchievementLeaderboard />
            </div>
        </div>
    );
}

export default function AchievementCompletionPage() {
    const session = useContext(SessionContext);
    const { data, refetch } = useGetAchievements();
    const [time, setTime] = useState<number>(Date.now());

    // TODO: fix error happening when timer is done
    useEffect(() => {
        if (time >= EVENT_START) {
            return;
        }

        const intervalId = setInterval(() => setTime(Date.now()), 1000);
        return () => clearInterval(intervalId);
    });

    if (time < EVENT_START) {
        return <HiddenAchievementCompletionPage time={time} />
    }

    return (session.isAuthenticated ? FullAchievementCompletionPage : LimitedAchievementCompletionPage)(
        {achievements: data ?? null, achievementsRefetch: refetch}
    );
}
