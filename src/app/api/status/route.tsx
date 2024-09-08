import { api } from "@/trpc/server";
import { type NextRequest, NextResponse } from "next/server";

export type Payload = {
    id: any | undefined,
    name: string;
}

// Create status (POST)
export async function POST(request: NextRequest) {
    try {
        const payload = await request.json() as Payload;
        const data = await api.status.createStatus(payload);
        return NextResponse.json(data);
    } catch (error:any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

// Get status (GET)
export async function GET(request: NextRequest) {
    try {
        const data = await api.status.getStatus();
        return NextResponse.json(data);
    } catch (error:any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

// Update status (PUT)
export async function PUT(request: NextRequest) {
    try {
        const payload = await request.json() as Payload;
        const data = await api.status.updateStatus(payload);
        return NextResponse.json(data);
    } catch (error:any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

// Delete status (DELETE)
export async function DELETE(request: NextRequest) {
    try {
        const payload = await request.json() as Payload;
        
        if (!payload.id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        const data = await api.status.deleteStatus({
            id: payload.id,
            name: ""
        });
        return NextResponse.json(data);
    } catch (error:any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
