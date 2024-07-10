import {
  AchievementPlayerExtendedType
} from "./AchievementPlayerType";

export type AchievementTeamType = {
  id: number;
  name: string;
  icon: string | null;
  points: number;
};

export type AchievementTeamExtendedType = {
  // includes player with list of completed achievements
  players: AchievementPlayerExtendedType[];
  invite: string;
} & AchievementTeamType;
