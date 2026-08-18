import { NextRequest, NextResponse } from 'next/server';
import { analyzeEquipment, EquipmentAnalysisRequest } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body: EquipmentAnalysisRequest = await req.json();
    const result = await analyzeEquipment(body);
    return NextResponse.json({ success: true, analysis: result });
  } catch (error: any) {
    console.error('Error in /api/ai/analyze:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to analyze equipment listing' },
      { status: 500 }
    );
  }
}
