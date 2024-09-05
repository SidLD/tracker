// api > hello > route.ts
import { api } from "@/trpc/server";
import {type NextRequest, NextResponse} from "next/server";

export type Payload = {
    id: any | null,
    status: any | undefined,
    name: string;   
}

export async function POST (request: NextRequest){
    const payload = await request.json() as Payload
    const data = await api.statustype.createStatusTypes(payload)
    return NextResponse.json(data);
}

export async function GET (request: NextRequest){
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status")!;
    const data = await api.statustype.getStatusTypes({
        status: parseInt(status)
    })
    return NextResponse.json(data)
}

export async function DELETE (request: NextRequest){
    const payload = await request.json() as Payload
    const data = await api.status.deleteStatus(payload)
    return NextResponse.json(data);
}