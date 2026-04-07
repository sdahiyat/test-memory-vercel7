-- NutriTrack Initial Schema Migration
-- Creates all tables, indexes, RLS policies, and helper functions

-- ============================================================
-- TABLES
-- ============================================================

-- 1. profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  height_cm NUMERIC(5,2),
  current_weight_kg NUMERIC(5,2),
  goal_type TEXT CHECK (goal_type IN ('weight_loss', 'maintenance', 'muscle_gain')) DEFAULT 'maintenance',
  target_calories INTEGER DEFAULT 2000,
  target_protein_g INTEGER DEFAULT 150,
  target_carbs_g INTEGER DEFAULT 250,
  target_fats_g INTEGER DEFAULT 65,
  activity_level TEXT CHECK (activity_level IN ('sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active')) DEFAULT 'moderately_active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. foods table (nutrition database)
CREATE TABLE IF NOT EXISTS public.foods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brand TEXT,
  serving_size_g NUMERIC(8,2) NOT NULL DEFAULT 100,
  serving_description TEXT,
  calories_per_serving NUMERIC(8,2) NOT NULL,
  protein_g NUMERIC(8,2) NOT NULL DEFAULT 0,
  carbs_g NUMERIC(8,2) NOT NULL DEFAULT 0,
  fats_g NUMERIC(8,2) NOT NULL DEFAULT 0,
  fiber_g NUMERIC(8,2) DEFAULT 0,
  sugar_g NUMERIC(8,2) DEFAULT 0,
  sodium_mg NUMERIC(8,2) DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. meals table
CREATE TABLE IF NOT EXISTS public.meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')) DEFAULT 'snack',
  logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT,
  image_url TEXT,
  total_calories NUMERIC(8,2) NOT NULL DEFAULT 0,
  total_protein_g NUMERIC(8,2) NOT NULL DEFAULT 0,
  total_carbs_g NUMERIC(8,2) NOT NULL DEFAULT 0,
  total_fats_g NUMERIC(8,2) NOT NULL DEFAULT 0,
  source TEXT CHECK (source IN ('manual', 'ai_photo')) DEFAULT 'manual',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. meal_items table (individual foods within a meal)
CREATE TABLE IF NOT EXISTS public.meal_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_id UUID NOT NULL REFERENCES public.meals(id) ON DELETE CASCADE,
  food_id UUID REFERENCES public.foods(id) ON DELETE SET NULL,
  food_name TEXT NOT NULL,
  quantity NUMERIC(8,2) NOT NULL DEFAULT 1,
  unit TEXT NOT NULL DEFAULT 'serving',
  calories NUMERIC(8,2) NOT NULL,
  protein_g NUMERIC(8,2) NOT NULL DEFAULT 0,
  carbs_g NUMERIC(8,2) NOT NULL DEFAULT 0,
  fats_g NUMERIC(8,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. weight_logs table
CREATE TABLE IF NOT EXISTS public.weight_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  weight_kg NUMERIC(5,2) NOT NULL,
  logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_meals_user_id ON public.meals(user_id);
CREATE INDEX IF NOT EXISTS idx_meals_logged_at ON public.meals(logged_at);
CREATE INDEX IF NOT EXISTS idx_meals_user_logged ON public.meals(user_id, logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_meal_items_meal_id ON public.meal_items(meal_id);
CREATE INDEX IF NOT EXISTS idx_weight_logs_user_id ON public.weight_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_weight_logs_logged_at ON public.weight_logs(user_id, logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_foods_name ON public.foods USING gin(to_tsvector('english', name));

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Trigger for profiles updated_at
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Trigger for meals updated_at
CREATE TRIGGER meals_updated_at
  BEFORE UPDATE ON public.meals
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Function to auto-create profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$;

-- Trigger to call handle_new_user on auth.users INSERT
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weight_logs ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------
-- profiles policies
-- -----------------------------------------------
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "Users can delete their own profile"
  ON public.profiles FOR DELETE
  USING (id = auth.uid());

-- Allow insert for the trigger function (SECURITY DEFINER handles this)
CREATE POLICY "System can insert profiles"
  ON public.profiles FOR INSERT
  WITH CHECK (id = auth.uid());

-- -----------------------------------------------
-- foods policies
-- -----------------------------------------------

-- All authenticated users can view foods
CREATE POLICY "Authenticated users can view foods"
  ON public.foods FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can add foods
CREATE POLICY "Authenticated users can insert foods"
  ON public.foods FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- Users can update their own unverified foods
CREATE POLICY "Users can update their own foods"
  ON public.foods FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid() OR is_verified = FALSE)
  WITH CHECK (created_by = auth.uid() OR is_verified = FALSE);

-- Users can delete their own unverified foods
CREATE POLICY "Users can delete their own foods"
  ON public.foods FOR DELETE
  TO authenticated
  USING (created_by = auth.uid() OR is_verified = FALSE);

-- -----------------------------------------------
-- meals policies
-- -----------------------------------------------
CREATE POLICY "Users can view their own meals"
  ON public.meals FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own meals"
  ON public.meals FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own meals"
  ON public.meals FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own meals"
  ON public.meals FOR DELETE
  USING (user_id = auth.uid());

-- -----------------------------------------------
-- meal_items policies
-- -----------------------------------------------
CREATE POLICY "Users can view meal items for their meals"
  ON public.meal_items FOR SELECT
  USING (
    meal_id IN (
      SELECT id FROM public.meals WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert meal items for their meals"
  ON public.meal_items FOR INSERT
  WITH CHECK (
    meal_id IN (
      SELECT id FROM public.meals WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update meal items for their meals"
  ON public.meal_items FOR UPDATE
  USING (
    meal_id IN (
      SELECT id FROM public.meals WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    meal_id IN (
      SELECT id FROM public.meals WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete meal items for their meals"
  ON public.meal_items FOR DELETE
  USING (
    meal_id IN (
      SELECT id FROM public.meals WHERE user_id = auth.uid()
    )
  );

-- -----------------------------------------------
-- weight_logs policies
-- -----------------------------------------------
CREATE POLICY "Users can view their own weight logs"
  ON public.weight_logs FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own weight logs"
  ON public.weight_logs FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own weight logs"
  ON public.weight_logs FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own weight logs"
  ON public.weight_logs FOR DELETE
  USING (user_id = auth.uid());
