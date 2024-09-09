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
    role: string;
}

export async function POST(request: NextRequest) {
    try {
        const payload = await request.json() as Payload;
        const data = await api.user.createUser(payload);
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in POST /api/hello:', error);
        return NextResponse.json({ error: (error as Error).message || 'An unexpected error occurred' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const data = await api.user.getUsers();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in GET /api/hello:', error);
        return NextResponse.json({ error: (error as Error).message || 'An unexpected error occurred' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const payload = await request.json() as Payload2;
        const data = await api.user.updateUser(payload);
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in PUT /api/hello:', error);
        return NextResponse.json({ error: (error as Error).message || 'An unexpected error occurred' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const payload = await request.json() as Payload;
        if (!payload.id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }
        const data = await api.user.deletUser({
            id: payload.id,
        });
        return NextResponse.json(data);
    } catch (error:any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
