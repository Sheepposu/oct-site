import { useGetTeams } from "src/api/query";
import { AchievementTeamType } from "src/api/types/AchievementTeamType";

function AchievementEntry(team: AchievementTeamType, placement: number) {
    const icon = team.icon === null || team.icon === "" ? "https://osu.ppy.sh/images/layout/avatar-guest@2x.png" : team.icon;
    const placementCls = "placement-container" + ([" first", " second", " third"][placement-1] ?? "");
    return (
        <div className="leaderboard-entry">
            <div className="leaderboard-foreground-container">
                <div className={placementCls}>
                    <p className="placement-text">#{placement}</p>
                </div>
                <img className="placement-img" src={icon}></img>
                <p className="placement-text">{team.name}</p>
            </div>
            <h1 className="placement-text points">0</h1>
        </div>
    );
}

function* generateEntries(teams: AchievementTeamType[] | null) {
    if (teams === null) {
        yield <div>Error occurred</div>;
        return;
    }

    for (let i=0; i<teams.length; i++) {
        yield AchievementEntry(teams[i], i+1);
    }
}

export default function AchievementLeaderboard() {
    // TODO: check for errors
    const { isPending, data } = useGetTeams();

    return (
        <div className="leaderboard">
            <h1>Leaderboard</h1>
            {isPending ? <div>Loading...</div> : generateEntries(data as AchievementTeamType[] | null)}
        </div>
    );
}