import { NextResponse } from 'next/server';
import { runScheduledScan } from '@/lib/scraper/orchestrator';

export async function POST(req: Request) {
  try {
    const result = await runScheduledScan();
    return NextResponse.json({
      success: true,
      message: `Global scheduled scan completed in ${result.durationMs || 0}ms.`,
      summary: result,
    });
  } catch (error: any) {
    console.error('Scan execution error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || String(error) },
      { status: 500 }
    );
  }
}

