import { api } from "@/trpc/server";
import { type NextRequest, NextResponse } from "next/server";

export type Payload = {
    id?: string;
    username: string; 
    password: string;  
    firstName: string; 
    lastName: string; 
    middleName?: string;
    extension?: string;
    title?: string;
    role: string;
}

export type Payload2 = {
    id: string;
    username: string; 
    password: string;  
    firstName: string; 
    lastName: string; 
    middleName?: string;
    extension?: string;
    title?: string;
}

export async function POST(request: NextRequest) {
    try {
        const payload = await request.json() as Payload;
        const data = await api.authentication.register(payload);
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in POST /api/hello:', error);
        return NextResponse.json({ error: (error as Error).message || 'An unexpected error occurred' }, { status: 500 });
    }
}
