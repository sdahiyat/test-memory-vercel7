-- NutriTrack Initial Schema Migration
-- Creates all tables, indexes, triggers, and RLS policies

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to auto-create profile when a new user registers
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- TABLE: profiles
-- Extends auth.users with nutrition goals and personal data
-- ============================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id                uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email             text NOT NULL,
  full_name         text,
  avatar_url        text,
  goal_type         text CHECK (goal_type IN ('weight_loss', 'maintenance', 'muscle_gain')),
  target_calories   integer DEFAULT 2000,
  target_protein_g  numeric,
  target_carbs_g    numeric,
  target_fats_g     numeric,
  current_weight_kg numeric,
  height_cm         numeric,
  date_of_birth     date,
  activity_level    text CHECK (activity_level IN ('sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active')),
  created_at        timestamptz DEFAULT now() NOT NULL,
  updated_at        timestamptz DEFAULT now() NOT NULL
);

-- ============================================================
-- TABLE: foods
-- Nutrition reference database (public + custom user foods)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.foods (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name                  text NOT NULL,
  brand                 text,
  serving_size_g        numeric NOT NULL DEFAULT 100,
  calories_per_serving  numeric NOT NULL,
  protein_g             numeric NOT NULL DEFAULT 0,
  carbs_g               numeric NOT NULL DEFAULT 0,
  fats_g                numeric NOT NULL DEFAULT 0,
  fiber_g               numeric DEFAULT 0,
  sugar_g               numeric DEFAULT 0,
  sodium_mg             numeric DEFAULT 0,
  is_custom             boolean DEFAULT false,
  created_by            uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at            timestamptz DEFAULT now() NOT NULL
);

-- ============================================================
-- TABLE: meals
-- Logged meal sessions per user
-- ============================================================

CREATE TABLE IF NOT EXISTS public.meals (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name            text NOT NULL DEFAULT 'Meal',
  meal_type       text CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  logged_at       timestamptz NOT NULL DEFAULT now(),
  photo_url       text,
  notes           text,
  total_calories  numeric DEFAULT 0,
  total_protein_g numeric DEFAULT 0,
  total_carbs_g   numeric DEFAULT 0,
  total_fats_g    numeric DEFAULT 0,
  created_at      timestamptz DEFAULT now() NOT NULL,
  updated_at      timestamptz DEFAULT now() NOT NULL
);

-- ============================================================
-- TABLE: meal_items
-- Individual food entries within a meal
-- ============================================================

CREATE TABLE IF NOT EXISTS public.meal_items (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_id        uuid NOT NULL REFERENCES public.meals(id) ON DELETE CASCADE,
  food_id        uuid REFERENCES public.foods(id) ON DELETE SET NULL,
  food_name      text NOT NULL,
  serving_size_g numeric NOT NULL,
  quantity       numeric NOT NULL DEFAULT 1,
  calories       numeric NOT NULL,
  protein_g      numeric NOT NULL DEFAULT 0,
  carbs_g        numeric NOT NULL DEFAULT 0,
  fats_g         numeric NOT NULL DEFAULT 0,
  created_at     timestamptz DEFAULT now() NOT NULL
);

-- ============================================================
-- TABLE: weight_logs
-- Periodic weight tracking for progress monitoring
-- ============================================================

CREATE TABLE IF NOT EXISTS public.weight_logs (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  weight_kg  numeric NOT NULL,
  logged_at  date NOT NULL DEFAULT CURRENT_DATE,
  notes      text,
  created_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT weight_logs_user_date_unique UNIQUE (user_id, logged_at)
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_meals_user_logged_at ON public.meals(user_id, logged_at);
CREATE INDEX IF NOT EXISTS idx_weight_logs_user_logged_at ON public.weight_logs(user_id, logged_at);
CREATE INDEX IF NOT EXISTS idx_foods_name ON public.foods(name);
CREATE INDEX IF NOT EXISTS idx_meal_items_meal_id ON public.meal_items(meal_id);

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Auto-create profile on new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Auto-update updated_at on profiles
CREATE OR REPLACE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at on meals
CREATE OR REPLACE TRIGGER set_meals_updated_at
  BEFORE UPDATE ON public.meals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on user-owned tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weight_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foods ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------
-- profiles policies
-- ----------------------------------------

CREATE POLICY "profiles_select_own"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_delete_own"
  ON public.profiles
  FOR DELETE
  USING (auth.uid() = id);

-- ----------------------------------------
-- meals policies
-- ----------------------------------------

CREATE POLICY "meals_select_own"
  ON public.meals
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "meals_insert_own"
  ON public.meals
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "meals_update_own"
  ON public.meals
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "meals_delete_own"
  ON public.meals
  FOR DELETE
  USING (auth.uid() = user_id);

-- ----------------------------------------
-- meal_items policies
-- ----------------------------------------

CREATE POLICY "meal_items_select_own"
  ON public.meal_items
  FOR SELECT
  USING (
    meal_id IN (
      SELECT id FROM public.meals WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "meal_items_insert_own"
  ON public.meal_items
  FOR INSERT
  WITH CHECK (
    meal_id IN (
      SELECT id FROM public.meals WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "meal_items_update_own"
  ON public.meal_items
  FOR UPDATE
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

CREATE POLICY "meal_items_delete_own"
  ON public.meal_items
  FOR DELETE
  USING (
    meal_id IN (
      SELECT id FROM public.meals WHERE user_id = auth.uid()
    )
  );

-- ----------------------------------------
-- weight_logs policies
-- ----------------------------------------

CREATE POLICY "weight_logs_select_own"
  ON public.weight_logs
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "weight_logs_insert_own"
  ON public.weight_logs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "weight_logs_update_own"
  ON public.weight_logs
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "weight_logs_delete_own"
  ON public.weight_logs
  FOR DELETE
  USING (auth.uid() = user_id);

-- ----------------------------------------
-- foods policies
-- Semi-public: anyone can read, authenticated users can insert,
-- only creator can update/delete their custom foods
-- ----------------------------------------

CREATE POLICY "foods_select_all"
  ON public.foods
  FOR SELECT
  USING (true);

CREATE POLICY "foods_insert_authenticated"
  ON public.foods
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "foods_update_own_custom"
  ON public.foods
  FOR UPDATE
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "foods_delete_own_custom"
  ON public.foods
  FOR DELETE
  USING (created_by = auth.uid());
