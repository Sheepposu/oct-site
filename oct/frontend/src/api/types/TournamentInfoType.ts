import { TournamentIterationType } from "./TournamentIterationType";

export type TournamentInfoType = {
  tournament: TournamentIterationType;
  rounds: {
    name: string;
    date: string;
  }[];
};
