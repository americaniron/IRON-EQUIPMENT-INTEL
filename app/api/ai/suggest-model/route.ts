import { NextRequest, NextResponse } from 'next/server';
import { expandModelTarget } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const { manufacturer, model, category } = await req.json();
    if (!manufacturer || !model) {
      return NextResponse.json(
        { success: false, error: 'Manufacturer and Model are required' },
        { status: 400 }
      );
    }
    const result = await expandModelTarget(manufacturer, model, category);
    return NextResponse.json({ success: true, suggestions: result });
  } catch (error: any) {
    console.error('Error in /api/ai/suggest-model:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to expand model target' },
      { status: 500 }
    );
  }
}
