// api > hello > route.ts
import { api } from "@/trpc/server";
import {type NextRequest, NextResponse} from "next/server";

export type Payload = {
    id: any | null,
    location: any | undefined,
    name: string;   
}

export async function POST (request: NextRequest){
    const payload = await request.json() as Payload
    const data = await api.destination.createDestination(payload)
    return NextResponse.json(data);
}

export async function GET (request: NextRequest){
    const { searchParams } = new URL(request.url);
    const location = searchParams.get("location")!;
    const data = await api.destination.getDestination({
        location: parseInt(location)
    })
    return NextResponse.json(data)
}

export async function DELETE (request: NextRequest){
    const payload = await request.json() as Payload
    const data = await api.destination.deleteDestination(payload)
    return NextResponse.json(data);
}