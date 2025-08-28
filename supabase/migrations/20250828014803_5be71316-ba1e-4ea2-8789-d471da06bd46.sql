-- Delete all existing menu items for The Real Greek and replace with authentic items
DELETE FROM public.menu_items 
WHERE category_id IN (
  SELECT mc.id FROM public.menu_categories mc
  JOIN public.menus m ON mc.menu_id = m.id
  JOIN public.restaurants r ON m.restaurant_id = r.id
  WHERE r.name = 'The Real Greek'
);

-- Now add the authentic Real Greek menu items
DO $$
DECLARE
    restaurant_record RECORD;
    
    -- Menu category IDs (we'll fetch these for each restaurant)
    greek_nibbles_id UUID;
    cold_meze_id UUID;
    hot_meze_id UUID;
    souvlaki_grill_id UUID;
    souvlaki_wrap_id UUID;
    salads_sides_id UUID;
    all_day_desserts_id UUID;
    
    greek_plate_id UUID;
    lunch_wrap_id UUID;
    
    kids_mains_id UUID;
    kids_drinks_id UUID;
    kids_desserts_id UUID;
    
    white_wine_id UUID;
    rose_wine_id UUID;
    red_wine_id UUID;
    bubbles_id UUID;
    ice_tea_cocktails_id UUID;
    beer_cider_id UUID;
    greek_spirits_id UUID;
    fruit_juices_id UUID;
    mineral_water_id UUID;
    soft_drinks_id UUID;
    coffee_tea_id UUID;
BEGIN
    -- Loop through all The Real Greek restaurants
    FOR restaurant_record IN 
        SELECT r.id as restaurant_id FROM public.restaurants r WHERE r.name = 'The Real Greek'
    LOOP
        -- Get category IDs for this restaurant
        SELECT mc.id INTO greek_nibbles_id FROM public.menu_categories mc 
        JOIN public.menus m ON mc.menu_id = m.id 
        WHERE m.restaurant_id = restaurant_record.restaurant_id AND mc.name = 'GREEK NIBBLES';
        
        SELECT mc.id INTO cold_meze_id FROM public.menu_categories mc 
        JOIN public.menus m ON mc.menu_id = m.id 
        WHERE m.restaurant_id = restaurant_record.restaurant_id AND mc.name = 'COLD MEZE';
        
        SELECT mc.id INTO hot_meze_id FROM public.menu_categories mc 
        JOIN public.menus m ON mc.menu_id = m.id 
        WHERE m.restaurant_id = restaurant_record.restaurant_id AND mc.name = 'HOT MEZE';
        
        SELECT mc.id INTO souvlaki_grill_id FROM public.menu_categories mc 
        JOIN public.menus m ON mc.menu_id = m.id 
        WHERE m.restaurant_id = restaurant_record.restaurant_id AND mc.name = 'SOUVLAKI GRILL';
        
        SELECT mc.id INTO souvlaki_wrap_id FROM public.menu_categories mc 
        JOIN public.menus m ON mc.menu_id = m.id 
        WHERE m.restaurant_id = restaurant_record.restaurant_id AND mc.name = 'SOUVLAKI WRAP';
        
        SELECT mc.id INTO salads_sides_id FROM public.menu_categories mc 
        JOIN public.menus m ON mc.menu_id = m.id 
        WHERE m.restaurant_id = restaurant_record.restaurant_id AND mc.name = 'SALADS & SIDES';
        
        SELECT mc.id INTO all_day_desserts_id FROM public.menu_categories mc 
        JOIN public.menus m ON mc.menu_id = m.id 
        WHERE m.restaurant_id = restaurant_record.restaurant_id AND mc.name = 'DESSERTS' AND m.name = 'All Day';
        
        SELECT mc.id INTO greek_plate_id FROM public.menu_categories mc 
        JOIN public.menus m ON mc.menu_id = m.id 
        WHERE m.restaurant_id = restaurant_record.restaurant_id AND mc.name = 'GREEK PLATE';
        
        SELECT mc.id INTO lunch_wrap_id FROM public.menu_categories mc 
        JOIN public.menus m ON mc.menu_id = m.id 
        WHERE m.restaurant_id = restaurant_record.restaurant_id AND mc.name = 'SOUVLAKI WRAP & SIDE';
        
        SELECT mc.id INTO kids_mains_id FROM public.menu_categories mc 
        JOIN public.menus m ON mc.menu_id = m.id 
        WHERE m.restaurant_id = restaurant_record.restaurant_id AND mc.name = 'Main' AND m.name = 'Kids';
        
        SELECT mc.id INTO kids_drinks_id FROM public.menu_categories mc 
        JOIN public.menus m ON mc.menu_id = m.id 
        WHERE m.restaurant_id = restaurant_record.restaurant_id AND mc.name = 'Drinks' AND m.name = 'Kids';
        
        SELECT mc.id INTO kids_desserts_id FROM public.menu_categories mc 
        JOIN public.menus m ON mc.menu_id = m.id 
        WHERE m.restaurant_id = restaurant_record.restaurant_id AND mc.name = 'Desserts' AND m.name = 'Kids';
        
        -- Get drinks category IDs
        SELECT mc.id INTO white_wine_id FROM public.menu_categories mc 
        JOIN public.menus m ON mc.menu_id = m.id 
        WHERE m.restaurant_id = restaurant_record.restaurant_id AND mc.name = 'WHITE WINE';
        
        SELECT mc.id INTO rose_wine_id FROM public.menu_categories mc 
        JOIN public.menus m ON mc.menu_id = m.id 
        WHERE m.restaurant_id = restaurant_record.restaurant_id AND mc.name = 'ROSE WINE';
        
        SELECT mc.id INTO red_wine_id FROM public.menu_categories mc 
        JOIN public.menus m ON mc.menu_id = m.id 
        WHERE m.restaurant_id = restaurant_record.restaurant_id AND mc.name = 'RED WINE';
        
        SELECT mc.id INTO bubbles_id FROM public.menu_categories mc 
        JOIN public.menus m ON mc.menu_id = m.id 
        WHERE m.restaurant_id = restaurant_record.restaurant_id AND mc.name = 'BUBBLES';
        
        SELECT mc.id INTO ice_tea_cocktails_id FROM public.menu_categories mc 
        JOIN public.menus m ON mc.menu_id = m.id 
        WHERE m.restaurant_id = restaurant_record.restaurant_id AND mc.name = 'ICE TEA & COCKTAILS';
        
        SELECT mc.id INTO beer_cider_id FROM public.menu_categories mc 
        JOIN public.menus m ON mc.menu_id = m.id 
        WHERE m.restaurant_id = restaurant_record.restaurant_id AND mc.name = 'BEER & CIDER';
        
        SELECT mc.id INTO greek_spirits_id FROM public.menu_categories mc 
        JOIN public.menus m ON mc.menu_id = m.id 
        WHERE m.restaurant_id = restaurant_record.restaurant_id AND mc.name = 'GREEK SPIRITS';
        
        SELECT mc.id INTO fruit_juices_id FROM public.menu_categories mc 
        JOIN public.menus m ON mc.menu_id = m.id 
        WHERE m.restaurant_id = restaurant_record.restaurant_id AND mc.name = 'FRUIT JUICES';
        
        SELECT mc.id INTO mineral_water_id FROM public.menu_categories mc 
        JOIN public.menus m ON mc.menu_id = m.id 
        WHERE m.restaurant_id = restaurant_record.restaurant_id AND mc.name = 'MINERAL WATER';
        
        SELECT mc.id INTO soft_drinks_id FROM public.menu_categories mc 
        JOIN public.menus m ON mc.menu_id = m.id 
        WHERE m.restaurant_id = restaurant_record.restaurant_id AND mc.name = 'SOFT DRINKS';
        
        SELECT mc.id INTO coffee_tea_id FROM public.menu_categories mc 
        JOIN public.menus m ON mc.menu_id = m.id 
        WHERE m.restaurant_id = restaurant_record.restaurant_id AND mc.name = 'COFFEE & TEA';
        
        -- ALL DAY MENU ITEMS
        
        -- GREEK NIBBLES
        INSERT INTO public.menu_items (category_id, name, description, price, allergens, dietary_info, is_popular, preparation_time, calories) VALUES
        (greek_nibbles_id, 'Greek Olives', 'Traditional Kalamata and mixed Greek olives', 4.95, '{SD}', '{V, VG}', true, 2, 120),
        (greek_nibbles_id, 'Halloumi Popcorn', 'Crispy bites of halloumi cheese', 6.95, '{D}', '{V}', true, 8, 280);
        
        -- COLD MEZE
        INSERT INTO public.menu_items (category_id, name, description, price, allergens, dietary_info, is_popular, preparation_time, calories) VALUES
        (cold_meze_id, 'Flat Bread', 'Traditional Greek flat bread', 3.95, '{G}', '{V, VG}', true, 3, 180),
        (cold_meze_id, 'GF Flat Bread', 'Gluten-free flat bread', 4.95, '{}', '{V, VG}', false, 3, 180),
        (cold_meze_id, 'Tzatziki', 'Greek yogurt with cucumber and mint', 5.95, '{D, SD}', '{V}', true, 3, 120),
        (cold_meze_id, 'Houmus', 'Classic chickpea and tahini dip', 5.95, '{S, SD}', '{V, VG}', true, 3, 150),
        (cold_meze_id, 'Spicy Feta', 'Creamy feta cheese with chili', 6.95, '{D, SD}', '{V}', false, 3, 200);
        
        -- HOT MEZE
        INSERT INTO public.menu_items (category_id, name, description, price, allergens, dietary_info, is_popular, preparation_time, calories) VALUES
        (hot_meze_id, 'Fried Kalamari', 'Crispy squid rings with lemon', 9.95, '{E, G, M, SD}', '{}', true, 12, 320),
        (hot_meze_id, 'Dolmades', 'Vine leaves stuffed with rice and herbs', 8.95, '{D, MU, C}', '{V}', false, 15, 220),
        (hot_meze_id, 'Moussaka', 'Traditional layered aubergine and lamb dish', 12.95, '{D, G, E, SD}', '{}', true, 25, 450),
        (hot_meze_id, 'Courgette Fritters', 'Golden fried courgette with herbs', 7.95, '{G}', '{V, VG}', true, 10, 250);
        
        -- SOUVLAKI GRILL
        INSERT INTO public.menu_items (category_id, name, description, price, allergens, dietary_info, is_popular, preparation_time, calories) VALUES
        (souvlaki_grill_id, 'Halloumi', 'Grilled halloumi cheese with herbs', 11.95, '{D, SD}', '{V}', true, 8, 280),
        (souvlaki_grill_id, 'Chicken', 'Grilled chicken souvlaki skewers', 14.95, '{D, E, SO}', '{}', true, 15, 380),
        (souvlaki_grill_id, 'Lamb', 'Traditional lamb souvlaki with herbs', 17.95, '{D, SD}', '{}', true, 18, 450),
        (souvlaki_grill_id, 'Mushroom', 'Grilled mushroom skewers with herbs', 10.95, '{}', '{V, VG}', false, 12, 180);
        
        -- SOUVLAKI WRAP
        INSERT INTO public.menu_items (category_id, name, description, price, allergens, dietary_info, is_popular, preparation_time, calories) VALUES
        (souvlaki_wrap_id, 'Chicken', 'Chicken gyros wrapped in warm pita', 8.95, '{D, SO}', '{}', true, 8, 450),
        (souvlaki_wrap_id, 'Courgette', 'Grilled courgette wrap with herbs', 7.95, '{G}', '{V, VG}', false, 8, 380),
        (souvlaki_wrap_id, 'Halloumi', 'Grilled halloumi wrap with salad', 8.95, '{D, SD}', '{V}', true, 8, 420),
        (souvlaki_wrap_id, 'Pork', 'Traditional pork gyros wrap', 9.95, '{D}', '{}', true, 8, 480);
        
        -- SALADS & SIDES
        INSERT INTO public.menu_items (category_id, name, description, price, allergens, dietary_info, is_popular, preparation_time, calories) VALUES
        (salads_sides_id, 'Green Leaf Salad', 'Fresh mixed green salad with olive oil', 6.95, '{}', '{V, VG}', false, 5, 80),
        (salads_sides_id, 'Greek Salad', 'Traditional village salad with feta', 8.95, '{D, SD}', '{V}', true, 5, 220),
        (salads_sides_id, 'Chips', 'Crispy golden chips', 4.95, '{}', '{V, VG}', true, 8, 280),
        (salads_sides_id, 'Halloumi Fries', 'Crispy halloumi sticks', 6.95, '{D}', '{V}', true, 10, 320);
        
        -- ALL DAY DESSERTS
        INSERT INTO public.menu_items (category_id, name, description, price, allergens, dietary_info, is_popular, preparation_time, calories) VALUES
        (all_day_desserts_id, 'Baklava', 'Traditional honey and nut pastry', 5.95, '{D, G, N, P}', '{V}', true, 3, 320),
        (all_day_desserts_id, 'Chocolate Mousse Cake', 'Rich chocolate mousse cake', 6.95, '{D, G, E, SO}', '{V}', true, 3, 380),
        (all_day_desserts_id, 'Raspberry Sorbet', 'Fresh raspberry sorbet', 4.95, '{}', '{V, VG}', false, 2, 120),
        (all_day_desserts_id, 'Chocolate Ice Cream', 'Creamy chocolate ice cream', 4.95, '{D}', '{V}', true, 2, 250);
        
        -- LUNCH MENU ITEMS
        
        -- GREEK PLATE
        INSERT INTO public.menu_items (category_id, name, description, price, allergens, dietary_info, is_popular, preparation_time, calories) VALUES
        (greek_plate_id, 'Chicken', 'Chicken souvlaki with rice and salad', 11.95, '{D, SO}', '{}', true, 12, 480),
        (greek_plate_id, 'Courgette Fritters', 'Courgette fritters with Greek salad', 9.95, '{G}', '{V, VG}', true, 10, 420),
        (greek_plate_id, 'Mushroom', 'Grilled mushroom with rice and vegetables', 9.95, '{}', '{V, VG}', false, 12, 350),
        (greek_plate_id, 'Prawn', 'Grilled prawns with Greek salad', 13.95, '{CR, D, SD}', '{}', true, 15, 320);
        
        -- SOUVLAKI WRAP & SIDE
        INSERT INTO public.menu_items (category_id, name, description, price, allergens, dietary_info, is_popular, preparation_time, calories) VALUES
        (lunch_wrap_id, 'Chicken', 'Chicken wrap with Greek chips', 10.95, '{D, SO}', '{}', true, 10, 650),
        (lunch_wrap_id, 'Courgette Fritters', 'Courgette wrap with salad', 9.95, '{G}', '{V, VG}', false, 10, 520),
        (lunch_wrap_id, 'Lamb', 'Lamb wrap with Greek chips', 12.95, '{D}', '{}', true, 10, 680),
        (lunch_wrap_id, 'Pork', 'Pork wrap with Greek salad', 11.95, '{D}', '{}', true, 10, 580);
        
        -- KIDS MENU ITEMS
        
        -- KIDS MAINS
        INSERT INTO public.menu_items (category_id, name, description, price, allergens, dietary_info, is_popular, preparation_time, calories) VALUES
        (kids_mains_id, 'Chicken', 'Mini chicken souvlaki with chips', 6.95, '{D, SO}', '{}', true, 10, 320),
        (kids_mains_id, 'Halloumi', 'Grilled halloumi with chips', 6.95, '{D}', '{V}', true, 8, 350),
        (kids_mains_id, 'Pork', 'Mini pork souvlaki with chips', 6.95, '{D}', '{}', false, 10, 340),
        (kids_mains_id, 'Courgette', 'Courgette fritters with chips', 5.95, '{G}', '{V, VG}', false, 10, 300);
        
        -- KIDS DRINKS
        INSERT INTO public.menu_items (category_id, name, description, price, allergens, dietary_info, is_popular, preparation_time, calories) VALUES
        (kids_drinks_id, 'Apple Juice', 'Fresh apple juice', 2.95, '{}', '{}', true, 1, 110),
        (kids_drinks_id, 'Orange Juice', 'Fresh orange juice', 2.95, '{}', '{}', true, 1, 120),
        (kids_drinks_id, 'Glass of Milk', 'Fresh whole milk', 2.50, '{}', '{V}', false, 1, 150),
        (kids_drinks_id, 'Coke Zero', 'Sugar-free cola', 2.95, '{}', '{}', true, 1, 0);
        
        -- KIDS DESSERTS
        INSERT INTO public.menu_items (category_id, name, description, price, allergens, dietary_info, is_popular, preparation_time, calories) VALUES
        (kids_desserts_id, 'Greek Yoghurt with honey', 'Creamy Greek yogurt with honey', 3.50, '{D}', '{V}', true, 1, 120),
        (kids_desserts_id, 'Raspberry Sorbet', 'Fresh raspberry sorbet', 3.95, '{}', '{V, VG}', false, 2, 100),
        (kids_desserts_id, 'Vanilla Ice Cream', 'Creamy vanilla ice cream', 3.50, '{}', '{V}', true, 2, 180),
        (kids_desserts_id, 'Chocolate Ice Cream', 'Rich chocolate ice cream', 3.50, '{}', '{V}', true, 2, 200);
        
        -- DRINKS MENU ITEMS
        
        -- WHITE WINE
        INSERT INTO public.menu_items (category_id, name, description, price, allergens, dietary_info, is_popular, preparation_time, calories) VALUES
        (white_wine_id, 'Ellinas White', 'Greek white wine from Santorini', 28.00, '{SO}', '{}', true, 2, 120),
        (white_wine_id, 'Sauvignon', 'Crisp Sauvignon Blanc', 32.00, '{SO}', '{}', true, 2, 115);
        
        -- ROSE WINE
        INSERT INTO public.menu_items (category_id, name, description, price, allergens, dietary_info, is_popular, preparation_time, calories) VALUES
        (rose_wine_id, 'Rosato', 'Greek island rosé wine', 29.00, '{SO}', '{}', true, 2, 115),
        (rose_wine_id, 'Xinomavro', 'Premium Greek rosé', 35.00, '{SO}', '{}', false, 2, 120);
        
        -- RED WINE
        INSERT INTO public.menu_items (category_id, name, description, price, allergens, dietary_info, is_popular, preparation_time, calories) VALUES
        (red_wine_id, 'Ellinas Red', 'Full-bodied Greek red wine', 30.00, '{SO}', '{}', true, 2, 125),
        (red_wine_id, 'Merlot', 'Smooth Merlot red wine', 34.00, '{SO}', '{}', true, 2, 130);
        
        -- BUBBLES
        INSERT INTO public.menu_items (category_id, name, description, price, allergens, dietary_info, is_popular, preparation_time, calories) VALUES
        (bubbles_id, 'Prosecco', 'Italian sparkling wine', 35.00, '{SO}', '{}', true, 2, 90);
        
        -- ICE TEA & COCKTAILS
        INSERT INTO public.menu_items (category_id, name, description, price, allergens, dietary_info, is_popular, preparation_time, calories) VALUES
        (ice_tea_cocktails_id, 'Peach Ice Tea', 'Refreshing peach iced tea', 4.95, '{}', '{}', true, 3, 80),
        (ice_tea_cocktails_id, 'Greek Sangria', 'Traditional Greek fruit sangria', 8.95, '{SO}', '{}', true, 5, 150),
        (ice_tea_cocktails_id, 'Expresso Martini', 'Coffee cocktail with vodka', 9.95, '{}', '{V}', false, 5, 200),
        (ice_tea_cocktails_id, 'Greek Mojito', 'Mint and lime cocktail Greek style', 8.95, '{}', '{}', true, 5, 180);
        
        -- BEER & CIDER
        INSERT INTO public.menu_items (category_id, name, description, price, allergens, dietary_info, is_popular, preparation_time, calories) VALUES
        (beer_cider_id, 'Draft Alpha Omega', 'Premium Greek draft beer', 5.50, '{G}', '{}', true, 1, 150),
        (beer_cider_id, 'Mythos', 'Classic Greek lager beer', 4.95, '{G}', '{}', true, 1, 140),
        (beer_cider_id, 'GF Mythos', 'Gluten-free Greek beer', 5.95, '{}', '{}', false, 1, 140),
        (beer_cider_id, 'Cider', 'Traditional apple cider', 5.95, '{SO}', '{}', false, 1, 180);
        
        -- GREEK SPIRITS
        INSERT INTO public.menu_items (category_id, name, description, price, allergens, dietary_info, is_popular, preparation_time, calories) VALUES
        (greek_spirits_id, 'Ouzo', 'Traditional Greek anise spirit', 5.95, '{}', '{}', true, 1, 80),
        (greek_spirits_id, 'Tsipouro', 'Premium Greek grape spirit', 6.95, '{}', '{}', false, 1, 85),
        (greek_spirits_id, 'Metaxa', 'Greek brandy', 8.95, '{}', '{}', false, 1, 90),
        (greek_spirits_id, 'Axia Mastiha', 'Mastic liqueur from Chios', 7.95, '{}', '{}', false, 1, 100);
        
        -- FRUIT JUICES
        INSERT INTO public.menu_items (category_id, name, description, price, allergens, dietary_info, is_popular, preparation_time, calories) VALUES
        (fruit_juices_id, 'Orange Juice', 'Freshly squeezed orange juice', 4.50, '{}', '{}', true, 2, 110),
        (fruit_juices_id, 'Apple Juice', 'Pure apple juice', 3.95, '{}', '{}', true, 1, 115),
        (fruit_juices_id, 'Lemon Juice', 'Fresh lemon juice', 3.50, '{}', '{}', false, 2, 25);
        
        -- MINERAL WATER
        INSERT INTO public.menu_items (category_id, name, description, price, allergens, dietary_info, is_popular, preparation_time, calories) VALUES
        (mineral_water_id, 'Still Water', 'Natural still mineral water', 3.00, '{}', '{}', true, 1, 0),
        (mineral_water_id, 'Sparkling Water', 'Natural sparkling mineral water', 3.50, '{}', '{}', true, 1, 0);
        
        -- SOFT DRINKS
        INSERT INTO public.menu_items (category_id, name, description, price, allergens, dietary_info, is_popular, preparation_time, calories) VALUES
        (soft_drinks_id, 'Coke', 'Classic Coca Cola', 3.50, '{}', '{}', true, 1, 140),
        (soft_drinks_id, 'Coke Zero', 'Sugar-free Coca Cola', 3.50, '{}', '{}', true, 1, 0),
        (soft_drinks_id, 'Ginger Beer', 'Spicy ginger beer', 3.95, '{}', '{}', false, 1, 120),
        (soft_drinks_id, 'Lemonade', 'Fresh Greek lemonade', 4.50, '{}', '{}', true, 3, 110);
        
        -- COFFEE & TEA
        INSERT INTO public.menu_items (category_id, name, description, price, allergens, dietary_info, is_popular, preparation_time, calories) VALUES
        (coffee_tea_id, 'Greek Coffee', 'Traditional strong Greek coffee', 3.95, '{}', '{}', true, 5, 5),
        (coffee_tea_id, 'Greek Mountain Tea', 'Herbal mountain tea from Greece', 3.50, '{}', '{}', false, 4, 0),
        (coffee_tea_id, 'Freddo Expresso', 'Iced espresso Greek style', 4.50, '{}', '{V}', true, 5, 10);
        
    END LOOP;
END $$;