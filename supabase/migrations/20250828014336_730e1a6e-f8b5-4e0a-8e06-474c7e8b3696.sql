-- Recreate The Real Greek menus with correct structure for all locations
DO $$
DECLARE
    restaurant_record RECORD;
    all_day_menu_uuid UUID;
    lunch_menu_uuid UUID;
    kids_menu_uuid UUID;
    drinks_menu_uuid UUID;
    
    -- All Day Menu Categories
    greek_nibbles_uuid UUID;
    cold_meze_uuid UUID;
    hot_meze_uuid UUID;
    souvlaki_grill_uuid UUID;
    salads_sides_uuid UUID;
    souvlaki_wrap_uuid UUID;
    all_day_desserts_uuid UUID;
    
    -- Lunch Menu Categories
    greek_plate_uuid UUID;
    lunch_wrap_uuid UUID;
    
    -- Kids Menu Categories
    kids_mains_uuid UUID;
    kids_drinks_uuid UUID;
    kids_desserts_uuid UUID;
    
    -- Drinks Menu Categories
    white_wine_uuid UUID;
    rose_wine_uuid UUID;
    red_wine_uuid UUID;
    bubbles_uuid UUID;
    ice_tea_cocktails_uuid UUID;
    beer_cider_uuid UUID;
    greek_spirits_uuid UUID;
    fruit_juices_uuid UUID;
    mineral_water_uuid UUID;
    soft_drinks_uuid UUID;
    coffee_tea_uuid UUID;
