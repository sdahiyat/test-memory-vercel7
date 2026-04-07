// ============================================================
// Enum / Union Types
// ============================================================

export type GoalType = 'weight_loss' | 'maintenance' | 'muscle_gain'
export type ActivityLevel =
  | 'sedentary'
  | 'lightly_active'
  | 'moderately_active'
  | 'very_active'
  | 'extremely_active'
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

// ============================================================
// Row Types (mirror database tables)
// ============================================================

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  goal_type: GoalType | null
  target_calories: number
  target_protein_g: number | null
  target_carbs_g: number | null
  target_fats_g: number | null
  current_weight_kg: number | null
  height_cm: number | null
  date_of_birth: string | null
  activity_level: ActivityLevel | null
  created_at: string
  updated_at: string
}

export interface Food {
  id: string
  name: string
  brand: string | null
  serving_size_g: number
  calories_per_serving: number
  protein_g: number
  carbs_g: number
  fats_g: number
  fiber_g: number | null
  sugar_g: number | null
  sodium_mg: number | null
  is_custom: boolean
  created_by: string | null
  created_at: string
}

export interface Meal {
  id: string
  user_id: string
  name: string
  meal_type: MealType | null
  logged_at: string
  photo_url: string | null
  notes: string | null
  total_calories: number
  total_protein_g: number
  total_carbs_g: number
  total_fats_g: number
  created_at: string
  updated_at: string
}

export interface MealItem {
  id: string
  meal_id: string
  food_id: string | null
  food_name: string
  serving_size_g: number
  quantity: number
  calories: number
  protein_g: number
  carbs_g: number
  fats_g: number
  created_at: string
}

export interface WeightLog {
  id: string
  user_id: string
  weight_kg: number
  logged_at: string
  notes: string | null
  created_at: string
}

// ============================================================
// Compound / API Response Types
// ============================================================

export type MealWithItems = Meal & { meal_items: MealItem[] }

export type DailyNutritionSummary = {
  date: string
  total_calories: number
  total_protein_g: number
  total_carbs_g: number
  total_fats_g: number
  meals: MealWithItems[]
}

// ============================================================
// Insert / Update Variants
// ============================================================

export type ProfileInsert = Omit<Profile, 'id' | 'created_at' | 'updated_at'>
export type ProfileUpdate = Partial<ProfileInsert>

export type MealInsert = Omit<Meal, 'id' | 'created_at' | 'updated_at'>
export type MealUpdate = Partial<Omit<MealInsert, 'user_id'>>

export type MealItemInsert = Omit<MealItem, 'id' | 'created_at'>

export type FoodInsert = Omit<Food, 'id' | 'created_at'>

export type WeightLogInsert = Omit<WeightLog, 'id' | 'created_at'>

// ============================================================
// Database Generic Type (for typed Supabase client)
// ============================================================

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: ProfileInsert & { id: string }
        Update: ProfileUpdate
      }
      foods: {
        Row: Food
        Insert: FoodInsert
        Update: Partial<FoodInsert>
      }
      meals: {
        Row: Meal
        Insert: MealInsert
        Update: MealUpdate
      }
      meal_items: {
        Row: MealItem
        Insert: MealItemInsert
        Update: Partial<MealItemInsert>
      }
      weight_logs: {
        Row: WeightLog
        Insert: WeightLogInsert
        Update: Partial<WeightLogInsert>
      }
    }
  }
}
