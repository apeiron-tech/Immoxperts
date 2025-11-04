-- DROP the existing materialized view
DROP MATERIALIZED VIEW IF EXISTS dvf.adresse_complete_geom_mv CASCADE;

-- CREATE the new materialized view with accent-free column for better search
CREATE MATERIALIZED VIEW dvf.adresse_complete_geom_mv AS
WITH ranked_mutations AS (
    SELECT mutation_addresses_details_mv.idadresse,
           mutation_addresses_details_mv.idpar,
           mutation_addresses_details_mv.datemut,
           row_number() OVER (PARTITION BY mutation_addresses_details_mv.idadresse ORDER BY mutation_addresses_details_mv.datemut DESC) AS rn
    FROM dvf.mutation_addresses_details_mv
),
     full_address_data AS (
         SELECT
             a.idadresse,
             concat_ws(' '::text,
                       NULLIF(TRIM(BOTH FROM a.novoie::text), ''::text),
                       NULLIF(TRIM(BOTH FROM a.btq::text), ''::text),
                       CASE a.typvoie
                           WHEN 'FG' THEN 'Faubourg'
                           WHEN 'N' THEN 'Nord'
                           WHEN 'ESC' THEN 'Escalier'
                           WHEN 'VTE' THEN 'Voie Terrestre'
                           WHEN 'MTE' THEN 'Montée'
                           WHEN 'PL' THEN 'Place'
                           WHEN 'IMP' THEN 'Impasse'
                           WHEN 'CAMP' THEN 'Camp'
                           WHEN 'VC' THEN 'Voie Communale'
                           WHEN 'CLOS' THEN 'Clos'
                           WHEN 'CTRE' THEN 'Centre'
                           WHEN 'SEN' THEN 'Sente'
                           WHEN 'RUE' THEN 'Rue'
                           WHEN 'ESP' THEN 'Esplanade'
                           WHEN 'ENC' THEN 'Enclave'
                           WHEN 'ROC' THEN 'Rocade'
                           WHEN 'PTR' THEN 'Poterne'
                           WHEN 'DOM' THEN 'Domaine'
                           WHEN 'SQ' THEN 'Square'
                           WHEN 'PRT' THEN 'Port'
                           WHEN 'CRS' THEN 'Cours'
                           WHEN 'GAL' THEN 'Galerie'
                           WHEN 'PLE' THEN 'Place'
                           WHEN 'BD' THEN 'Boulevard'
                           WHEN 'ZI' THEN 'Zone Industrielle'
                           WHEN 'RTE' THEN 'Route'
                           WHEN 'PROM' THEN 'Promenade'
                           WHEN 'QUAI' THEN 'Quai'
                           WHEN 'RES' THEN 'Résidence'
                           WHEN 'PAS' THEN 'Passage'
                           WHEN 'HAM' THEN 'Hameau'
                           WHEN 'MAIS' THEN 'Maison'
                           WHEN 'CD' THEN 'Chemin Départemental'
                           WHEN 'TRA' THEN 'Traverse'
                           WHEN 'PARC' THEN 'Parc'
                           WHEN 'RAC' THEN 'Raccordement'
                           WHEN 'DSC' THEN 'Descente'
                           WHEN 'LOT' THEN 'Lotissement'
                           WHEN 'RPE' THEN 'Ruelle'
                           WHEN 'CHEM' THEN 'Chemin'
                           WHEN 'HAB' THEN 'Habitation'
                           WHEN 'QUA' THEN 'Quartier'
                           WHEN 'CHV' THEN 'Chevauchant'
                           WHEN 'ALL' THEN 'Allée'
                           WHEN 'COUR' THEN 'Cour'
                           WHEN 'PTTE' THEN 'Petite'
                           WHEN 'TSSE' THEN 'Tasse'
                           WHEN 'ZAC' THEN 'Zone d''Aménagement Concerté'
                           WHEN 'CHE' THEN 'Chemin'
                           WHEN 'ZA' THEN 'Zone d''Activité'
                           WHEN 'VGE' THEN 'Village'
                           WHEN 'RLE' THEN 'Ruelle'
                           WHEN 'CC' THEN 'Centre Commercial'
                           WHEN 'CITE' THEN 'Cité'
                           WHEN 'VOIE' THEN 'Voie'
                           WHEN 'CR' THEN 'Chemin Rural'
                           WHEN 'GR' THEN 'Grande Randonnée'
                           WHEN 'NTE' THEN 'Montée'
                           WHEN 'VIA' THEN 'Viaduc'
                           WHEN 'AV' THEN 'Avenue'
                           ELSE a.typvoie
                           END,
                       NULLIF(TRIM(BOTH FROM a.voie::text), ''::text),
                       NULLIF(TRIM(BOTH FROM a.codepostal::text), ''::text),
                       NULLIF(TRIM(BOTH FROM a.commune::text), ''::text)
             ) AS adresse_complete,
             COALESCE(a.novoie::text, ''::text) AS numero,
             COALESCE(a.voie::text, ''::text) AS nom_voie,
             COALESCE(
                     CASE a.typvoie
                         WHEN 'FG' THEN 'Faubourg'
                         WHEN 'N' THEN 'Nord'
                         WHEN 'ESC' THEN 'Escalier'
                         WHEN 'VTE' THEN 'Voie Terrestre'
                         WHEN 'MTE' THEN 'Montée'
                         WHEN 'PL' THEN 'Place'
                         WHEN 'IMP' THEN 'Impasse'
                         WHEN 'CAMP' THEN 'Camp'
                         WHEN 'VC' THEN 'Voie Communale'
                         WHEN 'CLOS' THEN 'Clos'
                         WHEN 'CTRE' THEN 'Centre'
                         WHEN 'SEN' THEN 'Sente'
                         WHEN 'RUE' THEN 'Rue'
                         WHEN 'ESP' THEN 'Esplanade'
                         WHEN 'ENC' THEN 'Enclave'
                         WHEN 'ROC' THEN 'Rocade'
                         WHEN 'PTR' THEN 'Poterne'
                         WHEN 'DOM' THEN 'Domaine'
                         WHEN 'SQ' THEN 'Square'
                         WHEN 'PRT' THEN 'Port'
                         WHEN 'CRS' THEN 'Cours'
                         WHEN 'GAL' THEN 'Galerie'
                         WHEN 'PLE' THEN 'Place'
                         WHEN 'BD' THEN 'Boulevard'
                         WHEN 'ZI' THEN 'Zone Industrielle'
                         WHEN 'RTE' THEN 'Route'
                         WHEN 'PROM' THEN 'Promenade'
                         WHEN 'QUAI' THEN 'Quai'
                         WHEN 'RES' THEN 'Résidence'
                         WHEN 'PAS' THEN 'Passage'
                         WHEN 'HAM' THEN 'Hameau'
                         WHEN 'MAIS' THEN 'Maison'
                         WHEN 'CD' THEN 'Chemin Départemental'
                         WHEN 'TRA' THEN 'Traverse'
                         WHEN 'PARC' THEN 'Parc'
                         WHEN 'RAC' THEN 'Raccordement'
                         WHEN 'DSC' THEN 'Descente'
                         WHEN 'LOT' THEN 'Lotissement'
                         WHEN 'RPE' THEN 'Ruelle'
                         WHEN 'CHEM' THEN 'Chemin'
                         WHEN 'HAB' THEN 'Habitation'
                         WHEN 'QUA' THEN 'Quartier'
                         WHEN 'CHV' THEN 'Chevauchant'
                         WHEN 'ALL' THEN 'Allée'
                         WHEN 'COUR' THEN 'Cour'
                         WHEN 'PTTE' THEN 'Petite'
                         WHEN 'TSSE' THEN 'Tasse'
                         WHEN 'ZAC' THEN 'Zone d''Aménagement Concerté'
                         WHEN 'CHE' THEN 'Chemin'
                         WHEN 'ZA' THEN 'Zone d''Activité'
                         WHEN 'VGE' THEN 'Village'
                         WHEN 'RLE' THEN 'Ruelle'
                         WHEN 'CC' THEN 'Centre Commercial'
                         WHEN 'CITE' THEN 'Cité'
                         WHEN 'VOIE' THEN 'Voie'
                         WHEN 'CR' THEN 'Chemin Rural'
                         WHEN 'GR' THEN 'Grande Randonnée'
                         WHEN 'NTE' THEN 'Montée'
                         WHEN 'VIA' THEN 'Viaduc'
                         WHEN 'AV' THEN 'Avenue'
                         ELSE a.typvoie
                         END, ''
             ) AS type_voie,
             COALESCE(a.codepostal::text, ''::text) AS codepostal,
             COALESCE(a.commune::text, ''::text) AS commune,
             rm.idpar,
             st_y(p.point_geom) AS latitude,
             st_x(p.point_geom) AS longitude,
             p.point_geom
         FROM dvf.adresse a
                  JOIN ranked_mutations rm ON rm.idadresse = a.idadresse AND rm.rn = 1
                  JOIN dvf.parcelles_complete_geojson_mv p ON p.idparcelle::text = rm.idpar::text
         WHERE p.point_geom IS NOT NULL
           AND a.commune IS NOT NULL
           AND a.voie IS NOT NULL
     )
