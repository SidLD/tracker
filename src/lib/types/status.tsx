export type Status = {
    id: number
    name: string
}

export type StatusType = {
    id: number | null ,
    name: string,
    status: Status | null,
}