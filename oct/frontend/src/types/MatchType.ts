export type MatchType = {
  progress: string;
  result: string;
  time_str: string;
  team_names?: string;
  score?: string;
  id: string;
  color: string;
  team1?: {
    id: number;
    name: string;
    icon: null | string;
    seed: null | string;
  };
  team2?: {
    id: number;
    name: string;
    icon: null | string;
    seed: null | string;
  };
};
