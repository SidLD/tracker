// api > hello > route.ts
import { HistoryEntry } from "@/app/(authenticated)/user/_components/history";
import { api } from "@/trpc/server";
import {type NextRequest, NextResponse} from "next/server";

export type Payload = {
    id: number | undefined,
    user : string,
    dateFrom: string,
    dateTo : string
    status: number, 
    location :  number
}

export async function POST (request: NextRequest){
    const payload = await request.json() as any
    const data = await api.history.createHistory(payload) 
    return NextResponse.json(data);
}

export async function GET (request: NextRequest){
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId")!;
    const data = await api.history.getHistory({userId})
    return NextResponse.json(data);
    
}

export async function PUT (request: NextRequest){
    const payload = await request.json() as any
    const data = await api.history.updateHistory(payload)
    return NextResponse.json(data);
}

export async function DELETE (request: NextRequest){
    const payload = await request.json() as {id: string}
    const data = await api.history.deleteHistory(payload)
    return NextResponse.json(data);
}