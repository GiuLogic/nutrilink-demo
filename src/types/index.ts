export interface FoodItem {
  id: string;
  name: string;
  category: 'verdura' | 'fruta' | 'proteina' | 'cereal' | 'lacteo' | 'otro';
  quantity_kg: number;
  expiry_date: string;
  nutritional_value?: {
    calories_per_100g: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
    fiber_g?: number;
    source?: string;
  };
  market_price?: {
    price_eur_per_kg: number;
    total_value_eur: number;
    trend: 'stable' | 'rising' | 'falling';
    trend_pct: number;
    source?: string;
  };
  is_active: boolean;
  created_at: string;
}

export type DietaryTag = 'halal' | 'vegetariano' | 'sin_gluten' | 'sin_lactosa' | 'sin_frutos_secos';

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: { item: string; amount: string; amount_g?: number }[];
  instructions: string[];
  nutritional_summary: {
    calories: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
    fiber_g?: number;
    is_balanced: boolean;
    validated: boolean;
    validation_source?: string;
  };
  dietary_tags: DietaryTag[];
  servings: number;
  prep_time_min: number;
  available_until: string;
  reservations_count: number;
  max_reservations: number;
  generated_at: string;
  is_active: boolean;
}

export interface Reservation {
  id: string;
  recipe_id: string;
  family_code: string;
  reserved_at: string;
  status: 'pending' | 'confirmed' | 'completed';
}

export interface ImpactMetrics {
  week_of: string;
  kg_rescued: number;
  economic_value_eur: number;
  portions_generated: number;
  balanced_portions: number;
  families_served: number;
  co2_saved_kg: number;
}

export interface PredictionData {
  day_of_week: string;
  predicted_categories: { category: string; probability: number; avg_kg: number }[];
  confidence: number;
}

export interface InflationAlert {
  food_name: string;
  trend_pct: number;
  impact: 'low' | 'medium' | 'high';
  message: string;
}
