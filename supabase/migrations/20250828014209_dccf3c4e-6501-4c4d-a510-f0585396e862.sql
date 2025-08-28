-- First, let's clear all existing Real Greek menu data and rebuild with correct structure
DELETE FROM public.menu_items 
WHERE category_id IN (
  SELECT mc.id FROM public.menu_categories mc
  JOIN public.menus m ON mc.menu_id = m.id
  JOIN public.restaurants r ON m.restaurant_id = r.id
  WHERE r.name = 'The Real Greek'
);

DELETE FROM public.menu_categories 
WHERE menu_id IN (
  SELECT m.id FROM public.menus m
  JOIN public.restaurants r ON m.restaurant_id = r.id
  WHERE r.name = 'The Real Greek'
);

DELETE FROM public.menus 
WHERE restaurant_id IN (
  SELECT id FROM public.restaurants WHERE name = 'The Real Greek'
);