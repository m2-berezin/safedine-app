-- Clear existing dining tables
DELETE FROM dining_tables;

-- Create tables 1-35 for each restaurant
INSERT INTO dining_tables (restaurant_id, code)
SELECT 
    r.id as restaurant_id,
    generate_series(1, 35)::text as code
FROM restaurants r;