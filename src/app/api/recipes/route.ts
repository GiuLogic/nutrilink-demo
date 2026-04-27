import { NextResponse } from 'next/server';
import { DEMO_RECIPES } from '@/lib/store';
import type { Recipe } from '@/types';

// In production this would use Supabase.
let recipes: Recipe[] = [...DEMO_RECIPES];

export async function GET() {
  return NextResponse.json({ recipes: recipes.filter(r => r.is_active) });
}

export async function POST(request: Request) {
  try {
    const { recipes: newRecipes }: { recipes: Recipe[] } = await request.json();
    recipes = [...newRecipes, ...recipes];
    return NextResponse.json({ recipes: newRecipes }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
