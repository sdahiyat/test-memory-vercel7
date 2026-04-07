// TypeScript type definitions generated from the NutriTrack database schema
// These types provide full type safety when interacting with Supabase

// ============================================================
// ENUM TYPES
// ============================================================

export type GoalType = 'weight_loss' | 'maintenance' | 'muscle_gain'
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'
export type MealSource = 'manual' | 'ai_photo'
export type ActivityLevel =
  | 'sedentary'
  | 'lightly_active'
  | 'moderately_active'
  | 'very_active'
  | 'extra_active'
export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say'

// ============================================================
// ROW TYPES (exact DB shape)
// ============================================================

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  date_of_birth: string | null
  gender: Gender | null
  height_cm: number | null
  current_weight_kg: number | null
  goal_type: GoalType
  target_calories: number
  target_protein_g: number
  target_carbs_g: number
  target_fats_g: number
  activity_level: ActivityLevel
  created_at: string
  updated_at: string
}

export interface Food {
  id: string
  name: string
  brand: string | null
  serving_size_g: number
  serving_description: string | null
  calories_per_serving: number
  protein_g: number
  carbs_g: number
  fats_g: number
  fiber_g: number | null
  sugar_g: number | null
  sodium_mg: number | null
  is_verified: boolean
  created_by: string | null
  created_at: string
}

export interface Meal {
  id: string
  user_id: string
  name: string | null
  meal_type: MealType
  logged_at: string
  notes: string | null
  image_url: string | null
  total_calories: number
  total_protein_g: number
  total_carbs_g: number
  total_fats_g: number
  source: MealSource
  created_at: string
  updated_at: string
}

export interface MealItem {
  id: string
  meal_id: string
  food_id: string | null
  food_name: string
  quantity: number
  unit: string
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
// INSERT TYPES (auto-generated fields are optional)
// ============================================================

export interface ProfileInsert {
  id: string // Required — must match auth.users.id
  email: string
  full_name?: string | null
  avatar_url?: string | null
  date_of_birth?: string | null
  gender?: Gender | null
  height_cm?: number | null
  current_weight_kg?: number | null
  goal_type?: GoalType
  target_calories?: number
  target_protein_g?: number
  target_carbs_g?: number
  target_fats_g?: number
  activity_level?: ActivityLevel
  created_at?: string
  updated_at?: string
}

export interface FoodInsert {
  id?: string
  name: string
  brand?: string | null
  serving_size_g?: number
  serving_description?: string | null
  calories_per_serving: number
  protein_g?: number
  carbs_g?: number
  fats_g?: number
  fiber_g?: number | null
  sugar_g?: number | null
  sodium_mg?: number | null
  is_verified?: boolean
  created_by?: string | null
  created_at?: string
}

export interface MealInsert {
  id?: string
  user_id: string
  name?: string | null
  meal_type?: MealType
  logged_at?: string
  notes?: string | null
  image_url?: string | null
  total_calories?: number
  total_protein_g?: number
  total_carbs_g?: number
  total_fats_g?: number
  source?: MealSource
  created_at?: string
  updated_at?: string
}

export interface MealItemInsert {
  id?: string
  meal_id: string
  food_id?: string | null
  food_name: string
  quantity?: number
  unit?: string
  calories: number
  protein_g?: number
  carbs_g?: number
  fats_g?: number
  created_at?: string
}

export interface WeightLogInsert {
  id?: string
  user_id: string
  weight_kg: number
  logged_at?: string
  notes?: string | null
  created_at?: string
}

// ============================================================
// UPDATE TYPES (all fields optional except id)
// ============================================================

export interface ProfileUpdate {
  id?: string
  email?: string
  full_name?: string | null
  avatar_url?: string | null
  date_of_birth?: string | null
  gender?: Gender | null
  height_cm?: number | null
  current_weight_kg?: number | null
  goal_type?: GoalType
  target_calories?: number
  target_protein_g?: number
  target_carbs_g?: number
  target_fats_g?: number
  activity_level?: ActivityLevel
  updated_at?: string
}

export interface FoodUpdate {
  id?: string
  name?: string
  brand?: string | null
  serving_size_g?: number
  serving_description?: string | null
  calories_per_serving?: number
  protein_g?: number
  carbs_g?: number
  fats_g?: number
  fiber_g?: number | null
  sugar_g?: number | null
  sodium_mg?: number | null
  is_verified?: boolean
  created_by?: string | null
}

export interface MealUpdate {
  id?: string
  user_id?: string
  name?: string | null
  meal_type?: MealType
  logged_at?: string
  notes?: string | null
  image_url?: string | null
  total_calories?: number
  total_protein_g?: number
  total_carbs_g?: number
  total_fats_g?: number
  source?: MealSource
  updated_at?: string
}

export interface MealItemUpdate {
  id?: string
  meal_id?: string
  food_id?: string | null
  food_name?: string
  quantity?: number
  unit?: string
  calories?: number
  protein_g?: number
  carbs_g?: number
  fats_g?: number
}

export interface WeightLogUpdate {
  id?: string
  user_id?: string
  weight_kg?: number
  logged_at?: string
  notes?: string | null
}

// ============================================================
// DATABASE INTERFACE (Supabase generated types pattern)
// ============================================================

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: ProfileInsert
        Update: ProfileUpdate
      }
      foods: {
        Row: Food
        Insert: FoodInsert
        Update: FoodUpdate
      }
      meals: {
        Row: Meal
        Insert: MealInsert
        Update: MealUpdate
      }
      meal_items: {
        Row: MealItem
        Insert: MealItemInsert
        Update: MealItemUpdate
      }
      weight_logs: {
        Row: WeightLog
        Insert: WeightLogInsert
        Update: WeightLogUpdate
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      goal_type: GoalType
      meal_type: MealType
      meal_source: MealSource
      activity_level: ActivityLevel
      gender: Gender
    }
  }
}

// ============================================================
// JOINED / CONVENIENCE TYPES
// ============================================================

export type MealWithItems = Meal & {
  meal_items: MealItem[]
}

export type MealItemWithFood = MealItem & {
  foods: Food | null
}

export type MealWithItemsAndFoods = Meal & {
  meal_items: MealItemWithFood[]
}
