-- Create menus for all Franco Manca restaurants
-- All Day Menu
WITH franco_manca_restaurants AS (
  SELECT id FROM restaurants WHERE name = 'Franco Manca'
)
INSERT INTO menus (name, description, restaurant_id, is_active, display_order)
SELECT 
  'All Day', 
  'Our full authentic Italian menu available all day',
  id,
  true,
  1
FROM franco_manca_restaurants;

-- Lunch Menu  
WITH franco_manca_restaurants AS (
  SELECT id FROM restaurants WHERE name = 'Franco Manca'
)
INSERT INTO menus (name, description, restaurant_id, is_active, display_order)
SELECT 
  'Lunch', 
  'Quick lunch options and express pizzas',
  id,
  true,
  2
FROM franco_manca_restaurants;

-- Kids Menu
WITH franco_manca_restaurants AS (
  SELECT id FROM restaurants WHERE name = 'Franco Manca'
)
INSERT INTO menus (name, description, restaurant_id, is_active, display_order)
SELECT 
  'Kids', 
  'Child-friendly Italian dishes',
  id,
  true,
  3
FROM franco_manca_restaurants;

-- Drinks Menu
WITH franco_manca_restaurants AS (
  SELECT id FROM restaurants WHERE name = 'Franco Manca'
)
INSERT INTO menus (name, description, restaurant_id, is_active, display_order)
SELECT 
  'Drinks', 
  'Italian wines, beers and beverages',
  id,
  true,
  4
FROM franco_manca_restaurants;

-- Create menu categories for All Day Menu
WITH all_day_menus AS (
  SELECT m.id as menu_id
  FROM menus m
  JOIN restaurants r ON m.restaurant_id = r.id
  WHERE r.name = 'Franco Manca' AND m.name = 'All Day'
)
INSERT INTO menu_categories (name, description, menu_id, display_order)
SELECT 'ANTIPASTI', 'Traditional Italian starters and appetizers', menu_id, 1 FROM all_day_menus
UNION ALL
SELECT 'PIZZA ROSSE', 'Classic tomato-based pizzas', menu_id, 2 FROM all_day_menus
UNION ALL
SELECT 'PIZZA BIANCHE', 'White pizzas without tomato base', menu_id, 3 FROM all_day_menus
UNION ALL
SELECT 'DESSERTS', 'Traditional Italian desserts', menu_id, 4 FROM all_day_menus;

-- Create menu categories for Lunch Menu
WITH lunch_menus AS (
  SELECT m.id as menu_id
  FROM menus m
  JOIN restaurants r ON m.restaurant_id = r.id
  WHERE r.name = 'Franco Manca' AND m.name = 'Lunch'
)
INSERT INTO menu_categories (name, description, menu_id, display_order)
SELECT 'EXPRESS PIZZA', 'Quick lunch pizzas ready in 10 minutes', menu_id, 1 FROM lunch_menus
UNION ALL
SELECT 'LUNCH SALADS', 'Fresh Italian salads', menu_id, 2 FROM lunch_menus
UNION ALL
SELECT 'SIDES', 'Perfect lunch accompaniments', menu_id, 3 FROM lunch_menus;

-- Create menu categories for Kids Menu
WITH kids_menus AS (
  SELECT m.id as menu_id
  FROM menus m
  JOIN restaurants r ON m.restaurant_id = r.id
  WHERE r.name = 'Franco Manca' AND m.name = 'Kids'
)
INSERT INTO menu_categories (name, description, menu_id, display_order)
SELECT 'KIDS PIZZA', 'Child-sized pizzas with simple toppings', menu_id, 1 FROM kids_menus
UNION ALL
SELECT 'KIDS DRINKS', 'Healthy drinks for children', menu_id, 2 FROM kids_menus
UNION ALL
SELECT 'KIDS DESSERTS', 'Sweet treats for little ones', menu_id, 3 FROM kids_menus;

