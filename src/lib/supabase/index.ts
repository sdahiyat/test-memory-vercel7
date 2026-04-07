// Barrel export for the @/lib/supabase module
// Import from '@/lib/supabase' for all Supabase utilities and types

// Client utilities
export { createBrowserSupabaseClient, getSupabaseClient } from './client'
export { createServerSupabaseClient, createAdminSupabaseClient } from './server'

// Query helpers
export {
  getUserProfile,
  upsertUserProfile,
  getMealsForDay,
  getDailyNutritionSummary,
  createMeal,
  getMealHistory,
  searchFoods,
  logWeight,
  getWeightHistory,
} from './queries'

// Types
export type {
  Database,
  Profile,
  ProfileInsert,
  ProfileUpdate,
  Food,
  FoodInsert,
  FoodUpdate,
  Meal,
  MealInsert,
  MealUpdate,
  MealItem,
  MealItemInsert,
  MealItemUpdate,
  WeightLog,
  WeightLogInsert,
  WeightLogUpdate,
  GoalType,
  MealType,
  MealSource,
  ActivityLevel,
  Gender,
  MealWithItems,
  MealItemWithFood,
  MealWithItemsAndFoods,
} from './types'
