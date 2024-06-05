import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import TournamentCard from "src/components/TournamentCard";
import { TournamentIterationType } from "src/api/types/TournamentIterationType";

import "src/assets/css/tournaments/tournaments.css";

export default function Tournaments() {
  const fetchTournamentsData = (): Promise<TournamentIterationType[]> =>
    axios.get("/api/tournaments").then((resp) => resp.data);

  const tournamentsQuery = useQuery({
    queryKey: ["allTournamentsData"],
    queryFn: fetchTournamentsData,
    refetchOnMount: false,
  });

  const tournaments = tournamentsQuery.data;
  return (
    <div className="tournaments-container">
      {tournaments?.map((tournament, index) => (
        <TournamentCard key={index} tournament={tournament} />
      ))}
    </div>
  );
}
