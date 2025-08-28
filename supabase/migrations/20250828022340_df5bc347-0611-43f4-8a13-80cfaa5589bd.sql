-- Remove duplicate menus, keeping only one of each menu type per restaurant
-- This will keep the menu with the lowest ID for each restaurant-menu name combination

DELETE FROM menus 
WHERE id NOT IN (
  SELECT DISTINCT ON (restaurant_id, name) id
  FROM menus 
  ORDER BY restaurant_id, name, id
);