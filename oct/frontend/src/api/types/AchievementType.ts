export type AchievementType = {
    id: number;
    name: string;
    category: string;
    description: string;
    beatmap_id: number | null;
};

export type AchievementExtendedType = {
    completions: number;
} & AchievementType;