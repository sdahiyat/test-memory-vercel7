import type { SupabaseClient } from '@supabase/supabase-js'
import type {
  Database,
  Profile,
  ProfileInsert,
  Food,
  Meal,
  MealInsert,
  MealItem,
  MealItemInsert,
  WeightLog,
  MealWithItems,
  MealWithItemsAndFoods,
} from './types'

type SupabaseDb = SupabaseClient<Database>

// ============================================================
// PROFILE QUERIES
// ============================================================

/**
 * Fetches a user's profile by their user ID.
 * Returns null if no profile exists.
 */
export async function getUserProfile(
  supabase: SupabaseDb,
  userId: string
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // Row not found
      return null
    }
    throw new Error(`Failed to fetch user profile: ${error.message}`)
  }

  return data
}

/**
 * Upserts (insert or update) a user profile row.
 * Returns the updated profile.
 */
export async function upsertUserProfile(
  supabase: SupabaseDb,
  profile: ProfileInsert
): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .upsert(profile)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to upsert user profile: ${error.message}`)
  }

  return data
}

// ============================================================
// MEAL QUERIES
// ============================================================

/**
 * Fetches all meals for a given user on a specific date (YYYY-MM-DD).
 * Joins meal_items and their associated foods.
 */
export async function getMealsForDay(
  supabase: SupabaseDb,
  userId: string,
  date: string
): Promise<MealWithItemsAndFoods[]> {
  // Compute day boundaries
  const startDate = new Date(`${date}T00:00:00.000Z`)
  const endDate = new Date(startDate)
  endDate.setUTCDate(endDate.getUTCDate() + 1)

  const startISO = startDate.toISOString()
  const endISO = endDate.toISOString()

  const { data, error } = await supabase
    .from('meals')
    .select(`
      *,
      meal_items (
        *,
        foods (*)
      )
    `)
    .eq('user_id', userId)
    .gte('logged_at', startISO)
    .lt('logged_at', endISO)
    .order('logged_at', { ascending: true })

  if (error) {
    throw new Error(`Failed to fetch meals for day: ${error.message}`)
  }

  return (data ?? []) as MealWithItemsAndFoods[]
}

/**
 * Returns a daily nutrition summary for a given date, including
 * the totals across all meals and the full meal list with items.
 */
export async function getDailyNutritionSummary(
  supabase: SupabaseDb,
  userId: string,
  date: string
): Promise<{
  total_calories: number
  total_protein_g: number
  total_carbs_g: number
  total_fats_g: number
  meals: MealWithItemsAndFoods[]
}> {
  const meals = await getMealsForDay(supabase, userId, date)

  const totals = meals.reduce(
    (acc, meal) => ({
      total_calories: acc.total_calories + (meal.total_calories ?? 0),
      total_protein_g: acc.total_protein_g + (meal.total_protein_g ?? 0),
      total_carbs_g: acc.total_carbs_g + (meal.total_carbs_g ?? 0),
      total_fats_g: acc.total_fats_g + (meal.total_fats_g ?? 0),
    }),
    {
      total_calories: 0,
      total_protein_g: 0,
      total_carbs_g: 0,
      total_fats_g: 0,
    }
  )

  return {
    ...totals,
    meals,
  }
}

/**
 * Creates a new meal along with its meal items in a single operation.
 * Inserts the meal first, then inserts all items using the new meal's ID.
 * Returns the full meal with all items.
 */
export async function createMeal(
  supabase: SupabaseDb,
  meal: MealInsert,
  items: Omit<MealItemInsert, 'meal_id'>[]
): Promise<MealWithItems> {
  // Insert the meal
  const { data: newMeal, error: mealError } = await supabase
    .from('meals')
    .insert(meal)
    .select()
    .single()

  if (mealError) {
    throw new Error(`Failed to create meal: ${mealError.message}`)
  }

  // Insert all meal items with the new meal's ID
  const mealItemsWithId: MealItemInsert[] = items.map((item) => ({
    ...item,
    meal_id: newMeal.id,
  }))

  let insertedItems: MealItem[] = []

  if (mealItemsWithId.length > 0) {
    const { data: newItems, error: itemsError } = await supabase
      .from('meal_items')
      .insert(mealItemsWithId)
      .select()

    if (itemsError) {
      throw new Error(`Failed to create meal items: ${itemsError.message}`)
    }

    insertedItems = newItems ?? []
  }

  return {
    ...newMeal,
    meal_items: insertedItems,
  }
}

/**
 * Fetches recent meals for a user, ordered by most recent first.
 * Defaults to the past 90 days.
 */
export async function getMealHistory(
  supabase: SupabaseDb,
  userId: string,
  days: number = 90
): Promise<Meal[]> {
  const since = new Date()
  since.setUTCDate(since.getUTCDate() - days)

  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .eq('user_id', userId)
    .gte('logged_at', since.toISOString())
    .order('logged_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch meal history: ${error.message}`)
  }

  return data ?? []
}

// ============================================================
// FOOD QUERIES
// ============================================================

/**
 * Searches the foods table by name using a case-insensitive LIKE query.
 * Returns up to `limit` results (default 20).
 */
export async function searchFoods(
  supabase: SupabaseDb,
  query: string,
  limit: number = 20
): Promise<Food[]> {
  const { data, error } = await supabase
    .from('foods')
    .select('*')
    .ilike('name', `%${query}%`)
    .limit(limit)
    .order('is_verified', { ascending: false }) // Show verified foods first
    .order('name', { ascending: true })

  if (error) {
    throw new Error(`Failed to search foods: ${error.message}`)
  }

  return data ?? []
}

// ============================================================
// WEIGHT LOG QUERIES
// ============================================================

/**
 * Logs a new weight entry for a user.
 * Returns the created weight log entry.
 */
export async function logWeight(
  supabase: SupabaseDb,
  userId: string,
  weight_kg: number,
  logged_at?: string
): Promise<WeightLog> {
  const { data, error } = await supabase
    .from('weight_logs')
    .insert({
      user_id: userId,
      weight_kg,
      ...(logged_at ? { logged_at } : {}),
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to log weight: ${error.message}`)
  }

  return data
}

/**
 * Fetches weight log history for a user.
 * Defaults to the past 90 days, ordered chronologically (oldest first).
 */
export async function getWeightHistory(
  supabase: SupabaseDb,
  userId: string,
  days: number = 90
): Promise<WeightLog[]> {
  const since = new Date()
  since.setUTCDate(since.getUTCDate() - days)

  const { data, error } = await supabase
    .from('weight_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('logged_at', since.toISOString())
    .order('logged_at', { ascending: true })

  if (error) {
    throw new Error(`Failed to fetch weight history: ${error.message}`)
  }

  return data ?? []
}
