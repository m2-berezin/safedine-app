-- Add vegetarian options to All Day menu across all restaurants

-- Add to ANTIPASTI categories
INSERT INTO menu_items (category_id, name, description, price, dietary_info, is_available, is_popular)
SELECT 
  mc.id,
  'Vegan Bruschetta',
  'Toasted sourdough with fresh tomatoes, basil, and olive oil',
  8.50,
  ARRAY['vegetarian', 'vegan'],
  true,
  false
FROM menu_categories mc
JOIN menus m ON mc.menu_id = m.id
WHERE mc.name = 'ANTIPASTI' AND m.name = 'All Day';

INSERT INTO menu_items (category_id, name, description, price, dietary_info, is_available, is_popular)
SELECT 
  mc.id,
  'Roasted Vegetable Platter',
  'Seasonal roasted vegetables with herbs and balsamic glaze',
  9.50,
  ARRAY['vegetarian', 'vegan', 'gluten-free'],
  true,
  false
FROM menu_categories mc
JOIN menus m ON mc.menu_id = m.id
WHERE mc.name = 'ANTIPASTI' AND m.name = 'All Day';

-- Add to PIZZA ROSSE categories  
INSERT INTO menu_items (category_id, name, description, price, dietary_info, is_available, is_popular)
SELECT 
  mc.id,
  'Vegan Margherita',
  'Tomato base with vegan mozzarella and fresh basil',
  11.50,
  ARRAY['vegetarian', 'vegan'],
  true,
  true
FROM menu_categories mc
JOIN menus m ON mc.menu_id = m.id
WHERE mc.name = 'PIZZA ROSSE' AND m.name = 'All Day';

INSERT INTO menu_items (category_id, name, description, price, dietary_info, is_available, is_popular)
SELECT 
  mc.id,
  'Mediterranean Vegetable',
  'Roasted peppers, courgettes, aubergine, and red onion',
  13.50,
  ARRAY['vegetarian', 'vegan'],
  true,
  false
FROM menu_categories mc
JOIN menus m ON mc.menu_id = m.id
WHERE mc.name = 'PIZZA ROSSE' AND m.name = 'All Day';

-- Add to PIZZA BIANCHE categories
INSERT INTO menu_items (category_id, name, description, price, dietary_info, is_available, is_popular)
SELECT 
  mc.id,
  'Vegan Truffle & Mushroom',
  'Wild mushrooms with truffle oil and fresh herbs (vegan)',
  14.50,
  ARRAY['vegetarian', 'vegan'],
  true,
  false
FROM menu_categories mc
JOIN menus m ON mc.menu_id = m.id
WHERE mc.name = 'PIZZA BIANCHE' AND m.name = 'All Day';

-- Add to DESSERTS categories
INSERT INTO menu_items (category_id, name, description, price, dietary_info, is_available, is_popular)
SELECT 
  mc.id,
  'Vegan Chocolate Brownie',
  'Rich chocolate brownie served with coconut ice cream',
  6.50,
  ARRAY['vegetarian', 'vegan'],
  true,
  false
FROM menu_categories mc
JOIN menus m ON mc.menu_id = m.id
WHERE mc.name = 'DESSERTS' AND m.name = 'All Day';

-- Add vegetarian options to Lunch menu

-- Add to EXPRESS PIZZA categories
INSERT INTO menu_items (category_id, name, description, price, dietary_info, is_available, is_popular)
SELECT 
  mc.id,
  'Express Vegan Margherita',
  'Quick vegan margherita with plant-based cheese',
  9.50,
  ARRAY['vegetarian', 'vegan'],
  true,
  true
FROM menu_categories mc
JOIN menus m ON mc.menu_id = m.id
WHERE mc.name = 'EXPRESS PIZZA' AND m.name = 'Lunch';

-- Add to LUNCH SALADS categories
INSERT INTO menu_items (category_id, name, description, price, dietary_info, is_available, is_popular)
SELECT 
  mc.id,
  'Quinoa Power Bowl',
  'Quinoa with roasted vegetables, avocado, and tahini dressing',
  10.50,
  ARRAY['vegetarian', 'vegan', 'gluten-free'],
  true,
  true
FROM menu_categories mc
JOIN menus m ON mc.menu_id = m.id
WHERE mc.name = 'LUNCH SALADS' AND m.name = 'Lunch';

INSERT INTO menu_items (category_id, name, description, price, dietary_info, is_available, is_popular)
SELECT 
  mc.id,
  'Mediterranean Chickpea Salad',
  'Chickpeas, cucumber, tomatoes, olives with lemon dressing',
  9.50,
  ARRAY['vegetarian', 'vegan', 'gluten-free'],
  true,
  false
FROM menu_categories mc
JOIN menus m ON mc.menu_id = m.id
WHERE mc.name = 'LUNCH SALADS' AND m.name = 'Lunch';

-- Add to SIDES categories
INSERT INTO menu_items (category_id, name, description, price, dietary_info, is_available, is_popular)
SELECT 
  mc.id,
  'Sweet Potato Fries',
  'Crispy sweet potato fries with herbs',
  5.50,
  ARRAY['vegetarian', 'vegan', 'gluten-free'],
  true,
  false
FROM menu_categories mc
JOIN menus m ON mc.menu_id = m.id
WHERE mc.name = 'SIDES' AND m.name = 'Lunch';

-- Add vegetarian options to Kids menu

-- Add to KIDS PIZZA categories
INSERT INTO menu_items (category_id, name, description, price, dietary_info, is_available, is_popular)
SELECT 
  mc.id,
  'Kids Vegan Margherita',
  'Child-sized vegan margherita pizza',
  7.50,
  ARRAY['vegetarian', 'vegan'],
  true,
  true
FROM menu_categories mc
JOIN menus m ON mc.menu_id = m.id
WHERE mc.name = 'KIDS PIZZA' AND m.name = 'Kids';

INSERT INTO menu_items (category_id, name, description, price, dietary_info, is_available, is_popular)
SELECT 
  mc.id,
  'Kids Veggie Pizza',
  'Tomato base with sweetcorn, peppers, and mushrooms',
  8.50,
  ARRAY['vegetarian'],
  true,
  false
FROM menu_categories mc
JOIN menus m ON mc.menu_id = m.id
WHERE mc.name = 'KIDS PIZZA' AND m.name = 'Kids';

-- Add to KIDS DESSERTS categories
INSERT INTO menu_items (category_id, name, description, price, dietary_info, is_available, is_popular)
SELECT 
  mc.id,
  'Kids Fruit Salad',
  'Fresh seasonal fruit salad',
  4.50,
  ARRAY['vegetarian', 'vegan', 'gluten-free'],
  true,
  false
FROM menu_categories mc
JOIN menus m ON mc.menu_id = m.id
WHERE mc.name = 'KIDS DESSERTS' AND m.name = 'Kids';

INSERT INTO menu_items (category_id, name, description, price, dietary_info, is_available, is_popular)
SELECT 
  mc.id,
  'Vegan Cookie',
  'Chocolate chip cookie made with oat milk',
  3.50,
  ARRAY['vegetarian', 'vegan'],
  true,
  false
FROM menu_categories mc
JOIN menus m ON mc.menu_id = m.id
WHERE mc.name = 'KIDS DESSERTS' AND m.name = 'Kids';