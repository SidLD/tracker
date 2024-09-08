import { api } from "@/trpc/server";
import { type NextRequest, NextResponse } from "next/server";

export type Payload = {
    id?: string | number | null;
    name: string;
}

// Create location (POST)
export async function POST(request: NextRequest) {
    try {
        const payload = await request.json() as Payload;
        const data = await api.location.createLocation(payload);
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

// Get location (GET)
export async function GET(request: NextRequest) {
    try {
        const data = await api.location.getLocation();
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

// Update location (PUT)
export async function PUT(request: NextRequest) {
    try {
        const payload = await request.json() as Payload;
        const data = await api.location.updateLocation(payload);
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

// Delete location (DELETE)
export async function DELETE(request: NextRequest) {
    try {
        const payload = await request.json() as Payload;
        
        if (!payload.id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        const data = await api.location.deleteLocation(payload);
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
