import { SupabaseClient } from '@supabase/supabase-js'
import {
  Database,
  Profile,
  ProfileInsert,
  Food,
  Meal,
  MealWithItems,
  WeightLog,
  DailyNutritionSummary,
} from './types'

type TypedSupabaseClient = SupabaseClient<Database>

/**
 * Fetches a user's profile by their user ID.
 * Returns null if not found.
 */
export async function getUserProfile(
  supabase: TypedSupabaseClient,
  userId: string
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('getUserProfile error:', error.message)
    return null
  }

  return data
}

/**
 * Upserts a user profile row (insert or update on conflict).
 * Returns the updated profile.
 */
export async function upsertUserProfile(
  supabase: TypedSupabaseClient,
  profile: ProfileInsert & { id: string }
): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .upsert(profile, { onConflict: 'id' })
    .select()
    .single()

  if (error) {
    throw new Error(`upsertUserProfile error: ${error.message}`)
  }

  return data
}

/**
 * Fetches all meals (with their items) for a given user on a specific date.
 * Date should be an ISO date string (e.g. '2024-01-15').
 */
export async function getDailyMeals(
  supabase: TypedSupabaseClient,
  userId: string,
  date: string
): Promise<MealWithItems[]> {
  const startOfDay = `${date}T00:00:00.000Z`
  const endOfDay = `${date}T23:59:59.999Z`

  const { data, error } = await supabase
    .from('meals')
    .select('*, meal_items(*)')
    .eq('user_id', userId)
    .gte('logged_at', startOfDay)
    .lte('logged_at', endOfDay)
    .order('logged_at', { ascending: true })

  if (error) {
    throw new Error(`getDailyMeals error: ${error.message}`)
  }

  return (data as MealWithItems[]) ?? []
}

/**
 * Aggregates nutrition totals for a given user on a specific date.
 * Returns a DailyNutritionSummary object.
 */
export async function getDailyNutritionSummary(
  supabase: TypedSupabaseClient,
  userId: string,
  date: string
): Promise<DailyNutritionSummary> {
  const meals = await getDailyMeals(supabase, userId, date)

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
    date,
    ...totals,
    meals,
  }
}

/**
 * Fetches weight log entries for a user, ordered by date descending.
 * Defaults to the most recent 30 entries.
 */
export async function getWeightLogs(
  supabase: TypedSupabaseClient,
  userId: string,
  limit: number = 30
): Promise<WeightLog[]> {
  const { data, error } = await supabase
    .from('weight_logs')
    .select('*')
    .eq('user_id', userId)
    .order('logged_at', { ascending: false })
    .limit(limit)

  if (error) {
    throw new Error(`getWeightLogs error: ${error.message}`)
  }

  return data ?? []
}

/**
 * Searches the foods table by name (case-insensitive).
 * Returns public foods and any custom foods created by the current user.
 * Defaults to 20 results.
 */
export async function searchFoods(
  supabase: TypedSupabaseClient,
  query: string,
  limit: number = 20
): Promise<Food[]> {
  // Get the current user to include their custom foods in results
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let dbQuery = supabase
    .from('foods')
    .select('*')
    .ilike('name', `%${query}%`)
    .order('name', { ascending: true })
    .limit(limit)

  // Filter: public foods (is_custom = false) OR created by the current user
  if (user) {
    dbQuery = dbQuery.or(`is_custom.eq.false,created_by.eq.${user.id}`)
  } else {
    dbQuery = dbQuery.eq('is_custom', false)
  }

  const { data, error } = await dbQuery

  if (error) {
    throw new Error(`searchFoods error: ${error.message}`)
  }

  return data ?? []
}
