// api > hello > route.ts
import { api } from "@/trpc/server";
import {type NextRequest, NextResponse} from "next/server";

export type Payload = {
    id: any | undefined,
    name: string;
}

export async function POST (request: NextRequest){
    const payload = await request.json() as Payload
    const data = await api.role.createRole(payload)
    return NextResponse.json(data);
}

export async function GET (request: NextRequest){
    const data = await api.role.getRole()
    return NextResponse.json(data);
}

export async function PUT (request: NextRequest){
    const payload = await request.json() as Payload
    const data = await api.role.updateRole(payload)
    return NextResponse.json(data);
}

export async function DELETE (request: NextRequest){
    const payload = await request.json() as Payload
    const data = await api.role.deleteRole(payload)
    return NextResponse.json(data);
}