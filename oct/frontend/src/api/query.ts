import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { AchievementExtendedType } from "./types/AchievementType";
import { AchievementTeamType } from "./types/AchievementTeamType";


export function useMakeQuery<T>(endpoint: string): UseQueryResult<T> {
    return useQuery({queryKey: [endpoint], queryFn: () => {
        endpoint = endpoint.startsWith('/') ? endpoint : "/" + endpoint;
        endpoint = endpoint.endsWith('/') ? endpoint : endpoint + "/"
        return fetch("/api"+endpoint).then((resp) => resp.json());
    }});
}

export function useGetAchievements(): UseQueryResult<AchievementExtendedType[]> {
    return useMakeQuery("achievements");
}

export function getTeam(): UseQueryResult<AchievementTeamType> {
  return MakeQuery("achievements/team");
}

export function getTeams(): UseQueryResult<AchievementTeamType[]> {
  return MakeQuery("achievements/teams");
}
