import { AchievementCompletionType } from "./AchievementCompletionType";
import { UserType } from "./UserType";

export type AchievementPlayerType = {
    id: number;
    user: UserType;
};

export type AchievementPlayerExtendedType = {
    completions: AchievementCompletionType[];
} & AchievementPlayerType;