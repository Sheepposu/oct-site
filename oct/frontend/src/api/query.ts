import { MutationKey, QueryClientContext, UseMutationOptions, UseMutationResult, UseQueryResult, queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { AchievementExtendedType } from "./types/AchievementType";
import { AchievementTeamType, MyAchievementTeamType } from "./types/AchievementTeamType";
import { useContext } from "react";
import { EventContext, EventStateType } from "src/contexts/EventContext";
import { UndefinedInitialDataOptions } from "node_modules/@tanstack/react-query/build/legacy";
import { AchievementPlayerType } from "./types/AchievementPlayerType";


function getUrl(endpoint: string): string {
  endpoint = endpoint.startsWith('/') ? endpoint : "/" + endpoint;
  endpoint = endpoint.endsWith('/') ? endpoint : endpoint + "/";
  return "/api"+endpoint;
}

async function doFetch<T>(
  dispatchEventMsg: React.Dispatch<{
    type: EventStateType;
    msg?: string | undefined;
    id?: number | undefined;
  }>,
  endpoint: string,
  init?: RequestInit
): Promise<T> {
  const resp = await fetch(getUrl(endpoint), init);
  
  if (resp.status !== 200) {
    let errorMsg = null;
    try {
      const error = (await resp.json());
      errorMsg = error.error;
    // eslint-disable-next-line no-empty
    } catch {}

    dispatchEventMsg({type: "error", msg: `Request error${errorMsg === null ? "" : ": "+errorMsg }`});
    console.error(`Error fetching ${endpoint}: `, errorMsg);
    throw Error(errorMsg);
  }

  return (await resp.json()).data;
}

export function useMakeQuery<T>(
  query: UndefinedInitialDataOptions<T>,
  init?: RequestInit
): UseQueryResult<T> {
  const dispatchEventMsg = useContext(EventContext);
  const endpoint = query.queryKey.join("/");

  query.queryFn = () => doFetch(dispatchEventMsg, endpoint, init);

  return useQuery(queryOptions(query));
}

type SpecificUseMutationResult<T> = UseMutationResult<T, Error, object>

export function useMakeMutation<T>(
  mutation: UseMutationOptions<T, Error, object, unknown>,
  init?: RequestInit
): SpecificUseMutationResult<T> {
  const dispatchEventMsg = useContext(EventContext);
  const endpoint = (mutation.mutationKey as MutationKey).join("/");

  mutation.mutationFn = (data: object) => doFetch(dispatchEventMsg, endpoint, {body: JSON.stringify(data), ...init});

  return useMutation<T, Error, object, unknown>(mutation);
}

export function useGetAchievements(): UseQueryResult<AchievementExtendedType[]> {
  return useMakeQuery({
    queryKey: ["achievements"]
  });
}

export function useGetTeam(): UseQueryResult<MyAchievementTeamType | null> {
  return useMakeQuery({
    queryKey: ["achievements", "team"]
  });
}

export function useGetTeams(): UseQueryResult<Array<AchievementTeamType | MyAchievementTeamType>> {
  return useMakeQuery({
    queryKey: ["achievements", "teams"]
  });
}

export function useLeaveTeam(): SpecificUseMutationResult<null> {
  const queryClient = useContext(QueryClientContext);
  return useMakeMutation({
    mutationKey: ["achievements", "team", "leave"],
    onSuccess: () => {
      queryClient?.setQueryData(["achievements", "team"], () => null);
      queryClient?.setQueryData(["achievements", "teams"], (old: AchievementTeamType[]) => old.filter((team) => team.invite === undefined || (team.players as AchievementPlayerType[]).length > 1))
    }
  }, {
    method: "DELETE"
  });
}

export function useJoinTeam(): SpecificUseMutationResult<MyAchievementTeamType> {
  const queryClient = useContext(QueryClientContext);
  return useMakeMutation({
    mutationKey: ["achievements", "team", "join"],
    onSuccess: (data) => {
      queryClient?.setQueryData(["achievements", "team"], () => data);
    }
  }, {
    method: "POST"
  });
}

export function useCreateTeam(): SpecificUseMutationResult<MyAchievementTeamType> {
  const queryClient = useContext(QueryClientContext);
  return useMakeMutation({
    mutationKey: ["achievements", "team", "new"],
    onSuccess: (data) => {
      queryClient?.setQueryData(["achievements", "team"], () => data);
      queryClient?.setQueryData(["achievements", "teams"], (old: AchievementTeamType[]) => old.concat([data]));
    }
  }, {
    method: "POST"
  });
}