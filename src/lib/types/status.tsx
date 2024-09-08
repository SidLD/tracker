export type Status = {
    id: number
    name: string
    statusCategory: StatusType[] | undefined
}

export type StatusType = {
    id: number | null ,
    name: string,
    status: Status | null,
    statusCategory: StatusType[] | undefined
}