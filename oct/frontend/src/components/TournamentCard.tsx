import { Link } from "react-router-dom";
import { TournamentIterationType } from "src/types/TournamentIterationType";

import "src/assets/css/tournaments/tournaments.css";
import oct3Thumbnail from "src/assets/images/oct3-thumbnail.png";
import oct4Thumbnail from "src/assets/images/oct4-thumbnail.png";

const thumbnails = {
  OCT3: oct3Thumbnail,
  OCT4: oct4Thumbnail,
  OCT5: null,
};

export default function TournamentCard(props: {
  tournament: TournamentIterationType;
}) {
  const tournament = props.tournament;
  const thumbnail = thumbnails[tournament.name as keyof typeof thumbnails];
  return (
    <Link to={`/tournaments/${tournament.name}`}>
      <div className="tournament">
        {thumbnail == null ? (
          <div
            className="tournament-thumbnail"
            style={{ backgroundColor: "#dedede", height: 141 }}
          ></div>
        ) : (
          <img
            src={thumbnail as string}
            alt="Tournament Thumbnail"
            className="tournament-thumbnail"
          />
        )}
        <div className="tournament-label-container">
          <p>{tournament.full_name}</p>
        </div>
      </div>
    </Link>
  );
}
