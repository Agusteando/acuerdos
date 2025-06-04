import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { entryIds } = await req.json();
    if (!Array.isArray(entryIds)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
    // Placeholder for WhatsApp integration using the same API as the original project.
    await new Promise(resolve => setTimeout(resolve, 500));
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('WhatsApp send error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
