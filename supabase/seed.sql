-- NutriTrack Seed Data
-- Common food items with accurate nutrition data
-- All items are verified and have no creator (system data)

INSERT INTO public.foods (
  name, brand, serving_size_g, serving_description,
  calories_per_serving, protein_g, carbs_g, fats_g,
  fiber_g, sugar_g, sodium_mg, is_verified, created_by
) VALUES

-- Proteins
(
  'Chicken Breast', NULL, 100, '100g cooked',
  165, 31, 0, 3.6,
  0, 0, 74, TRUE, NULL
),
(
  'Salmon Fillet', NULL, 100, '100g cooked',
  208, 20, 0, 13,
  0, 0, 59, TRUE, NULL
),
(
  'Egg', NULL, 50, '1 large egg',
  72, 6, 0.4, 5,
  0, 0.2, 71, TRUE, NULL
),
(
  'Greek Yogurt', NULL, 170, '1 container (170g)',
  100, 17, 6, 0.7,
  0, 6, 65, TRUE, NULL
),
(
  'Whey Protein Powder', NULL, 30, '1 scoop (30g)',
  120, 24, 3, 1.5,
  0, 2, 130, TRUE, NULL
),

-- Grains & Carbs
(
  'Brown Rice', NULL, 100, '100g cooked',
  112, 2.6, 23.5, 0.9,
  1.8, 0.4, 5, TRUE, NULL
),
(
  'Oats', NULL, 40, '40g dry (about 1/2 cup)',
  152, 5.3, 27, 2.6,
  4, 1, 2, TRUE, NULL
),
(
  'Whole Wheat Bread', NULL, 28, '1 slice',
  69, 3.6, 12, 1,
  1.9, 1.4, 132, TRUE, NULL
),

-- Fruits
(
  'Banana', NULL, 118, '1 medium banana',
  105, 1.3, 27, 0.4,
  3.1, 14, 1, TRUE, NULL
),
(
  'Apple', NULL, 182, '1 medium apple',
  95, 0.5, 25, 0.3,
  4.4, 19, 2, TRUE, NULL
),
(
  'Blueberries', NULL, 100, '100g (about 3/4 cup)',
  57, 0.7, 14, 0.3,
  2.4, 10, 1, TRUE, NULL
),

-- Vegetables
(
  'Broccoli', NULL, 100, '100g raw',
  34, 2.8, 7, 0.4,
  2.6, 1.7, 33, TRUE, NULL
),
(
  'Spinach', NULL, 100, '100g raw',
  23, 2.9, 3.6, 0.4,
  2.2, 0.4, 79, TRUE, NULL
),
(
  'Sweet Potato', NULL, 100, '100g cooked',
  90, 2, 21, 0.1,
  3.3, 4.2, 36, TRUE, NULL
),

-- Nuts, Fats & Dairy
(
  'Almonds', NULL, 28, '1 oz (about 23 almonds)',
  164, 6, 6, 14,
  3.5, 1.2, 0, TRUE, NULL
),
(
  'Peanut Butter', NULL, 32, '2 tablespoons',
  191, 7, 7, 16,
  1.6, 3, 136, TRUE, NULL
),
(
  'Avocado', NULL, 100, 'Half an avocado',
  160, 2, 9, 15,
  6.7, 0.7, 7, TRUE, NULL
),
(
  'Whole Milk', NULL, 240, '1 cup (240ml)',
  149, 8, 12, 8,
  0, 12, 105, TRUE, NULL
),
(
  'Cheddar Cheese', NULL, 28, '1 oz (28g)',
  114, 7, 0.4, 9.4,
  0, 0.1, 185, TRUE, NULL
),
(
  'Olive Oil', NULL, 13.5, '1 tablespoon',
  119, 0, 0, 13.5,
  0, 0, 0, TRUE, NULL
);
