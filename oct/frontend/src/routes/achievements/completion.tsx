import { useGetAchievements, useGetTeam } from "src/api/query";
import { AchievementExtendedType } from "src/api/types/AchievementType";
import AchievementContainer from "src/components/achievements/AchievementContainer";
import AchievementLeaderboard from "src/components/achievements/AchievementLeaderboard";
import AchievementProgress from "src/components/achievements/AchievementProgress";

import "src/assets/css/achievements/completion.css";
import { useContext } from "react";
import { SessionContext } from "src/contexts/SessionContext";

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

function FullAchievementCompletionPage({ achievements }: { achievements: AchievementExtendedType[] | null }) {
    // TODO: handle errors
    const { data } = useGetTeam();

    return (
        <div className="page-container">
            <AchievementContainer achievements={achievements} team={data ?? null} />
            <div className="progress-container">
                <AchievementProgress achievements={achievements} team={data ?? null} />
                <AchievementLeaderboard />
            </div>
        </div>
    );
}

export default function AchievementCompletionPage() {
    const session = useContext(SessionContext);
    // TODO: handle errors
    const { data } = useGetAchievements();

    return (session.isAuthenticated ? FullAchievementCompletionPage : LimitedAchievementCompletionPage)(
        {achievements: data ?? null}
    );
}
