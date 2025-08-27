-- Clear existing data
DELETE FROM restaurants;
DELETE FROM locations;

-- Insert the 12 new locations
INSERT INTO locations (name, city, region) VALUES
('Bournemouth', 'Bournemouth', 'Dorset'),
('Bristol', 'Bristol', 'South West England'),
('Covent Garden', 'London', 'Greater London'),
('Edinburgh', 'Edinburgh', 'Scotland'),
('Glasgow', 'Glasgow', 'Scotland'),
('Liverpool', 'Liverpool', 'North West England'),
('Manchester', 'Manchester', 'North West England'),
('Norwich', 'Norwich', 'East of England'),
('Soho', 'London', 'Greater London'),
('Southampton', 'Southampton', 'South Coast England'),
('Tower Bridge', 'London', 'Greater London'),
('Windsor', 'Windsor', 'South East England');

-- Insert restaurants for each location
-- Bournemouth
INSERT INTO restaurants (location_id, name, address) 
SELECT id, 'The Real Greek', 'Unit 12, BH2 Centre, Bournemouth BH1 2BU'
FROM locations WHERE name = 'Bournemouth';

INSERT INTO restaurants (location_id, name, address) 
SELECT id, 'Franco Manca', '45 Old Christchurch Road, Bournemouth BH1 1EH'
FROM locations WHERE name = 'Bournemouth';

-- Bristol
INSERT INTO restaurants (location_id, name, address) 
SELECT id, 'The Real Greek', 'Cabot Circus, Glass House, Bristol BS1 3BX'
FROM locations WHERE name = 'Bristol';

INSERT INTO restaurants (location_id, name, address) 
SELECT id, 'Franco Manca', '24 Park Street, Bristol BS1 5JA'
FROM locations WHERE name = 'Bristol';

-- Covent Garden
INSERT INTO restaurants (location_id, name, address) 
SELECT id, 'The Real Greek', '15 St Martins Court, London WC2N 4AJ'
FROM locations WHERE name = 'Covent Garden';

INSERT INTO restaurants (location_id, name, address) 
SELECT id, 'Franco Manca', '39 Market Row, London WC2E 8RF'
FROM locations WHERE name = 'Covent Garden';

-- Edinburgh
INSERT INTO restaurants (location_id, name, address) 
SELECT id, 'The Real Greek', '103 George Street, Edinburgh EH2 3ES'
FROM locations WHERE name = 'Edinburgh';

INSERT INTO restaurants (location_id, name, address) 
SELECT id, 'Franco Manca', '22 Market Street, Edinburgh EH1 1DF'
FROM locations WHERE name = 'Edinburgh';

-- Glasgow
INSERT INTO restaurants (location_id, name, address) 
SELECT id, 'The Real Greek', '185 Buchanan Street, Glasgow G1 2JZ'
FROM locations WHERE name = 'Glasgow';

INSERT INTO restaurants (location_id, name, address) 
SELECT id, 'Franco Manca', '34 Gordon Street, Glasgow G1 3PU'
FROM locations WHERE name = 'Glasgow';

-- Liverpool
INSERT INTO restaurants (location_id, name, address) 
SELECT id, 'The Real Greek', 'Liverpool ONE, 14 Paradise Street, Liverpool L1 8JF'
FROM locations WHERE name = 'Liverpool';

INSERT INTO restaurants (location_id, name, address) 
SELECT id, 'Franco Manca', '67 Bold Street, Liverpool L1 4EZ'
FROM locations WHERE name = 'Liverpool';

-- Manchester
INSERT INTO restaurants (location_id, name, address) 
SELECT id, 'The Real Greek', 'The Printworks, 27 Withy Grove, Manchester M4 2BS'
FROM locations WHERE name = 'Manchester';

INSERT INTO restaurants (location_id, name, address) 
SELECT id, 'Franco Manca', '54 King Street, Manchester M2 4LY'
FROM locations WHERE name = 'Manchester';

-- Norwich
INSERT INTO restaurants (location_id, name, address) 
SELECT id, 'The Real Greek', '12 Exchange Street, Norwich NR2 1DP'
FROM locations WHERE name = 'Norwich';

INSERT INTO restaurants (location_id, name, address) 
SELECT id, 'Franco Manca', '18 Gentleman Walk, Norwich NR2 1NA'
FROM locations WHERE name = 'Norwich';

-- Soho
INSERT INTO restaurants (location_id, name, address) 
SELECT id, 'The Real Greek', '50-60 Paddington Street, London W1U 4HY'
FROM locations WHERE name = 'Soho';

INSERT INTO restaurants (location_id, name, address) 
SELECT id, 'Franco Manca', '26 Market Place, London W1W 8AN'
FROM locations WHERE name = 'Soho';

-- Southampton
INSERT INTO restaurants (location_id, name, address) 
SELECT id, 'The Real Greek', 'West Quay Shopping Centre, Southampton SO15 1QE'
FROM locations WHERE name = 'Southampton';

INSERT INTO restaurants (location_id, name, address) 
SELECT id, 'Franco Manca', '45 High Street, Southampton SO14 2NS'
FROM locations WHERE name = 'Southampton';

-- Tower Bridge
INSERT INTO restaurants (location_id, name, address) 
SELECT id, 'The Real Greek', 'Hay''s Galleria, London SE1 2HD'
FROM locations WHERE name = 'Tower Bridge';

INSERT INTO restaurants (location_id, name, address) 
SELECT id, 'Franco Manca', '124 Bermondsey Street, London SE1 3TX'
FROM locations WHERE name = 'Tower Bridge';

-- Windsor
INSERT INTO restaurants (location_id, name, address) 
SELECT id, 'The Real Greek', '12 High Street, Windsor SL4 1LJ'
FROM locations WHERE name = 'Windsor';

INSERT INTO restaurants (location_id, name, address) 
SELECT id, 'Franco Manca', '8 Church Lane, Windsor SL4 1PA'
FROM locations WHERE name = 'Windsor';