import { UserType } from "./UserType";

export type AchievementTeamType = {
  id: number;
  name: string;
  icon: string | null;
  invite: string;
  players: { user: UserType }[];
};
