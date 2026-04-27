import { NextResponse } from 'next/server';
import type { Reservation } from '@/types';

const reservations: Reservation[] = [];

export async function GET() {
  return NextResponse.json({ reservations });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newReservation: Reservation = {
      id: `res-${Date.now()}`,
      recipe_id: body.recipe_id,
      family_code: body.family_code ?? `FAM-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      reserved_at: new Date().toISOString(),
      status: 'confirmed',
    };
    reservations.push(newReservation);
    return NextResponse.json({ reservation: newReservation }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
