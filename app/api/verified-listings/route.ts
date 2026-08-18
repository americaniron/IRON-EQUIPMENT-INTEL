import { NextResponse } from 'next/server';
import { getVerifiedListingsStore } from '@/lib/scraper/store';

export async function GET() {
  try {
    const listings = getVerifiedListingsStore();
    return NextResponse.json({
      success: true,
      count: listings.length,
      listings
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to retrieve verified listings' },
      { status: 500 }
    );
  }
}
