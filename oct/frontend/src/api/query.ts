import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { AchievementExtendedType } from "./types/AchievementType";


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
