import { api } from "@/trpc/server";
import { type NextRequest, NextResponse } from "next/server";

export type Payload = {
    id: any | null,
    status: any | undefined,
    name: string;   
}

export async function POST(request: NextRequest) {
    try {
        const payload = await request.json() as Payload;
        const data = await api.statustype.createStatusTypes(payload);
        return NextResponse.json(data);
    } catch (error:any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status")!;
        
        if (!status) {
            return NextResponse.json({ error: "Status is required" }, { status: 400 });
        }

        const data = await api.statustype.getStatusTypes({
            status: parseInt(status),
        });

        return NextResponse.json(data);
    } catch (error:any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const payload = await request.json() as Payload;
        
        if (!payload.id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        const data = await api.statustype.deleteStatusType({ id: payload.id });
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
