// api > hello > route.ts
import { api } from "@/trpc/server";
import {type NextRequest, NextResponse} from "next/server";

export async function GET(request: NextRequest) {
    try {
    const url = new URL(request.url);
      const month = url.searchParams.get('month') || '';
      const data = await api.analysis.getMonthRecords({month})
      return NextResponse.json(data);
    } catch (error) {
      console.error('Error fetching month records:', error);
      return NextResponse.json({ error: 'Failed to fetch records' }, { status: 500 });
    }
  }