-- Create menu categories for Drinks Menu
WITH drinks_menus AS (
  SELECT m.id as menu_id
  FROM menus m
  JOIN restaurants r ON m.restaurant_id = r.id
  WHERE r.name = 'Franco Manca' AND m.name = 'Drinks'
)
INSERT INTO menu_categories (name, description, menu_id, display_order)
SELECT 'ITALIAN WINES', 'Carefully selected Italian wines', menu_id, 1 FROM drinks_menus
UNION ALL
SELECT 'BEERS & CIDERS', 'Italian and craft beers', menu_id, 2 FROM drinks_menus
UNION ALL
SELECT 'SOFT DRINKS', 'Refreshing non-alcoholic beverages', menu_id, 3 FROM drinks_menus
UNION ALL
SELECT 'COFFEE & TEA', 'Italian coffee and tea selection', menu_id, 4 FROM drinks_menus;

-- Insert menu items for ANTIPASTI category
WITH antipasti_categories AS (
  SELECT mc.id as category_id
  FROM menu_categories mc
  JOIN menus m ON mc.menu_id = m.id
  JOIN restaurants r ON m.restaurant_id = r.id
  WHERE r.name = 'Franco Manca' AND mc.name = 'ANTIPASTI'
)
INSERT INTO menu_items (name, description, price, category_id, allergens, dietary_info, calories, preparation_time, is_popular, is_available)
SELECT 'Burrata', 'Creamy mozzarella with tomatoes and basil', 9.50, category_id, ARRAY['D'], ARRAY['V'], 280, 5, true, true FROM antipasti_categories
UNION ALL
SELECT 'Arancini', 'Crispy risotto balls with mozzarella', 7.50, category_id, ARRAY['D', 'G', 'E'], ARRAY['V'], 320, 8, true, true FROM antipasti_categories
UNION ALL
SELECT 'Antipasti Platter', 'Selection of cured meats and cheeses', 14.95, category_id, ARRAY['D', 'MU', 'SD'], ARRAY[]::text[], 450, 5, true, true FROM antipasti_categories
UNION ALL
SELECT 'Calamari Fritti', 'Crispy fried squid with aioli', 8.95, category_id, ARRAY['M', 'G', 'E'], ARRAY[]::text[], 280, 10, false, true FROM antipasti_categories
UNION ALL
SELECT 'Bruschetta', 'Toasted bread with tomatoes and garlic', 6.95, category_id, ARRAY['G'], ARRAY['V', 'VG'], 180, 5, true, true FROM antipasti_categories;

-- Insert menu items for PIZZA ROSSE category
WITH pizza_rosse_categories AS (
  SELECT mc.id as category_id
  FROM menu_categories mc
  JOIN menus m ON mc.menu_id = m.id
  JOIN restaurants r ON m.restaurant_id = r.id
  WHERE r.name = 'Franco Manca' AND mc.name = 'PIZZA ROSSE'
)
INSERT INTO menu_items (name, description, price, category_id, allergens, dietary_info, calories, preparation_time, is_popular, is_available)
SELECT 'Margherita', 'San Marzano tomatoes, mozzarella, basil', 11.95, category_id, ARRAY['G', 'D'], ARRAY['V'], 580, 12, true, true FROM pizza_rosse_categories
UNION ALL
SELECT 'Pepperoni', 'Spicy pepperoni with mozzarella', 14.95, category_id, ARRAY['G', 'D'], ARRAY[]::text[], 680, 12, true, true FROM pizza_rosse_categories
UNION ALL
SELECT 'Diavola', 'Spicy salami, chili oil, mozzarella', 15.50, category_id, ARRAY['G', 'D'], ARRAY[]::text[], 720, 12, true, true FROM pizza_rosse_categories
UNION ALL
SELECT 'Marinara', 'San Marzano tomatoes, garlic, oregano', 9.95, category_id, ARRAY['G'], ARRAY['V', 'VG'], 480, 10, false, true FROM pizza_rosse_categories
UNION ALL
SELECT 'Quattro Stagioni', 'Artichokes, ham, mushrooms, olives', 16.95, category_id, ARRAY['G', 'D'], ARRAY[]::text[], 650, 15, false, true FROM pizza_rosse_categories;

