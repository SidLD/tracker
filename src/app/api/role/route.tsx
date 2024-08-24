// api > hello > route.ts
import { api } from "@/trpc/server";
import {type NextRequest, NextResponse} from "next/server";

export type Payload = {
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