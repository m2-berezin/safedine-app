-- Add menus to all The Real Greek restaurants that don't have menus yet
DO $$
DECLARE
    restaurant_record RECORD;
    all_day_menu_uuid UUID;
    lunch_menu_uuid UUID;
    kids_menu_uuid UUID;
    drinks_menu_uuid UUID;
    
    -- Category UUIDs for All Day Menu
    all_day_mezze_uuid UUID;
    all_day_mains_uuid UUID;
    all_day_grills_uuid UUID;
    all_day_desserts_uuid UUID;
    
    -- Category UUIDs for Lunch Menu
    lunch_light_uuid UUID;
    lunch_mains_uuid UUID;
    
    -- Category UUIDs for Kids Menu
    kids_mains_uuid UUID;
    kids_sides_uuid UUID;
    
    -- Category UUIDs for Drinks Menu
    drinks_hot_uuid UUID;
    drinks_cold_uuid UUID;
    drinks_alcoholic_uuid UUID;
BEGIN
    -- Loop through all The Real Greek restaurants that don't have menus
    FOR restaurant_record IN 
        SELECT r.id 
        FROM public.restaurants r 
        WHERE r.name = 'The Real Greek' 
        AND NOT EXISTS (SELECT 1 FROM public.menus m WHERE m.restaurant_id = r.id)
    LOOP
        -- Create menus for this restaurant
        INSERT INTO public.menus (restaurant_id, name, description, display_order) VALUES
        (restaurant_record.id, 'All Day', 'Our full menu available all day', 1) RETURNING id INTO all_day_menu_uuid;
        
        INSERT INTO public.menus (restaurant_id, name, description, display_order) VALUES
        (restaurant_record.id, 'Lunch', 'Light lunch options perfect for a quick meal', 2) RETURNING id INTO lunch_menu_uuid;
        
        INSERT INTO public.menus (restaurant_id, name, description, display_order) VALUES
        (restaurant_record.id, 'Kids', 'Delicious meals for our youngest guests', 3) RETURNING id INTO kids_menu_uuid;
        
        INSERT INTO public.menus (restaurant_id, name, description, display_order) VALUES
        (restaurant_record.id, 'Drinks', 'Refreshing beverages and traditional Greek drinks', 4) RETURNING id INTO drinks_menu_uuid;
        
        -- Create categories for All Day Menu
        INSERT INTO public.menu_categories (menu_id, name, description, display_order) VALUES
        (all_day_menu_uuid, 'Mezze & Starters', 'Traditional Greek small plates perfect for sharing', 1) RETURNING id INTO all_day_mezze_uuid;
        
        INSERT INTO public.menu_categories (menu_id, name, description, display_order) VALUES
        (all_day_menu_uuid, 'Main Dishes', 'Hearty traditional Greek main courses', 2) RETURNING id INTO all_day_mains_uuid;
        
        INSERT INTO public.menu_categories (menu_id, name, description, display_order) VALUES
        (all_day_menu_uuid, 'Grills & Souvlaki', 'Fresh grilled meats and seafood', 3) RETURNING id INTO all_day_grills_uuid;
        
        INSERT INTO public.menu_categories (menu_id, name, description, display_order) VALUES
        (all_day_menu_uuid, 'Desserts', 'Sweet endings to your Greek feast', 4) RETURNING id INTO all_day_desserts_uuid;
        
        -- Create categories for Lunch Menu
        INSERT INTO public.menu_categories (menu_id, name, description, display_order) VALUES
        (lunch_menu_uuid, 'Light Bites', 'Perfect for a quick lunch', 1) RETURNING id INTO lunch_light_uuid;
        
        INSERT INTO public.menu_categories (menu_id, name, description, display_order) VALUES
        (lunch_menu_uuid, 'Lunch Mains', 'Satisfying lunch portions', 2) RETURNING id INTO lunch_mains_uuid;
        
        -- Create categories for Kids Menu
        INSERT INTO public.menu_categories (menu_id, name, description, display_order) VALUES
        (kids_menu_uuid, 'Kids Mains', 'Child-friendly main dishes', 1) RETURNING id INTO kids_mains_uuid;
        
        INSERT INTO public.menu_categories (menu_id, name, description, display_order) VALUES
        (kids_menu_uuid, 'Kids Sides', 'Perfect sides for little ones', 2) RETURNING id INTO kids_sides_uuid;
        
        -- Create categories for Drinks Menu
        INSERT INTO public.menu_categories (menu_id, name, description, display_order) VALUES
        (drinks_menu_uuid, 'Hot Drinks', 'Traditional Greek coffee and teas', 1) RETURNING id INTO drinks_hot_uuid;
        
        INSERT INTO public.menu_categories (menu_id, name, description, display_order) VALUES
        (drinks_menu_uuid, 'Cold Drinks', 'Refreshing soft drinks and juices', 2) RETURNING id INTO drinks_cold_uuid;
        
        INSERT INTO public.menu_categories (menu_id, name, description, display_order) VALUES
        (drinks_menu_uuid, 'Alcoholic Beverages', 'Wine, beer and traditional Greek spirits', 3) RETURNING id INTO drinks_alcoholic_uuid;
        
        -- Insert menu items (same items for all restaurants)
        -- All Day Menu - Mezze & Starters
        INSERT INTO public.menu_items (category_id, name, description, price, allergens, dietary_info, is_popular, preparation_time, calories) VALUES
        (all_day_mezze_uuid, 'Taramosalata', 'Creamy fish roe dip served with warm pita bread', 8.95, '{F, G}', '{}', true, 5, 180),
        (all_day_mezze_uuid, 'Hummus', 'Classic chickpea and tahini dip with olive oil and paprika', 7.95, '{S}', '{V, VG}', true, 5, 150),
        (all_day_mezze_uuid, 'Dolmades', 'Vine leaves stuffed with rice, herbs and pine nuts', 9.95, '{N}', '{V, VG}', false, 15, 220),
        (all_day_mezze_uuid, 'Halloumi Saganaki', 'Grilled Cypriot cheese with honey and oregano', 10.95, '{D}', '{V}', true, 8, 280),
        (all_day_mezze_uuid, 'Greek Olives & Feta', 'Kalamata olives with feta cheese and herbs', 6.95, '{D}', '{V}', false, 2, 120);
        
        -- All Day Menu - Main Dishes  
        INSERT INTO public.menu_items (category_id, name, description, price, allergens, dietary_info, is_popular, preparation_time, calories, spice_level) VALUES
        (all_day_mains_uuid, 'Moussaka', 'Traditional layered dish with aubergine, minced lamb and béchamel', 16.95, '{D, G, E}', '{}', true, 25, 450, 1),
        (all_day_mains_uuid, 'Pastitsio', 'Greek pasta bake with minced beef and cheese sauce', 15.95, '{D, G, E}', '{}', false, 20, 420, 1),
        (all_day_mains_uuid, 'Vegetarian Moussaka', 'Traditional moussaka made with lentils and vegetables', 14.95, '{D, G, E}', '{V}', true, 25, 380, 1),
        (all_day_mains_uuid, 'Kleftiko', 'Slow-cooked lamb shoulder with herbs and lemon potatoes', 18.95, '{}', '{}', true, 35, 520, 2),
        (all_day_mains_uuid, 'Gemista', 'Stuffed tomatoes and peppers with rice and herbs', 13.95, '{}', '{V, VG}', false, 20, 290, 1);
        
        -- All Day Menu - Grills & Souvlaki
        INSERT INTO public.menu_items (category_id, name, description, price, allergens, dietary_info, is_popular, preparation_time, calories, spice_level) VALUES
        (all_day_grills_uuid, 'Chicken Souvlaki', 'Grilled chicken skewers with tzatziki and warm pita', 14.95, '{D, G}', '{}', true, 15, 380, 1),
        (all_day_grills_uuid, 'Pork Souvlaki', 'Traditional pork skewers marinated in herbs and lemon', 15.95, '{D, G}', '{}', true, 15, 420, 1),
        (all_day_grills_uuid, 'Lamb Chops', 'Grilled lamb chops with Greek seasoning', 22.95, '{}', '{}', false, 18, 480, 2),
        (all_day_grills_uuid, 'Sea Bass', 'Whole grilled sea bass with lemon and olive oil', 19.95, '{F}', '{}', true, 20, 320, 0),
        (all_day_grills_uuid, 'Vegetarian Souvlaki', 'Grilled vegetable skewers with halloumi', 12.95, '{D, G}', '{V}', false, 12, 280, 1);
        
        -- All Day Menu - Desserts
        INSERT INTO public.menu_items (category_id, name, description, price, allergens, dietary_info, is_popular, preparation_time, calories) VALUES
        (all_day_desserts_uuid, 'Baklava', 'Traditional honey and nut pastry with pistachios', 6.95, '{G, N, E}', '{}', true, 5, 320),
        (all_day_desserts_uuid, 'Greek Yogurt with Honey', 'Thick Greek yogurt drizzled with thyme honey', 5.95, '{D}', '{V}', true, 2, 180),
        (all_day_desserts_uuid, 'Loukoumades', 'Honey puffs with cinnamon and crushed walnuts', 7.95, '{G, N, E}', '{}', false, 8, 280),
        (all_day_desserts_uuid, 'Galaktoboureko', 'Custard pastry with syrup and cinnamon', 6.95, '{D, G, E}', '{}', false, 5, 290);
        
        -- Lunch Menu - Light Bites
        INSERT INTO public.menu_items (category_id, name, description, price, allergens, dietary_info, is_popular, preparation_time, calories) VALUES
        (lunch_light_uuid, 'Greek Village Salad', 'Tomatoes, cucumber, olives, feta with olive oil dressing', 9.95, '{D}', '{V}', true, 5, 220),
        (lunch_light_uuid, 'Chicken Gyros Wrap', 'Chicken gyros in warm pita with tzatziki and salad', 8.95, '{D, G}', '{}', true, 8, 350),
        (lunch_light_uuid, 'Halloumi Salad', 'Grilled halloumi with mixed leaves and pomegranate', 10.95, '{D}', '{V}', false, 8, 280),
        (lunch_light_uuid, 'Mezze Platter', 'Selection of dips with warm pita and olives', 12.95, '{F, G, S, N}', '{}', true, 10, 380);
        
        -- Lunch Menu - Lunch Mains
        INSERT INTO public.menu_items (category_id, name, description, price, allergens, dietary_info, is_popular, preparation_time, calories) VALUES
        (lunch_mains_uuid, 'Chicken Souvlaki Lunch', 'Single chicken skewer with rice and salad', 11.95, '{D}', '{}', true, 12, 320),
        (lunch_mains_uuid, 'Fish of the Day', 'Grilled fresh fish with lemon potatoes', 14.95, '{F}', '{}', false, 18, 290),
        (lunch_mains_uuid, 'Vegetarian Wrap', 'Grilled vegetables and hummus in warm pita', 9.95, '{G, S}', '{V, VG}', false, 8, 280);
        
        -- Kids Menu - Kids Mains
        INSERT INTO public.menu_items (category_id, name, description, price, allergens, dietary_info, is_popular, preparation_time, calories) VALUES
        (kids_mains_uuid, 'Mini Chicken Souvlaki', 'Small chicken skewer with rice', 7.95, '{}', '{}', true, 10, 220),
        (kids_mains_uuid, 'Kids Pasta', 'Simple pasta with tomato sauce and cheese', 6.95, '{G, D}', '{}', true, 8, 250),
        (kids_mains_uuid, 'Mini Fish & Chips', 'Small portion of fish with Greek-style chips', 8.95, '{F, G}', '{}', false, 12, 280),
        (kids_mains_uuid, 'Chicken Nuggets', 'Homemade chicken nuggets with chips', 7.95, '{G, E}', '{}', true, 10, 320);
        
        -- Kids Menu - Kids Sides
        INSERT INTO public.menu_items (category_id, name, description, price, allergens, dietary_info, is_popular, preparation_time, calories) VALUES
        (kids_sides_uuid, 'Greek Chips', 'Crispy chips with oregano and sea salt', 3.95, '{}', '{V, VG}', true, 8, 180),
        (kids_sides_uuid, 'Mini Greek Salad', 'Child-sized portion of Greek salad', 4.95, '{D}', '{V}', false, 3, 100),
        (kids_sides_uuid, 'Pita Bread', 'Warm pita bread perfect for dipping', 2.95, '{G}', '{V, VG}', true, 3, 120);
        
        -- Drinks Menu - Hot Drinks
        INSERT INTO public.menu_items (category_id, name, description, price, allergens, dietary_info, is_popular, preparation_time, calories) VALUES
        (drinks_hot_uuid, 'Greek Coffee', 'Traditional strong coffee served in small cup', 3.95, '{}', '{V, VG}', true, 5, 5),
        (drinks_hot_uuid, 'Mountain Tea', 'Traditional Greek herbal tea from Mount Olympus', 3.50, '{}', '{V, VG}', false, 3, 0),
        (drinks_hot_uuid, 'Chamomile Tea', 'Soothing chamomile tea with honey', 3.50, '{}', '{V}', false, 3, 15),
        (drinks_hot_uuid, 'Cappuccino', 'Italian-style coffee with steamed milk', 4.50, '{D}', '{V}', true, 5, 80);
        
        -- Drinks Menu - Cold Drinks
        INSERT INTO public.menu_items (category_id, name, description, price, allergens, dietary_info, is_popular, preparation_time, calories) VALUES
        (drinks_cold_uuid, 'Fresh Orange Juice', 'Freshly squeezed orange juice', 4.95, '{}', '{V, VG}', true, 3, 110),
        (drinks_cold_uuid, 'Greek Lemonade', 'Traditional lemonade with fresh mint', 3.95, '{}', '{V, VG}', true, 5, 95),
        (drinks_cold_uuid, 'Coca Cola', 'Classic Coca Cola', 2.95, '{}', '{V, VG}', true, 1, 140),
        (drinks_cold_uuid, 'Sparkling Water', 'Greek natural sparkling water', 2.50, '{}', '{V, VG}', false, 1, 0),
        (drinks_cold_uuid, 'Iced Coffee', 'Greek-style iced coffee with milk foam', 4.95, '{D}', '{V}', false, 8, 120);
        
        -- Drinks Menu - Alcoholic Beverages
        INSERT INTO public.menu_items (category_id, name, description, price, allergens, dietary_info, is_popular, preparation_time, calories) VALUES
        (drinks_alcoholic_uuid, 'Ouzo', 'Traditional Greek anise-flavored spirit', 5.95, '{}', '{V, VG}', true, 2, 80),
        (drinks_alcoholic_uuid, 'Greek Red Wine', 'House red wine from Nemea region', 6.95, '{SO}', '{V, VG}', true, 2, 125),
        (drinks_alcoholic_uuid, 'Greek White Wine', 'Crisp Assyrtiko from Santorini', 7.95, '{SO}', '{V, VG}', false, 2, 120),
        (drinks_alcoholic_uuid, 'Mythos Beer', 'Greek lager beer', 4.95, '{G}', '{V, VG}', true, 2, 140),
        (drinks_alcoholic_uuid, 'Greek Rosé', 'Light and fruity rosé wine', 7.50, '{SO}', '{V, VG}', false, 2, 115);
        
    END LOOP;
END $$;