SELECT
    idadresse,
    adresse_complete,
    -- Add searchable column WITHOUT accents (manually convert French accents)
    TRANSLATE(
            UPPER(adresse_complete),
            'ÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ',
            'AAAAAAaaaaaaOOOOOOooooooEEEEeeeeCcIIIIiiiiUUUUuuuuyNn'
    ) AS adresse_complete_search,
    numero,
    nom_voie,
    type_voie,
    codepostal,
    commune,
    idpar,
    latitude,
    longitude,
    point_geom
FROM full_address_data;

ALTER MATERIALIZED VIEW dvf.adresse_complete_geom_mv OWNER TO postgres;

-- Index on the searchable column (no accents)
CREATE INDEX idx_adresse_complete_search_trgm ON dvf.adresse_complete_geom_mv USING gin (adresse_complete_search gin_trgm_ops);

-- Keep existing indexes for display columns
CREATE INDEX idx_adresse_complete_trgm ON dvf.adresse_complete_geom_mv USING gin (adresse_complete gin_trgm_ops);
CREATE INDEX idx_nom_voie_trgm ON dvf.adresse_complete_geom_mv USING gin (nom_voie gin_trgm_ops);
CREATE INDEX idx_type_voie_trgm ON dvf.adresse_complete_geom_mv USING gin (type_voie gin_trgm_ops);
CREATE INDEX idx_numero_trgm ON dvf.adresse_complete_geom_mv USING gin (numero gin_trgm_ops);
CREATE INDEX idx_commune_trgm ON dvf.adresse_complete_geom_mv USING gin (commune gin_trgm_ops);
CREATE INDEX idx_adresse_complete_geom_sort ON dvf.adresse_complete_geom_mv (commune, nom_voie, numero);
CREATE INDEX idx_adresse_complete_geom_idadresse ON dvf.adresse_complete_geom_mv (idadresse);

-- Done!
SELECT 'Materialized view updated successfully! New column: adresse_complete_search (without accents)' AS status;

