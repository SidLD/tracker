export type Location = {
    id: number
    name: string
}

export type Destination = {
    id: number | null ,
    name: string,
    location: Location | null,
}