-- Insert menu items for PIZZA BIANCHE category
WITH pizza_bianche_categories AS (
  SELECT mc.id as category_id
  FROM menu_categories mc
  JOIN menus m ON mc.menu_id = m.id
  JOIN restaurants r ON m.restaurant_id = r.id
  WHERE r.name = 'Franco Manca' AND mc.name = 'PIZZA BIANCHE'
)
INSERT INTO menu_items (name, description, price, category_id, allergens, dietary_info, calories, preparation_time, is_popular, is_available)
SELECT 'Quattro Formaggi', 'Four Italian cheeses with honey', 15.95, category_id, ARRAY['G', 'D'], ARRAY['V'], 750, 12, true, true FROM pizza_bianche_categories
UNION ALL
SELECT 'Prosciutto e Funghi', 'Parma ham, wild mushrooms, mozzarella', 17.50, category_id, ARRAY['G', 'D'], ARRAY[]::text[], 680, 15, true, true FROM pizza_bianche_categories
UNION ALL
SELECT 'Truffle & Mushroom', 'Wild mushrooms with truffle oil', 18.95, category_id, ARRAY['G', 'D'], ARRAY['V'], 620, 15, false, true FROM pizza_bianche_categories
UNION ALL
SELECT 'Ricotta & Spinach', 'Fresh ricotta, spinach, pine nuts', 14.95, category_id, ARRAY['G', 'D', 'N'], ARRAY['V'], 580, 12, false, true FROM pizza_bianche_categories;

-- Insert menu items for ALL DAY DESSERTS category
WITH dessert_categories AS (
  SELECT mc.id as category_id
  FROM menu_categories mc
  JOIN menus m ON mc.menu_id = m.id
  JOIN restaurants r ON m.restaurant_id = r.id
  WHERE r.name = 'Franco Manca' AND mc.name = 'DESSERTS'
)
INSERT INTO menu_items (name, description, price, category_id, allergens, dietary_info, calories, preparation_time, is_popular, is_available)
SELECT 'Tiramisu', 'Classic Italian coffee dessert', 6.95, category_id, ARRAY['G', 'D', 'E'], ARRAY['V'], 420, 3, true, true FROM dessert_categories
UNION ALL
SELECT 'Panna Cotta', 'Vanilla cream with berry coulis', 5.95, category_id, ARRAY['D'], ARRAY['V'], 280, 3, true, true FROM dessert_categories
UNION ALL
SELECT 'Gelato', 'Artisan Italian ice cream (3 scoops)', 4.95, category_id, ARRAY['D'], ARRAY['V'], 220, 2, true, true FROM dessert_categories
UNION ALL
SELECT 'Cannoli', 'Sicilian pastry with ricotta cream', 6.50, category_id, ARRAY['G', 'D', 'E', 'N'], ARRAY['V'], 380, 3, false, true FROM dessert_categories;

-- Insert menu items for EXPRESS PIZZA category (Lunch)
WITH express_pizza_categories AS (
  SELECT mc.id as category_id
  FROM menu_categories mc
  JOIN menus m ON mc.menu_id = m.id
  JOIN restaurants r ON m.restaurant_id = r.id
  WHERE r.name = 'Franco Manca' AND mc.name = 'EXPRESS PIZZA'
)
INSERT INTO menu_items (name, description, price, category_id, allergens, dietary_info, calories, preparation_time, is_popular, is_available)
SELECT 'Express Margherita', 'Quick classic Margherita pizza', 9.95, category_id, ARRAY['G', 'D'], ARRAY['V'], 520, 8, true, true FROM express_pizza_categories
UNION ALL
SELECT 'Express Pepperoni', 'Fast pepperoni pizza', 11.95, category_id, ARRAY['G', 'D'], ARRAY[]::text[], 580, 8, true, true FROM express_pizza_categories
UNION ALL
SELECT 'Express Vegetarian', 'Quick veggie pizza with seasonal vegetables', 10.95, category_id, ARRAY['G', 'D'], ARRAY['V'], 480, 8, true, true FROM express_pizza_categories;

