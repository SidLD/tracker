// api > hello > route.ts
import { api } from "@/trpc/server";
import {type NextRequest, NextResponse} from "next/server";

export type Payload = {
    id: any | undefined,
    name: string;
}

export async function POST (request: NextRequest){
    const payload = await request.json() as Payload
    const data = await api.status.createStatus(payload)
    return NextResponse.json(data);
}

export async function GET (request: NextRequest){
    const data = await api.status.getStatus()
    return NextResponse.json(data);
}

export async function PUT (request: NextRequest){
    const payload = await request.json() as Payload
    const data = await api.status.updateStatus(payload)
    return NextResponse.json(data);
}

export async function DELETE (request: NextRequest){
    const payload = await request.json() as Payload
    const data = await api.status.deleteStatus(payload)
    return NextResponse.json(data);
}