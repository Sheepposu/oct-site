import { createContext } from "react";
import { Dispatch } from "react";

export const ErrorContext = createContext(((value: string) => {console.log(value)}) as Dispatch<string>);