-- Insert menu items for LUNCH SALADS category
WITH salad_categories AS (
  SELECT mc.id as category_id
  FROM menu_categories mc
  JOIN menus m ON mc.menu_id = m.id
  JOIN restaurants r ON m.restaurant_id = r.id
  WHERE r.name = 'Franco Manca' AND mc.name = 'LUNCH SALADS'
)
INSERT INTO menu_items (name, description, price, category_id, allergens, dietary_info, calories, preparation_time, is_popular, is_available)
SELECT 'Caesar Salad', 'Crisp lettuce, parmesan, croutons', 8.95, category_id, ARRAY['G', 'D', 'E', 'F'], ARRAY['V'], 280, 5, true, true FROM salad_categories
UNION ALL
SELECT 'Caprese Salad', 'Mozzarella, tomatoes, basil', 9.50, category_id, ARRAY['D'], ARRAY['V'], 320, 3, true, true FROM salad_categories
UNION ALL
SELECT 'Rocket & Parmesan', 'Peppery rocket with aged parmesan', 7.95, category_id, ARRAY['D'], ARRAY['V'], 180, 3, false, true FROM salad_categories;

-- Insert menu items for LUNCH SIDES category
WITH sides_categories AS (
  SELECT mc.id as category_id
  FROM menu_categories mc
  JOIN menus m ON mc.menu_id = m.id
  JOIN restaurants r ON m.restaurant_id = r.id
  WHERE r.name = 'Franco Manca' AND mc.name = 'SIDES'
)
INSERT INTO menu_items (name, description, price, category_id, allergens, dietary_info, calories, preparation_time, is_popular, is_available)
SELECT 'Garlic Bread', 'Wood-fired garlic bread with herbs', 4.95, category_id, ARRAY['G', 'D'], ARRAY['V'], 220, 5, true, true FROM sides_categories
UNION ALL
SELECT 'Olives', 'Marinated Italian olives', 3.95, category_id, ARRAY[]::text[], ARRAY['V', 'VG'], 120, 2, true, true FROM sides_categories
UNION ALL
SELECT 'Focaccia', 'Traditional Italian flatbread', 5.50, category_id, ARRAY['G'], ARRAY['V', 'VG'], 280, 8, false, true FROM sides_categories;

-- Insert menu items for KIDS PIZZA category
WITH kids_pizza_categories AS (
  SELECT mc.id as category_id
  FROM menu_categories mc
  JOIN menus m ON mc.menu_id = m.id
  JOIN restaurants r ON m.restaurant_id = r.id
  WHERE r.name = 'Franco Manca' AND mc.name = 'KIDS PIZZA'
)
INSERT INTO menu_items (name, description, price, category_id, allergens, dietary_info, calories, preparation_time, is_popular, is_available)
SELECT 'Kids Margherita', 'Child-sized classic Margherita', 7.95, category_id, ARRAY['G', 'D'], ARRAY['V'], 380, 10, true, true FROM kids_pizza_categories
UNION ALL
SELECT 'Kids Pepperoni', 'Small pepperoni pizza', 8.95, category_id, ARRAY['G', 'D'], ARRAY[]::text[], 420, 10, true, true FROM kids_pizza_categories
UNION ALL
SELECT 'Kids Plain Cheese', 'Simple cheese pizza for fussy eaters', 7.50, category_id, ARRAY['G', 'D'], ARRAY['V'], 350, 10, true, true FROM kids_pizza_categories;

