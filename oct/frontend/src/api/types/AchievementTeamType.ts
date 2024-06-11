import {
  AchievementPlayerExtendedType,
  AchievementPlayerType,
} from "./AchievementPlayerType";

export type AchievementTeamType = {
  id: number;
  name: string;
  icon: string | null;
  invite: string;
  points: number;
  placement: number;
  own_team: boolean;
  players: AchievementPlayerType[];
};

export type MyAchievementTeamType = {
  // includes player with list of completed achievements
  players: AchievementPlayerExtendedType[];
} & AchievementTeamType;
