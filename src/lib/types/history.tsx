
import { StatusType, type Status } from "./status";
import { type User } from "./user";
import { type Destination, type Location } from "./location";

export type History = {
    [x: string]: any;
    id: string | undefined
    user : User,
    dateFrom: Date,
    dateTo : Date
    location : Location,
    purpose: string,
    documentTracker: string,
    fundSource: string,
    statustype: StatusType | undefined,
    destination: Destination[] | undefined
}