-- Insert menu items for KIDS DRINKS category
WITH kids_drinks_categories AS (
  SELECT mc.id as category_id
  FROM menu_categories mc
  JOIN menus m ON mc.menu_id = m.id
  JOIN restaurants r ON m.restaurant_id = r.id
  WHERE r.name = 'Franco Manca' AND mc.name = 'KIDS DRINKS'
)
INSERT INTO menu_items (name, description, price, category_id, allergens, dietary_info, calories, preparation_time, is_popular, is_available)
SELECT 'Kids Apple Juice', 'Pure organic apple juice', 2.95, category_id, ARRAY[]::text[], ARRAY['V', 'VG'], 80, 1, true, true FROM kids_drinks_categories
UNION ALL
SELECT 'Kids Orange Juice', 'Freshly squeezed orange juice', 2.95, category_id, ARRAY[]::text[], ARRAY['V', 'VG'], 90, 1, true, true FROM kids_drinks_categories
UNION ALL
SELECT 'Kids Milk', 'Fresh whole milk', 2.50, category_id, ARRAY['D'], ARRAY['V'], 120, 1, true, true FROM kids_drinks_categories;

-- Insert menu items for KIDS DESSERTS category
WITH kids_dessert_categories AS (
  SELECT mc.id as category_id
  FROM menu_categories mc
  JOIN menus m ON mc.menu_id = m.id
  JOIN restaurants r ON m.restaurant_id = r.id
  WHERE r.name = 'Franco Manca' AND mc.name = 'KIDS DESSERTS'
)
INSERT INTO menu_items (name, description, price, category_id, allergens, dietary_info, calories, preparation_time, is_popular, is_available)
SELECT 'Kids Vanilla Gelato', 'Creamy vanilla ice cream', 3.95, category_id, ARRAY['D'], ARRAY['V'], 150, 2, true, true FROM kids_dessert_categories
UNION ALL
SELECT 'Kids Chocolate Gelato', 'Rich chocolate ice cream', 3.95, category_id, ARRAY['D'], ARRAY['V'], 180, 2, true, true FROM kids_dessert_categories
UNION ALL
SELECT 'Mini Nutella Pizza', 'Small sweet pizza with Nutella', 5.95, category_id, ARRAY['G', 'D', 'N'], ARRAY['V'], 420, 8, true, true FROM kids_dessert_categories;

-- Insert menu items for ITALIAN WINES category
WITH wine_categories AS (
  SELECT mc.id as category_id
  FROM menu_categories mc
  JOIN menus m ON mc.menu_id = m.id
  JOIN restaurants r ON m.restaurant_id = r.id
  WHERE r.name = 'Franco Manca' AND mc.name = 'ITALIAN WINES'
)
INSERT INTO menu_items (name, description, price, category_id, allergens, dietary_info, calories, preparation_time, is_popular, is_available)
SELECT 'Chianti Classico', 'Traditional Tuscan red wine', 28.00, category_id, ARRAY['SD'], ARRAY[]::text[], 0, 2, true, true FROM wine_categories
UNION ALL
SELECT 'Pinot Grigio', 'Crisp white wine from Veneto', 24.00, category_id, ARRAY['SD'], ARRAY[]::text[], 0, 2, true, true FROM wine_categories
UNION ALL
SELECT 'Prosecco', 'Italian sparkling wine', 26.00, category_id, ARRAY['SD'], ARRAY[]::text[], 0, 2, true, true FROM wine_categories
UNION ALL
SELECT 'House Red', 'Franco Manca house red blend', 19.50, category_id, ARRAY['SD'], ARRAY[]::text[], 0, 2, false, true FROM wine_categories
UNION ALL
SELECT 'House White', 'Franco Manca house white blend', 19.50, category_id, ARRAY['SD'], ARRAY[]::text[], 0, 2, false, true FROM wine_categories;

