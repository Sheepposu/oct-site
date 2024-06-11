import { useGetTeams } from "src/api/query";
import { AchievementTeamType } from "src/api/types/AchievementTeamType";

function AchievementEntry({team, placement}: {team: AchievementTeamType, placement: number}) {
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
            <h1 className="placement-text points">{team.points}</h1>
        </div>
    );
}

export default function AchievementLeaderboard() {
    // TODO: check for errors
    const { isSuccess, isPending, data } = useGetTeams();

    return (
        <div className="leaderboard">
            <h1>Leaderboard</h1>
            {
                isPending ? <div>Loading...</div> : 
                (isSuccess ? data?.map((team, index) => <AchievementEntry key={index} team={team} placement={index+1} />) : 
                <div>Error</div>)
            }
        </div>
    );
}