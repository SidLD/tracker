// api > hello > route.ts
import { api } from "@/trpc/server";
import {type NextRequest, NextResponse} from "next/server";

export type Payload = {
    username: string; 
    password: string;  
    firstName: string; 
    lastName: string; 
    middleName?: string | undefined;
    extension: string | undefined,
    title: string | undefined

}

export async function POST (request: NextRequest){
    const payload = await request.json() as Payload
    const data = await api.authentication.register(payload)
    return NextResponse.json(data);
}