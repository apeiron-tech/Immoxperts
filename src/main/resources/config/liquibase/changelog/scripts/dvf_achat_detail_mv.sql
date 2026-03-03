-- Script 1 : Vue matérialisée des caractéristiques Achat (dvf_achat)
-- Une ligne par publication (id) avec colonnes parsées depuis details.
-- Exécuter dans le schéma où existent dvf_achat / dvf_louer (ex: dvf_plus_2025_2).

DROP MATERIALIZED VIEW IF EXISTS dvf_plus_2025_2.dvf_achat_detail_mv CASCADE;

CREATE MATERIALIZED VIEW dvf_plus_2025_2.dvf_achat_detail_mv AS
SELECT
    a.id AS publication_id,
    COALESCE(
        (SELECT NULLIF(REPLACE(TRIM((regexp_matches(COALESCE(a.details, ''), 'Surface\s+(?:totale|habitable)?\s*:\s*(\d+(?:[.,]\d+)?)', 'i'))[1]), ',', '.'), '')::NUMERIC),
        (SELECT NULLIF(REPLACE(TRIM((regexp_matches(COALESCE(a.details, ''), 'Surface\s+(\d+(?:[.,]\d+)?)\s*m[²2]', 'i'))[1]), ',', '.'), '')::NUMERIC),
        (SELECT NULLIF(REPLACE(TRIM((regexp_matches(COALESCE(a.details, ''), 'Surface\s*:\s*(\d+(?:[.,]\d+)?)', 'i'))[1]), ',', '.'), '')::NUMERIC),
        (SELECT NULLIF(REPLACE(TRIM((regexp_matches(COALESCE(a.details, ''), '(\d+(?:[.,]\d+)?)\s*m[²2]\s*de\s+surface', 'i'))[1]), ',', '.'), '')::NUMERIC),
        (SELECT NULLIF(REPLACE(TRIM((regexp_matches(COALESCE(a.details, ''), '(\d+(?:[.,]\d+)?)\s*m2\s*environ', 'i'))[1]), ',', '.'), '')::NUMERIC),
        (SELECT NULLIF(REPLACE(TRIM((regexp_matches(COALESCE(a.details, ''), '(\d+(?:[.,]\d+)?)\s*m[²2]', 'i'))[1]), ',', '.'), '')::NUMERIC)
    ) AS surface,
    COALESCE(
        (SELECT (regexp_matches(COALESCE(a.details, ''), 'Chambres?\s*:\s*(\d+)', 'i'))[1]::INTEGER),
        (SELECT (regexp_matches(COALESCE(a.details, ''), '(\d+)\s*ch\.', 'i'))[1]::INTEGER),
        (SELECT (regexp_matches(COALESCE(a.details, ''), '(\d+)\s*chambres?', 'i'))[1]::INTEGER)
    ) AS chambre,
    COALESCE(
        (SELECT (regexp_matches(COALESCE(a.details, ''), 'Pi[eè]ces?\s*:\s*(\d+)', 'i'))[1]::INTEGER),
        (SELECT (regexp_matches(COALESCE(a.details, ''), '(\d+)\s*pi[eè]ces?', 'i'))[1]::INTEGER),
        (SELECT (regexp_matches(COALESCE(a.details, ''), '\bT(\d+)\b', 'i'))[1]::INTEGER),
        (SELECT (regexp_matches(COALESCE(a.details, ''), '\bF(\d+)\b', 'i'))[1]::INTEGER)
    ) AS pieces,
    (SELECT UPPER(TRIM((regexp_matches(COALESCE(a.details, ''), 'DPE\s*[:\s]*([A-Ga-g])', 'i'))[1]))::VARCHAR(1)) AS dpe,
    COALESCE(
        (SELECT NULLIF(REPLACE(TRIM((regexp_matches(COALESCE(a.details, ''), 'Surface\s+terrain\s*:\s*(\d+(?:[.,]\d+)?)', 'i'))[1]), ',', '.'), '')::NUMERIC),
        (SELECT NULLIF(REPLACE(TRIM((regexp_matches(COALESCE(a.details, ''), 'Terrain\s+(\d+(?:[.,]\d+)?)\s*m[²2]', 'i'))[1]), ',', '.'), '')::NUMERIC),
        (SELECT NULLIF(REPLACE(TRIM((regexp_matches(COALESCE(a.details, ''), 'Terrain\s*:\s*(\d+(?:[.,]\d+)?)', 'i'))[1]), ',', '.'), '')::NUMERIC)
    ) AS terrain_sqm,
    CASE WHEN COALESCE(a.details, '') ~* 'piscine' THEN 'Oui' ELSE 'Non' END AS piscine,
    CASE WHEN COALESCE(a.details, '') ~* 'meubl[eé]' AND COALESCE(a.details, '') !~* 'non\s+meubl' THEN 'Oui' ELSE 'Non' END AS meuble,
    CASE WHEN COALESCE(a.details, '') ~* 'balcon' THEN 'Oui' ELSE 'Non' END AS balcon,
    CASE WHEN COALESCE(a.details, '') ~* 'cave' THEN 'Oui' ELSE 'Non' END AS cave,
    CASE WHEN COALESCE(a.details, '') ~* 'jardin' THEN 'Oui' ELSE 'Non' END AS jardin,
    CASE WHEN COALESCE(a.details, '') ~* 'parking|garage|stationnement' THEN 'Oui' ELSE 'Non' END AS parking,
    COALESCE(
        (SELECT TRIM((regexp_matches(COALESCE(a.details, ''), '[EÉ]tage\s*:\s*([^|~\n\-]+)', 'i'))[1])::VARCHAR(50)),
        (SELECT (regexp_matches(COALESCE(a.details, ''), '[EÉ]tage\s+(\d+/\d+)', 'i'))[1]::VARCHAR(50)),
        (SELECT TRIM((regexp_matches(COALESCE(a.details, ''), '(\d+(?:er|e|ème|eme)\s*[eé]tage)', 'i'))[1])::VARCHAR(50)),
        (SELECT CASE WHEN COALESCE(a.details, '') ~* 'rez[-\s]*de[-\s]*chauss[eé]e|\bRDC\b' THEN 'RDC' END::VARCHAR(50))
    ) AS etage,
    CASE WHEN COALESCE(a.details, '') ~* 'terrasse' THEN 'Oui' ELSE 'Non' END AS terrasse
FROM dvf_plus_2025_2.dvf_achat a;

CREATE UNIQUE INDEX ON dvf_plus_2025_2.dvf_achat_detail_mv (publication_id);

-- Rafraîchir après mise à jour des données :
-- REFRESH MATERIALIZED VIEW CONCURRENTLY dvf_plus_2025_2.dvf_achat_detail_mv;
