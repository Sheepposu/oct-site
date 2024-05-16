import { MatchType } from "./MatchType";

export type DashboardType = {
  response: {
    is_registered: boolean;
    matches: [MatchType];
  };
};
