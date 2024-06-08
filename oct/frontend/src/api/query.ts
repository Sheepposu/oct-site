import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { AchievementExtendedType } from "./types/AchievementType";
import { AchievementTeamType, MyAchievementTeamType } from "./types/AchievementTeamType";
import { useContext } from "react";
import { EventContext } from "src/contexts/EventContext";


function getUrl(endpoint: string): string {
  endpoint = endpoint.startsWith('/') ? endpoint : "/" + endpoint;
  endpoint = endpoint.endsWith('/') ? endpoint : endpoint + "/";
  return "/api"+endpoint;
}

export function useMakeQuery<T>(endpoint: string): UseQueryResult<T | null> {
  const dispatchEventMsg = useContext(EventContext);
  return useQuery({queryKey: [endpoint], queryFn: async () => {
    const resp = await fetch(getUrl(endpoint));
    if (resp.status !== 200) {
      dispatchEventMsg({type: "error", msg: `Error fetching ${endpoint}... try refreshing`});
      console.log(`Error fetching ${endpoint}: `, resp.text);
      return null;
    }
    return (await resp.json()).data;
  }});
}

// export async function makeQuery<T>(endpoint: string): Promise<T | null> {
//   const resp = await fetch(getUrl(endpoint));
//   const data = await resp.json();
//   if (data.error !== undefined) {
//     console.log(data.error);
//     return null;
//   }
//   return data.data;
// }

// export async function getAchievements(): Promise<AchievementExtendedType[] | null> {
//   return await makeQuery("achievements");
// }

export function useGetAchievements(): UseQueryResult<AchievementExtendedType[] | null> {
  return useMakeQuery("achievements");
}

// export async function getTeam(): Promise<MyAchievementTeamType | null> {
//   return await makeQuery("achievements/team");
// }

export function useGetTeam(): UseQueryResult<MyAchievementTeamType | null> {
  return useMakeQuery("achievements/team");
}

export function useGetTeams(): UseQueryResult<AchievementTeamType[] | null> {
  return useMakeQuery("achievements/teams");
}
