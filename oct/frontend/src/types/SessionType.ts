import { UserExtendedType } from "../api/types/UserType";

export type Session = {
  isAuthenticated: boolean;
  user: UserExtendedType | null;
  authUrl: string;
  wsUri: string;
  debug: boolean;
};
