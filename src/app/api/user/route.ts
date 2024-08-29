// api > hello > route.ts
import { api } from "@/trpc/server";
import {type NextRequest, NextResponse} from "next/server";

export type Payload = {
    id: string| undefined,
    username: string; 
    password: string;  
    firstName: string; 
    lastName: string; 
    middleName?: string | undefined;
    extension: string | undefined,
    title: string | undefined,
    role: string
}

export type Payload2 = {
    id: string,
    username: string; 
    password: string;  
    firstName: string; 
    lastName: string; 
    middleName?: string | undefined;
    extension: string | undefined,
    title: string | undefined,
    role: string
}


export async function POST (request: NextRequest){
    const payload = await request.json() as Payload
    const data = await api.user.createUser(payload)
    return NextResponse.json(data);
}

export async function GET (request: NextRequest){
    const data = await api.user.getUsers()
    return NextResponse.json(data);
}

export async function PUT (request: NextRequest){
    const payload = await request.json() as Payload2
    console.log(payload)
    const data = await api.user.updateUser(payload)
    return NextResponse.json(data);
}