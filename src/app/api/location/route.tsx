// api > hello > route.ts
import { api } from "@/trpc/server";
import {type NextRequest, NextResponse} from "next/server";

export type Payload = {
    id: any | undefined,
    name: string;
}

export async function POST (request: NextRequest){
    const payload = await request.json() as Payload
    const data = await api.location.createLocation(payload)
    return NextResponse.json(data);
}

export async function GET (request: NextRequest){
    const data = await api.location.getLocation()
    return NextResponse.json(data);
}

export async function PUT (request: NextRequest){
    const payload = await request.json() as Payload
    const data = await api.location.updateLocation(payload)
    return NextResponse.json(data);
}

export async function DELETE (request: NextRequest){
    const payload = await request.json() as Payload
    const data = await api.location.deleteLocation(payload)
    return NextResponse.json(data);
}