-- Insert menu items for BEERS & CIDERS category
WITH beer_categories AS (
  SELECT mc.id as category_id
  FROM menu_categories mc
  JOIN menus m ON mc.menu_id = m.id
  JOIN restaurants r ON m.restaurant_id = r.id
  WHERE r.name = 'Franco Manca' AND mc.name = 'BEERS & CIDERS'
)
INSERT INTO menu_items (name, description, price, category_id, allergens, dietary_info, calories, preparation_time, is_popular, is_available)
SELECT 'Peroni', 'Classic Italian lager', 4.95, category_id, ARRAY['G'], ARRAY[]::text[], 180, 2, true, true FROM beer_categories
UNION ALL
SELECT 'Moretti', 'Premium Italian beer', 5.50, category_id, ARRAY['G'], ARRAY[]::text[], 200, 2, true, true FROM beer_categories
UNION ALL
SELECT 'Camden Hells', 'London craft lager', 5.95, category_id, ARRAY['G'], ARRAY[]::text[], 220, 2, false, true FROM beer_categories
UNION ALL
SELECT 'Aspall Cider', 'Traditional English cider', 5.50, category_id, ARRAY[]::text[], ARRAY['V', 'VG'], 180, 2, false, true FROM beer_categories;

-- Insert menu items for SOFT DRINKS category
WITH soft_drink_categories AS (
  SELECT mc.id as category_id
  FROM menu_categories mc
  JOIN menus m ON mc.menu_id = m.id
  JOIN restaurants r ON m.restaurant_id = r.id
  WHERE r.name = 'Franco Manca' AND mc.name = 'SOFT DRINKS'
)
INSERT INTO menu_items (name, description, price, category_id, allergens, dietary_info, calories, preparation_time, is_popular, is_available)
SELECT 'San Pellegrino', 'Italian sparkling water', 3.50, category_id, ARRAY[]::text[], ARRAY['V', 'VG'], 0, 1, true, true FROM soft_drink_categories
UNION ALL
SELECT 'Aranciata', 'Italian orange soda', 3.95, category_id, ARRAY[]::text[], ARRAY['V', 'VG'], 120, 1, true, true FROM soft_drink_categories
UNION ALL
SELECT 'Limonata', 'Italian lemon soda', 3.95, category_id, ARRAY[]::text[], ARRAY['V', 'VG'], 110, 1, false, true FROM soft_drink_categories
UNION ALL
SELECT 'Coca-Cola', 'Classic Coca-Cola', 3.50, category_id, ARRAY[]::text[], ARRAY['V', 'VG'], 140, 1, true, true FROM soft_drink_categories
UNION ALL
SELECT 'Fresh Orange Juice', 'Freshly squeezed orange juice', 4.50, category_id, ARRAY[]::text[], ARRAY['V', 'VG'], 110, 3, true, true FROM soft_drink_categories;

-- Insert menu items for COFFEE & TEA category
WITH coffee_categories AS (
  SELECT mc.id as category_id
  FROM menu_categories mc
  JOIN menus m ON mc.menu_id = m.id
  JOIN restaurants r ON m.restaurant_id = r.id
  WHERE r.name = 'Franco Manca' AND mc.name = 'COFFEE & TEA'
)
INSERT INTO menu_items (name, description, price, category_id, allergens, dietary_info, calories, preparation_time, is_popular, is_available)
SELECT 'Espresso', 'Traditional Italian coffee', 2.50, category_id, ARRAY[]::text[], ARRAY['V', 'VG'], 5, 3, true, true FROM coffee_categories
UNION ALL
SELECT 'Cappuccino', 'Espresso with steamed milk', 3.50, category_id, ARRAY['D'], ARRAY['V'], 120, 4, true, true FROM coffee_categories
UNION ALL
SELECT 'Americano', 'Espresso with hot water', 3.00, category_id, ARRAY[]::text[], ARRAY['V', 'VG'], 10, 3, true, true FROM coffee_categories
UNION ALL
SELECT 'Latte', 'Espresso with steamed milk', 3.95, category_id, ARRAY['D'], ARRAY['V'], 150, 4, true, true FROM coffee_categories
UNION ALL
SELECT 'Italian Hot Tea', 'Selection of Italian herbal teas', 2.95, category_id, ARRAY[]::text[], ARRAY['V', 'VG'], 0, 3, false, true FROM coffee_categories;