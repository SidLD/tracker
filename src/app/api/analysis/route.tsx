// api > hello > route.ts
import { api } from "@/trpc/server";
import {type NextRequest, NextResponse} from "next/server";

export async function GET (request: NextRequest){
    const data = await api.analysis.getAnalysis()
    return NextResponse.json(data);
}