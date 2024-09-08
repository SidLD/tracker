export type Location = {
    id: number
    name: string
    destinations: Destination[] | undefined
}

export type Destination = {
    id: number | null ,
    name: string,
    location: Location | null,
}