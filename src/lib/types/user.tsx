import { Role } from "./role";

export type User = {
    id: string,
    title: string,
    firstName: string,
    middleName: string,
    lastName: string,
    role: Role,
    updatedAt: Date,
}