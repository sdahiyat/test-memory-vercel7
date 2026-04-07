// Client utilities
export { createClient as createBrowserSupabaseClient } from './client'
export { createClient as createServerSupabaseClient, createAdminClient } from './server'

// Helper functions
export {
  getUserProfile,
  upsertUserProfile,
  getDailyMeals,
  getDailyNutritionSummary,
  getWeightLogs,
  searchFoods,
} from './helpers'

// Types
export type {
  Database,
  Profile,
  ProfileInsert,
  ProfileUpdate,
  Food,
  FoodInsert,
  Meal,
  MealInsert,
  MealUpdate,
  MealItem,
  MealItemInsert,
  WeightLog,
  WeightLogInsert,
  MealWithItems,
  DailyNutritionSummary,
  GoalType,
  ActivityLevel,
  MealType,
} from './types'
