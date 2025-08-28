-- Remove duplicate menu categories, keeping only one of each category name per menu
DELETE FROM menu_categories 
WHERE id NOT IN (
  SELECT DISTINCT ON (menu_id, name) id
  FROM menu_categories 
  ORDER BY menu_id, name, id
);

-- Remove duplicate menu items, keeping only one of each item name per category
DELETE FROM menu_items 
WHERE id NOT IN (
  SELECT DISTINCT ON (category_id, name) id
  FROM menu_items 
  ORDER BY category_id, name, id
);