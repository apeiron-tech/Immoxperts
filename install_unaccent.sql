-- Install PostgreSQL unaccent extension for accent-insensitive searches
-- Execute this SQL script in your PostgreSQL database

CREATE EXTENSION IF NOT EXISTS unaccent;

-- Test the extension
SELECT unaccent('Résidence LAETITIA');
-- Should return: "Residence LAETITIA"

