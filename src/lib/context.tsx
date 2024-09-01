import { createContext } from "react";
import { type Status } from "./types/status";
import { type User } from "./types/user";

export type HistoryContextType = {
    user: User | null;
    location: Location[],
    status: Status[]
  } | any
  
  export const HistoryContext = createContext<HistoryContextType>({});