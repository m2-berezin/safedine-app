-- Update vegetarian menu items with proper V (vegan) or VG (vegetarian) indicators

-- Update vegan items with V indicator  
UPDATE menu_items 
SET name = name || ' (V)'
WHERE dietary_info @> ARRAY['vegan'] 
AND name IN (
  'Vegan Bruschetta',
  'Roasted Vegetable Platter', 
  'Vegan Margherita',
  'Mediterranean Vegetable',
  'Vegan Truffle & Mushroom',
  'Vegan Chocolate Brownie',
  'Express Vegan Margherita',
  'Quinoa Power Bowl',
  'Mediterranean Chickpea Salad',
  'Sweet Potato Fries',
  'Kids Vegan Margherita',
  'Kids Fruit Salad',
  'Vegan Cookie'
);

-- Update vegetarian (non-vegan) items with VG indicator
UPDATE menu_items 
SET name = name || ' (VG)'
WHERE dietary_info @> ARRAY['vegetarian'] 
AND NOT dietary_info @> ARRAY['vegan']
AND name IN (
  'Kids Veggie Pizza'
);

-- Clean up the redundant "Vegan" prefix since we now have V indicator
UPDATE menu_items 
SET name = REPLACE(name, 'Vegan ', '')
WHERE name LIKE 'Vegan %' 
AND name LIKE '%(V)';

-- Clean up Kids items
UPDATE menu_items 
SET name = REPLACE(name, 'Kids Vegan ', 'Kids ')
WHERE name LIKE 'Kids Vegan %' 
AND name LIKE '%(V)';

-- Clean up Express items  
UPDATE menu_items 
SET name = REPLACE(name, 'Express Vegan ', 'Express ')
WHERE name LIKE 'Express Vegan %' 
AND name LIKE '%(V)';