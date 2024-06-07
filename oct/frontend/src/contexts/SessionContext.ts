import { createContext } from "react";
import { getSessionData } from "src/util/auth";

export const SessionContext = createContext(getSessionData());
