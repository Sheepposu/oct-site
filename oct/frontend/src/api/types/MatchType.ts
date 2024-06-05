import { TournamentRoundType } from "./TournamentRoundType";
import { UserType } from "./UserType";

export type MatchType = {
  id: number;
  match_id: number;
  team_order: string;
  starting_time: string | null;
  is_losers: boolean;
  osu_match_id: number;
  bans: string | null;
  picks: string | null;
  wins: string | null;
  finished: boolean;
  referee: UserType | null;
  streamer: UserType | null;
  commentator1: UserType | null;
  commentator2: UserType | null;
  tournament_round: TournamentRoundType;
  teams: {
    id: number;
    name: string;
    icon: string | null;
    seed: number | null;
    players: {
      id: number;
      osu_rank: number;
      is_captain: string;
      tier: string | null;
      user: UserType;
    }[];
  }[];
};
