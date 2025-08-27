-- Remove tables that shouldn't exist (8, 9, 11-19)
DELETE FROM public.dining_tables 
WHERE code IN ('8', '9', '11', '12', '13', '14', '15', '16', '17', '18', '19');

-- Verify we have the correct tables: 1-7, 10, 20-35
-- This query should show the expected table codes for verification
-- Expected: 1, 2, 3, 4, 5, 6, 7, 10, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35