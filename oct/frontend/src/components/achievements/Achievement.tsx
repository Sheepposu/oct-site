import { AchievementTeamExtendedType } from "src/api/types/AchievementTeamType";
import { AchievementExtendedType } from "src/api/types/AchievementType";

export default function Achievement({achievement, team}: {achievement: AchievementExtendedType, team: AchievementTeamExtendedType | null}) {
    function checkComplete() {
        if (team !== null) {
            for (const player of team.players) {
                for (const completion of player.completions) {
                    if (completion.achievement_id === achievement.id) {
                        return true;
                    }
                }
            }

            return false;
        }

        return null;
    }

    const complete = checkComplete();
    let infoCls = "achievement-info-container";
    let infoLabel = <></>;
    if (complete === true) {
        infoCls += " complete";
        infoLabel = <h1>Complete</h1>;
    } else if (complete === false) {
        infoCls += " incomplete"
        infoLabel = <h1>Incomplete</h1>
    }

    return (
        <div className="achievement">
            <div className={infoCls}>
                <div className="achievement-info">
                    <h1>[{achievement.category}] {achievement.name}</h1>
                    <p>{achievement.completions} completions | {achievement.description}</p>
                </div>
                {infoLabel}
            </div>
            { achievement.beatmap === null ? "" :
            <a href={`https://osu.ppy.sh/b/${achievement.beatmap.id}`} target="_blank">
                <div className="achievement-details-container">
                    <img className="achievement-details-cover" src={achievement.beatmap.cover}></img>
                    <div className="achievement-details-beatmap-info">
                        <p className="achievement-details-beatmap-info-text">{achievement.beatmap.artist} - {achievement.beatmap.title}</p>
                        <p className="achievement-details-beatmap-info-text">[{achievement.beatmap.version}]</p>
                    </div>
                    <h1 className="achievement-details-star-rating">{achievement.beatmap.star_rating}*</h1>
                </div>
            </a>
            }
        </div>
    );
}