BEGIN
    -- Loop through all The Real Greek restaurants
    FOR restaurant_record IN 
        SELECT id FROM public.restaurants WHERE name = 'The Real Greek'
    LOOP
        -- Create menus for this restaurant
        INSERT INTO public.menus (restaurant_id, name, description, display_order) VALUES
        (restaurant_record.id, 'All Day', 'Our full menu available all day', 1) RETURNING id INTO all_day_menu_uuid;
        
        INSERT INTO public.menus (restaurant_id, name, description, display_order) VALUES
        (restaurant_record.id, 'Lunch', 'Quick lunch options', 2) RETURNING id INTO lunch_menu_uuid;
        
        INSERT INTO public.menus (restaurant_id, name, description, display_order) VALUES
        (restaurant_record.id, 'Kids', 'Delicious meals for our youngest guests', 3) RETURNING id INTO kids_menu_uuid;
        
        INSERT INTO public.menus (restaurant_id, name, description, display_order) VALUES
        (restaurant_record.id, 'Drinks', 'Wines, spirits, and beverages', 4) RETURNING id INTO drinks_menu_uuid;
        
        -- Create ALL DAY MENU categories
        INSERT INTO public.menu_categories (menu_id, name, description, display_order) VALUES
        (all_day_menu_uuid, 'GREEK NIBBLES', 'Light bites and appetizers', 1) RETURNING id INTO greek_nibbles_uuid;
        
        INSERT INTO public.menu_categories (menu_id, name, description, display_order) VALUES
        (all_day_menu_uuid, 'COLD MEZE', 'Traditional cold Greek dishes', 2) RETURNING id INTO cold_meze_uuid;
        
        INSERT INTO public.menu_categories (menu_id, name, description, display_order) VALUES
        (all_day_menu_uuid, 'HOT MEZE', 'Warm Greek sharing plates', 3) RETURNING id INTO hot_meze_uuid;
        
        INSERT INTO public.menu_categories (menu_id, name, description, display_order) VALUES
        (all_day_menu_uuid, 'SOUVLAKI GRILL', 'Fresh grilled meats and seafood', 4) RETURNING id INTO souvlaki_grill_uuid;
        
        INSERT INTO public.menu_categories (menu_id, name, description, display_order) VALUES
        (all_day_menu_uuid, 'SALADS & SIDES', 'Fresh salads and accompaniments', 5) RETURNING id INTO salads_sides_uuid;
        
        INSERT INTO public.menu_categories (menu_id, name, description, display_order) VALUES
        (all_day_menu_uuid, 'SOUVLAKI WRAP', 'Authentic Greek wraps', 6) RETURNING id INTO souvlaki_wrap_uuid;
        
        INSERT INTO public.menu_categories (menu_id, name, description, display_order) VALUES
        (all_day_menu_uuid, 'DESSERTS', 'Traditional Greek desserts', 7) RETURNING id INTO all_day_desserts_uuid;
        
        -- Create LUNCH MENU categories
        INSERT INTO public.menu_categories (menu_id, name, description, display_order) VALUES
        (lunch_menu_uuid, 'GREEK PLATE', 'Complete Greek lunch plates', 1) RETURNING id INTO greek_plate_uuid;
        
        INSERT INTO public.menu_categories (menu_id, name, description, display_order) VALUES
        (lunch_menu_uuid, 'SOUVLAKI WRAP & SIDE', 'Wraps with accompaniments', 2) RETURNING id INTO lunch_wrap_uuid;
        
        -- Create KIDS MENU categories
        INSERT INTO public.menu_categories (menu_id, name, description, display_order) VALUES
        (kids_menu_uuid, 'Main', 'Kid-friendly main dishes', 1) RETURNING id INTO kids_mains_uuid;
        
        INSERT INTO public.menu_categories (menu_id, name, description, display_order) VALUES
        (kids_menu_uuid, 'Drinks', 'Beverages for children', 2) RETURNING id INTO kids_drinks_uuid;
        
        INSERT INTO public.menu_categories (menu_id, name, description, display_order) VALUES
        (kids_menu_uuid, 'Desserts', 'Sweet treats for kids', 3) RETURNING id INTO kids_desserts_uuid;
        
        -- Create DRINKS MENU categories
        INSERT INTO public.menu_categories (menu_id, name, description, display_order) VALUES
        (drinks_menu_uuid, 'WHITE WINE', 'Greek and international white wines', 1) RETURNING id INTO white_wine_uuid;
        
        INSERT INTO public.menu_categories (menu_id, name, description, display_order) VALUES
        (drinks_menu_uuid, 'ROSE WINE', 'Refreshing rosé wines', 2) RETURNING id INTO rose_wine_uuid;
        
        INSERT INTO public.menu_categories (menu_id, name, description, display_order) VALUES
        (drinks_menu_uuid, 'RED WINE', 'Full-bodied red wines', 3) RETURNING id INTO red_wine_uuid;
        
        INSERT INTO public.menu_categories (menu_id, name, description, display_order) VALUES
        (drinks_menu_uuid, 'BUBBLES', 'Sparkling wines and champagne', 4) RETURNING id INTO bubbles_uuid;
        
        INSERT INTO public.menu_categories (menu_id, name, description, display_order) VALUES
        (drinks_menu_uuid, 'ICE TEA & COCKTAILS', 'Refreshing cocktails and iced teas', 5) RETURNING id INTO ice_tea_cocktails_uuid;
        
        INSERT INTO public.menu_categories (menu_id, name, description, display_order) VALUES
        (drinks_menu_uuid, 'BEER & CIDER', 'Greek and international beers', 6) RETURNING id INTO beer_cider_uuid;
        
        INSERT INTO public.menu_categories (menu_id, name, description, display_order) VALUES
        (drinks_menu_uuid, 'GREEK SPIRITS', 'Traditional Greek spirits and liqueurs', 7) RETURNING id INTO greek_spirits_uuid;
        
        INSERT INTO public.menu_categories (menu_id, name, description, display_order) VALUES
        (drinks_menu_uuid, 'FRUIT JUICES', 'Fresh and natural fruit juices', 8) RETURNING id INTO fruit_juices_uuid;
        
        INSERT INTO public.menu_categories (menu_id, name, description, display_order) VALUES
        (drinks_menu_uuid, 'MINERAL WATER', 'Still and sparkling water', 9) RETURNING id INTO mineral_water_uuid;
        
        INSERT INTO public.menu_categories (menu_id, name, description, display_order) VALUES
        (drinks_menu_uuid, 'SOFT DRINKS', 'Sodas and soft beverages', 10) RETURNING id INTO soft_drinks_uuid;
        
        INSERT INTO public.menu_categories (menu_id, name, description, display_order) VALUES
        (drinks_menu_uuid, 'COFFEE & TEA', 'Traditional Greek coffee and teas', 11) RETURNING id INTO coffee_tea_uuid;
        
        -- Now add sample menu items for each category
        
        -- GREEK NIBBLES
        INSERT INTO public.menu_items (category_id, name, description, price, allergens, dietary_info, is_popular, preparation_time, calories) VALUES
        (greek_nibbles_uuid, 'Olives & Feta', 'Kalamata olives with feta cheese and herbs', 4.95, '{D}', '{V}', true, 2, 120),
        (greek_nibbles_uuid, 'Pitta & Dips', 'Warm pitta with tzatziki, hummus and taramosalata', 6.95, '{G, F, D, S}', '{}', true, 5, 280),
        (greek_nibbles_uuid, 'Stuffed Vine Leaves', 'Rice and herb filled vine leaves', 5.95, '{N}', '{V, VG}', false, 10, 180);
        
        -- COLD MEZE
        INSERT INTO public.menu_items (category_id, name, description, price, allergens, dietary_info, is_popular, preparation_time, calories) VALUES
        (cold_meze_uuid, 'Greek Village Salad', 'Tomatoes, cucumber, olives, feta with olive oil', 8.95, '{D}', '{V}', true, 5, 220),
        (cold_meze_uuid, 'Hummus', 'Classic chickpea and tahini dip', 5.95, '{S}', '{V, VG}', true, 3, 150),
        (cold_meze_uuid, 'Taramosalata', 'Creamy fish roe dip', 6.95, '{F, G}', '{}', false, 3, 180),
        (cold_meze_uuid, 'Tzatziki', 'Greek yogurt with cucumber and mint', 5.95, '{D}', '{V}', true, 3, 120);
        
        -- HOT MEZE
        INSERT INTO public.menu_items (category_id, name, description, price, allergens, dietary_info, is_popular, preparation_time, calories) VALUES
        (hot_meze_uuid, 'Halloumi Saganaki', 'Grilled halloumi with honey and oregano', 8.95, '{D}', '{V}', true, 8, 280),
        (hot_meze_uuid, 'Greek Sausage', 'Traditional spicy Greek sausage', 9.95, '{}', '{}', false, 12, 350),
        (hot_meze_uuid, 'Feta Parcels', 'Filo pastry parcels with feta and honey', 7.95, '{G, D, E}', '{V}', true, 10, 250),
        (hot_meze_uuid, 'Spanakopita', 'Spinach and feta filo pie', 8.95, '{G, D, E}', '{V}', false, 15, 320);
        
        -- SOUVLAKI GRILL
        INSERT INTO public.menu_items (category_id, name, description, price, allergens, dietary_info, is_popular, preparation_time, calories) VALUES
        (souvlaki_grill_uuid, 'Chicken Souvlaki', 'Grilled chicken skewers with tzatziki', 14.95, '{D}', '{}', true, 15, 380),
        (souvlaki_grill_uuid, 'Pork Souvlaki', 'Traditional pork skewers with lemon', 15.95, '{D}', '{}', true, 15, 420),
        (souvlaki_grill_uuid, 'Lamb Souvlaki', 'Tender lamb skewers with herbs', 17.95, '{D}', '{}', false, 18, 450),
        (souvlaki_grill_uuid, 'Sea Bass', 'Whole grilled sea bass with olive oil', 19.95, '{F}', '{}', true, 20, 320),
        (souvlaki_grill_uuid, 'Mixed Grill Platter', 'Selection of grilled meats for sharing', 28.95, '{D}', '{}', true, 25, 680);
        
        -- SALADS & SIDES
        INSERT INTO public.menu_items (category_id, name, description, price, allergens, dietary_info, is_popular, preparation_time, calories) VALUES
        (salads_sides_uuid, 'Greek Chips', 'Crispy chips with oregano and feta', 4.95, '{D}', '{V}', true, 8, 280),
        (salads_sides_uuid, 'Rice Pilaf', 'Aromatic Greek rice with herbs', 3.95, '{}', '{V, VG}', false, 10, 180),
        (salads_sides_uuid, 'Roast Vegetables', 'Mediterranean roasted vegetables', 5.95, '{}', '{V, VG}', true, 15, 150),
        (salads_sides_uuid, 'Warm Pitta Bread', 'Freshly baked Greek pitta', 2.95, '{G}', '{V, VG}', true, 3, 120);
        
        -- SOUVLAKI WRAP
        INSERT INTO public.menu_items (category_id, name, description, price, allergens, dietary_info, is_popular, preparation_time, calories) VALUES
        (souvlaki_wrap_uuid, 'Chicken Gyros Wrap', 'Chicken gyros in warm pitta with salad', 8.95, '{G, D}', '{}', true, 8, 450),
        (souvlaki_wrap_uuid, 'Pork Gyros Wrap', 'Pork gyros with tzatziki and tomatoes', 9.95, '{G, D}', '{}', true, 8, 480),
        (souvlaki_wrap_uuid, 'Halloumi Wrap', 'Grilled halloumi with vegetables', 8.95, '{G, D}', '{V}', false, 8, 420),
        (souvlaki_wrap_uuid, 'Falafel Wrap', 'Homemade falafel with hummus', 7.95, '{G, S}', '{V, VG}', true, 8, 380);
        
        -- ALL DAY DESSERTS
        INSERT INTO public.menu_items (category_id, name, description, price, allergens, dietary_info, is_popular, preparation_time, calories) VALUES
        (all_day_desserts_uuid, 'Baklava', 'Traditional honey and nut pastry', 5.95, '{G, N, E}', '{}', true, 3, 320),
        (all_day_desserts_uuid, 'Greek Yogurt with Honey', 'Thick yogurt with thyme honey', 4.95, '{D}', '{V}', true, 2, 180),
        (all_day_desserts_uuid, 'Galaktoboureko', 'Custard pastry with syrup', 5.95, '{G, D, E}', '{}', false, 3, 290);
        
        -- GREEK PLATE (Lunch)
        INSERT INTO public.menu_items (category_id, name, description, price, allergens, dietary_info, is_popular, preparation_time, calories) VALUES
        (greek_plate_uuid, 'Chicken Greek Plate', 'Chicken souvlaki with rice and salad', 11.95, '{D}', '{}', true, 12, 480),
        (greek_plate_uuid, 'Pork Greek Plate', 'Pork souvlaki with Greek chips', 12.95, '{D}', '{}', true, 12, 520),
        (greek_plate_uuid, 'Vegetarian Greek Plate', 'Falafel, hummus, salad and pitta', 9.95, '{G, S}', '{V, VG}', true, 10, 420);
        
        -- SOUVLAKI WRAP & SIDE (Lunch)
        INSERT INTO public.menu_items (category_id, name, description, price, allergens, dietary_info, is_popular, preparation_time, calories) VALUES
        (lunch_wrap_uuid, 'Chicken Wrap & Chips', 'Chicken gyros wrap with Greek chips', 10.95, '{G, D}', '{}', true, 10, 650),
        (lunch_wrap_uuid, 'Pork Wrap & Salad', 'Pork gyros wrap with Greek salad', 11.95, '{G, D}', '{}', true, 10, 580),
        (lunch_wrap_uuid, 'Halloumi Wrap & Rice', 'Halloumi wrap with rice pilaf', 9.95, '{G, D}', '{V}', false, 10, 520);
        
        -- KIDS MAINS
        INSERT INTO public.menu_items (category_id, name, description, price, allergens, dietary_info, is_popular, preparation_time, calories) VALUES
        (kids_mains_uuid, 'Mini Chicken Souvlaki', 'Small chicken skewer with chips', 6.95, '{}', '{}', true, 10, 320),
        (kids_mains_uuid, 'Kids Chicken Wrap', 'Small chicken wrap with cucumber', 5.95, '{G, D}', '{}', true, 8, 280),
        (kids_mains_uuid, 'Greek Pasta', 'Pasta with tomato sauce and cheese', 5.95, '{G, D}', '{}', false, 10, 350);
        
        -- KIDS DRINKS
        INSERT INTO public.menu_items (category_id, name, description, price, allergens, dietary_info, is_popular, preparation_time, calories) VALUES
        (kids_drinks_uuid, 'Apple Juice', 'Fresh apple juice', 2.95, '{}', '{V, VG}', true, 1, 110),
        (kids_drinks_uuid, 'Orange Juice', 'Fresh orange juice', 2.95, '{}', '{V, VG}', true, 1, 120),
        (kids_drinks_uuid, 'Milk', 'Fresh whole milk', 2.50, '{D}', '{V}', false, 1, 150);
        
        -- KIDS DESSERTS
        INSERT INTO public.menu_items (category_id, name, description, price, allergens, dietary_info, is_popular, preparation_time, calories) VALUES
        (kids_desserts_uuid, 'Mini Baklava', 'Child-sized honey pastry', 3.95, '{G, N, E}', '{}', true, 2, 180),
        (kids_desserts_uuid, 'Greek Yogurt', 'Plain Greek yogurt with honey', 3.50, '{D}', '{V}', true, 1, 120);
        
        -- DRINKS MENU ITEMS
        
        -- WHITE WINE
        INSERT INTO public.menu_items (category_id, name, description, price, allergens, dietary_info, is_popular, preparation_time, calories) VALUES
        (white_wine_uuid, 'Assyrtiko Santorini', 'Crisp Greek white wine', 32.00, '{SO}', '{V, VG}', true, 2, 120),
        (white_wine_uuid, 'Sauvignon Blanc', 'Fresh and zesty white wine', 28.00, '{SO}', '{V, VG}', false, 2, 115),
        (white_wine_uuid, 'House White Wine (Glass)', 'Greek house white wine', 6.50, '{SO}', '{V, VG}', true, 1, 120);
        
        -- ROSE WINE
        INSERT INTO public.menu_items (category_id, name, description, price, allergens, dietary_info, is_popular, preparation_time, calories) VALUES
        (rose_wine_uuid, 'Greek Island Rosé', 'Light and fruity rosé', 29.00, '{SO}', '{V, VG}', true, 2, 115),
        (rose_wine_uuid, 'Provence Rosé (Glass)', 'French rosé wine', 7.50, '{SO}', '{V, VG}', false, 1, 115);
        
        -- RED WINE
        INSERT INTO public.menu_items (category_id, name, description, price, allergens, dietary_info, is_popular, preparation_time, calories) VALUES
        (red_wine_uuid, 'Nemea Red Wine', 'Full-bodied Greek red', 34.00, '{SO}', '{V, VG}', true, 2, 125),
        (red_wine_uuid, 'House Red Wine (Glass)', 'Greek house red wine', 6.50, '{SO}', '{V, VG}', true, 1, 125);
        
        -- BUBBLES
        INSERT INTO public.menu_items (category_id, name, description, price, allergens, dietary_info, is_popular, preparation_time, calories) VALUES
        (bubbles_uuid, 'Prosecco', 'Italian sparkling wine', 35.00, '{SO}', '{V, VG}', true, 2, 90),
        (bubbles_uuid, 'Champagne', 'French champagne', 65.00, '{SO}', '{V, VG}', false, 2, 90);
        
        -- ICE TEA & COCKTAILS
        INSERT INTO public.menu_items (category_id, name, description, price, allergens, dietary_info, is_popular, preparation_time, calories) VALUES
        (ice_tea_cocktails_uuid, 'Greek Iced Tea', 'Traditional iced tea with lemon', 4.95, '{}', '{V, VG}', true, 3, 25),
        (ice_tea_cocktails_uuid, 'Ouzo Cocktail', 'Refreshing ouzo-based cocktail', 8.95, '{}', '{V, VG}', true, 5, 180),
        (ice_tea_cocktails_uuid, 'Greek Mojito', 'Mint and lime cocktail', 9.95, '{}', '{V, VG}', false, 5, 200);
        
        -- BEER & CIDER
        INSERT INTO public.menu_items (category_id, name, description, price, allergens, dietary_info, is_popular, preparation_time, calories) VALUES
        (beer_cider_uuid, 'Mythos Beer', 'Greek lager beer', 4.95, '{G}', '{V, VG}', true, 1, 140),
        (beer_cider_uuid, 'Alpha Beer', 'Premium Greek beer', 5.50, '{G}', '{V, VG}', false, 1, 150),
        (beer_cider_uuid, 'Greek Cider', 'Traditional apple cider', 5.95, '{SO}', '{V, VG}', false, 1, 180);
        
        -- GREEK SPIRITS
        INSERT INTO public.menu_items (category_id, name, description, price, allergens, dietary_info, is_popular, preparation_time, calories) VALUES
        (greek_spirits_uuid, 'Ouzo', 'Traditional anise spirit', 5.95, '{}', '{V, VG}', true, 1, 80),
        (greek_spirits_uuid, 'Metaxa', 'Greek brandy', 8.95, '{}', '{V, VG}', false, 1, 90),
        (greek_spirits_uuid, 'Tsipouro', 'Traditional Greek spirit', 6.95, '{}', '{V, VG}', false, 1, 85);
        
        -- FRUIT JUICES
        INSERT INTO public.menu_items (category_id, name, description, price, allergens, dietary_info, is_popular, preparation_time, calories) VALUES
        (fruit_juices_uuid, 'Fresh Orange Juice', 'Freshly squeezed orange juice', 4.50, '{}', '{V, VG}', true, 2, 110),
        (fruit_juices_uuid, 'Apple Juice', 'Pure apple juice', 3.95, '{}', '{V, VG}', true, 1, 115),
        (fruit_juices_uuid, 'Pomegranate Juice', 'Antioxidant-rich pomegranate juice', 5.95, '{}', '{V, VG}', false, 2, 140);
        
        -- MINERAL WATER
        INSERT INTO public.menu_items (category_id, name, description, price, allergens, dietary_info, is_popular, preparation_time, calories) VALUES
        (mineral_water_uuid, 'Greek Sparkling Water', 'Natural sparkling water', 3.50, '{}', '{V, VG}', true, 1, 0),
        (mineral_water_uuid, 'Still Mineral Water', 'Pure still water', 3.00, '{}', '{V, VG}', true, 1, 0),
        (mineral_water_uuid, 'Large Sparkling Water', 'Large bottle sparkling water', 5.95, '{}', '{V, VG}', false, 1, 0);
        
        -- SOFT DRINKS
        INSERT INTO public.menu_items (category_id, name, description, price, allergens, dietary_info, is_popular, preparation_time, calories) VALUES
        (soft_drinks_uuid, 'Coca Cola', 'Classic Coca Cola', 3.50, '{}', '{V, VG}', true, 1, 140),
        (soft_drinks_uuid, 'Lemonade', 'Fresh Greek lemonade', 4.50, '{}', '{V, VG}', true, 3, 120),
        (soft_drinks_uuid, 'Greek Orange Soda', 'Traditional orange soda', 3.95, '{}', '{V, VG}', false, 1, 130);
        
        -- COFFEE & TEA
        INSERT INTO public.menu_items (category_id, name, description, price, allergens, dietary_info, is_popular, preparation_time, calories) VALUES
        (coffee_tea_uuid, 'Greek Coffee', 'Traditional strong Greek coffee', 3.95, '{}', '{V, VG}', true, 5, 5),
        (coffee_tea_uuid, 'Mountain Tea', 'Greek herbal mountain tea', 3.50, '{}', '{V, VG}', false, 4, 0),
        (coffee_tea_uuid, 'Cappuccino', 'Italian-style cappuccino', 4.50, '{D}', '{V}', true, 5, 80),
        (coffee_tea_uuid, 'Espresso', 'Double shot espresso', 3.50, '{}', '{V, VG}', false, 3, 10);
        
    END LOOP;
END $$;