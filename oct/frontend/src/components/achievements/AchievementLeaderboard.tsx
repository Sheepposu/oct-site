import { useGetTeams } from "src/api/query";
import TeamCard from "./TeamCard";

export default function AchievementLeaderboard() {
  // TODO: check for errors
  const { isSuccess, isPending, data } = useGetTeams();

  return (
    <div className="leaderboard">
      <h1>Leaderboard</h1>
      {isPending ? (
        <div>Loading...</div>
      ) : isSuccess ? (
        data?.sort((a, b) => b.points - a.points).map((team, index) => (
          <TeamCard key={index} team={team} placement={index + 1} />
        ))
      ) : (
        <div>Error</div>
      )}
    </div>
  );
}
