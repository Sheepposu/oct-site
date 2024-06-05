import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { TournamentInfoType } from "src/api/types/TournamentInfoType";

import "src/assets/css/tournaments/tournament/index.css";

export default function TournamentInfo() {
  const params = useParams();

  const fetchTournamentData = (): Promise<TournamentInfoType> =>
    axios
      .get(`/api/tournaments/${params.tournament}`)
      .then((resp) => resp.data);

  const tournamentQuery = useQuery({
    queryKey: [`${params.tournament}TournamentData`],
    queryFn: fetchTournamentData,
    refetchOnMount: false,
  });

  const data = tournamentQuery.data;
  console.log(data?.tournament.links);
  return (
    <div className="info-container">
      <h1 className="info-title">{data?.tournament.full_name}</h1>
      <h1 className="info-subtitle">{data?.tournament.date_span}</h1>
      <p className="info-date">(MM/DD/YY)</p>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div className="specific-container">
          <h1 className="info-subtitle">Schedule</h1>
          <hr />
          {data?.rounds.map((round, index) => (
            <p key={index} className="info-text">
              <span className="name-label">{round.name}</span> {round.date}
            </p>
          ))}
        </div>
        <div className="specific-container">
          <h1 className="info-subtitle">Links</h1>
          <hr />
          {Array.isArray(data?.tournament.links) &&
          data?.tournament.links.length === undefined ? (
            <p className="info-text name-label">No Links</p>
          ) : (
            Array.isArray(data?.tournament.links) &&
            data?.tournament.links.map((link, index) => (
              <Link key={index} to={link.url}>
                <p className="info-text name-label">{link.name}</p>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
