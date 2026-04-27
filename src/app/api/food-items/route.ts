import { NextResponse } from 'next/server';
import { DEMO_FOOD_ITEMS } from '@/lib/store';

// In production this would use Supabase. For demo, uses in-memory store.
let foodItems = [...DEMO_FOOD_ITEMS];

export async function GET() {
  return NextResponse.json({ items: foodItems.filter(i => i.is_active) });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newItem = {
      ...body,
      id: `fi-${Date.now()}`,
      is_active: true,
      created_at: new Date().toISOString(),
    };
    foodItems.push(newItem);
    return NextResponse.json({ item: newItem }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    foodItems = foodItems.map(i => i.id === id ? { ...i, is_active: false } : i);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
