import { NextResponse } from 'next/server';
import { seedTargetModels, seedSuperAdmin } from '@/lib/seed';

export async function POST(req: Request) {
  try {
    await seedTargetModels();
    // Assuming user email from prompt metadata
    await seedSuperAdmin('ahmed-admin-id', 'ahmed@americanironus.com');
    return NextResponse.json({ success: true, message: 'Database seeded' });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
