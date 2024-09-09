import { type Role } from "./role";
import { StatusType, type Status } from "./status";
import { type User } from "./user";
import { type Destination, type Location } from "./location";

export type History = {
    id: string | undefined
    user : User,
    dateFrom: Date,
    dateTo : Date
    status: Status, 
    role: Role,
    location : Location,
    statustype: StatusType | undefined,
    destination: Destination | undefined
}