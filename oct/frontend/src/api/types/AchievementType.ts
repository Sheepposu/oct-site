export type AchievementType = {
    id: number;
    name: string;
    category: string;
};

export type AchievementExtendedType = {
    completions: number;
} & AchievementType;