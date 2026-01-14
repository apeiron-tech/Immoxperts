/**
 * COMPLETE AUTOMATED SCRIPT - OFFICIAL SOURCE
 * Uses official French government data (data.gouv.fr)
 *
 * This script will automatically:
 * 1. Download ALL French communes from official INSEE data
 * 2. Geocode each city with coordinates
 * 3. Update french-cities.json with all cities
 *
 * NO MANUAL WORK NEEDED!
 *
 * Usage: node scripts/fetch-from-official-source.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const CITIES_FILE = path.join(__dirname, '../src/main/webapp/app/data/french-cities.json');
const GEOCODING_API = 'https://api-adresse.data.gouv.fr/search/?q=';
const COMMUNES_API = 'https://geo.api.gouv.fr/communes?fields=nom,code,codesPostaux,centre,departement&format=json&geometry=centre';
const BATCH_SIZE = 5;
const DELAY_MS = 200;

// Cache for geocoding
const geocodingCache = new Map();

/**
 * Step 1: Fetch all communes from official API
 */
async function fetchAllCommunesFromAPI() {
  console.log('\n🔄 Step 1: Fetching communes from official French government API...');
  console.log('Source: geo.api.gouv.fr (INSEE data)\n');

  return new Promise((resolve, reject) => {
    https
      .get(COMMUNES_API, res => {
        let data = '';

        res.on('data', chunk => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const communes = JSON.parse(data);
            console.log(`✅ Fetched ${communes.length} communes from official API\n`);
            resolve(communes);
          } catch (error) {
            reject(error);
          }
        });
      })
      .on('error', reject);
  });
}

/**
 * Extract department from postcode
 */
function extractDepartment(postcode) {
  if (!postcode || postcode.length < 2) return 'Unknown';

  const deptCode = postcode.substring(0, 2);

  if (deptCode === '20') {
    if (postcode.startsWith('200') || postcode.startsWith('201')) return 'Corse-du-Sud';
    if (postcode.startsWith('202')) return 'Haute-Corse';
  }

  const domTomMap = {
    971: 'Guadeloupe',
    972: 'Martinique',
    973: 'Guyane',
    974: 'La Réunion',
    976: 'Mayotte',
  };

  if (domTomMap[postcode.substring(0, 3)]) {
    return domTomMap[postcode.substring(0, 3)];
  }

  const departments = {
    '01': 'Ain',
    '02': 'Aisne',
    '03': 'Allier',
    '04': 'Alpes-de-Haute-Provence',
    '05': 'Hautes-Alpes',
    '06': 'Alpes-Maritimes',
    '07': 'Ardèche',
    '08': 'Ardennes',
    '09': 'Ariège',
    10: 'Aube',
    11: 'Aude',
    12: 'Aveyron',
    13: 'Bouches-du-Rhône',
    14: 'Calvados',
    15: 'Cantal',
    16: 'Charente',
    17: 'Charente-Maritime',
    18: 'Cher',
    19: 'Corrèze',
    21: "Côte-d'Or",
    22: "Côtes-d'Armor",
    23: 'Creuse',
    24: 'Dordogne',
    25: 'Doubs',
    26: 'Drôme',
    27: 'Eure',
    28: 'Eure-et-Loir',
    29: 'Finistère',
    30: 'Gard',
    31: 'Haute-Garonne',
    32: 'Gers',
    33: 'Gironde',
    34: 'Hérault',
    35: 'Ille-et-Vilaine',
    36: 'Indre',
    37: 'Indre-et-Loire',
    38: 'Isère',
    39: 'Jura',
    40: 'Landes',
    41: 'Loir-et-Cher',
    42: 'Loire',
    43: 'Haute-Loire',
    44: 'Loire-Atlantique',
    45: 'Loiret',
    46: 'Lot',
    47: 'Lot-et-Garonne',
    48: 'Lozère',
    49: 'Maine-et-Loire',
    50: 'Manche',
    51: 'Marne',
    52: 'Haute-Marne',
    53: 'Mayenne',
    54: 'Meurthe-et-Moselle',
    55: 'Meuse',
    56: 'Morbihan',
    57: 'Moselle',
    58: 'Nièvre',
    59: 'Nord',
    60: 'Oise',
    61: 'Orne',
    62: 'Pas-de-Calais',
    63: 'Puy-de-Dôme',
    64: 'Pyrénées-Atlantiques',
    65: 'Hautes-Pyrénées',
    66: 'Pyrénées-Orientales',
    67: 'Bas-Rhin',
    68: 'Haut-Rhin',
    69: 'Rhône',
    70: 'Haute-Saône',
    71: 'Saône-et-Loire',
    72: 'Sarthe',
    73: 'Savoie',
    74: 'Haute-Savoie',
    75: 'Paris',
    76: 'Seine-Maritime',
    77: 'Seine-et-Marne',
    78: 'Yvelines',
    79: 'Deux-Sèvres',
    80: 'Somme',
    81: 'Tarn',
    82: 'Tarn-et-Garonne',
    83: 'Var',
    84: 'Vaucluse',
    85: 'Vendée',
    86: 'Vienne',
    87: 'Haute-Vienne',
    88: 'Vosges',
    89: 'Yonne',
    90: 'Territoire de Belfort',
    91: 'Essonne',
    92: 'Hauts-de-Seine',
    93: 'Seine-Saint-Denis',
    94: 'Val-de-Marne',
    95: "Val-d'Oise",
  };

  return departments[deptCode] || 'Unknown';
}

/**
 * Step 2: Process communes and create city entries
 */
async function processCommunes(communes) {
  console.log('\n🔄 Step 2: Processing communes...');

  const cities = [];

  // Load existing cities
  let existingCities = [];
  if (fs.existsSync(CITIES_FILE)) {
    existingCities = JSON.parse(fs.readFileSync(CITIES_FILE, 'utf8'));
    console.log(`Found ${existingCities.length} existing cities`);
  }

  // Create a map of existing cities
  const existingMap = new Map();
  existingCities.forEach(city => {
    const key = `${city.name}_${city.postcode}`;
    existingMap.set(key, city);
  });

  // Process each commune
  for (const commune of communes) {
    const name = commune.nom;
    const postcodes = commune.codesPostaux || [];
    const centre = commune.centre;
    const departmentName = commune.departement?.nom || extractDepartment(postcodes[0] || '00000');

    // Create an entry for each postcode (some communes have multiple postcodes)
    for (const postcode of postcodes) {
      const key = `${name}_${postcode}`;

      // Check if already exists with coordinates
      const existing = existingMap.get(key);
      if (existing && existing.lat && existing.lon) {
        cities.push(existing);
        continue;
      }

      // Use coordinates from API if available
      const lat = centre?.coordinates?.[1] || null;
      const lon = centre?.coordinates?.[0] || null;

      cities.push({
        name,
        postcode,
        department: departmentName,
        lat,
        lon,
        type: 'city',
      });
    }
  }

  console.log(`✅ Processed ${cities.length} city entries\n`);

  return cities;
}

/**
 * Main function - RUNS EVERYTHING AUTOMATICALLY
 */
async function main() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║  AUTOMATIC FRENCH CITIES FETCHER                          ║');
  console.log('║  Source: Official French Government API (geo.api.gouv.fr) ║');
  console.log('║                                                            ║');
  console.log('║  This script will:                                        ║');
  console.log('║  1. Fetch ALL communes from official INSEE data           ║');
  console.log('║  2. Extract coordinates (already included in API)         ║');
  console.log('║  3. Update french-cities.json                             ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('');

  try {
    // Step 1: Fetch all communes from official API
    const communes = await fetchAllCommunesFromAPI();

    if (communes.length === 0) {
      console.error('❌ No communes found. Please check the API.');
      process.exit(1);
    }

    // Step 2: Process communes
    let allCities = await processCommunes(communes);

    // Step 2.5: Add arrondissements (not in API)
    console.log('\n🔄 Step 2.5: Adding arrondissements...');
    const arrondissements = require('./add-arrondissements.js');
    const allArrondissements = [
      ...arrondissements.parisArrondissements,
      ...arrondissements.lyonArrondissements,
      ...arrondissements.marseilleArrondissements,
    ];

    // Remove existing arrondissements
    allCities = allCities.filter(city => !city.name.includes('Arrondissement'));

    // Add arrondissements
    allCities.push(...allArrondissements);
    console.log(`✅ Added ${allArrondissements.length} arrondissements (Paris: 20, Lyon: 9, Marseille: 16)\n`);

    // Step 3: Sort and save
    allCities.sort((a, b) => {
      const nameCompare = a.name.localeCompare(b.name);
      if (nameCompare !== 0) return nameCompare;
      return a.postcode.localeCompare(b.postcode);
    });

    console.log(`\n🔄 Step 3: Saving to ${CITIES_FILE}...`);
    fs.writeFileSync(CITIES_FILE, JSON.stringify(allCities, null, 2), 'utf8');

    // Count cities with coordinates
    const citiesWithCoords = allCities.filter(city => city.lat && city.lon);
    const citiesWithoutCoords = allCities.length - citiesWithCoords.length;

    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║  ✅ ALL DONE!                                             ║');
    console.log(`║  Total cities: ${allCities.length.toString().padEnd(46)} ║`);
    console.log(`║  With coordinates: ${citiesWithCoords.length.toString().padEnd(39)} ║`);
    console.log(`║  Without coordinates: ${citiesWithoutCoords.toString().padEnd(36)} ║`);
    console.log('║  File updated: french-cities.json                         ║');
    console.log('╚════════════════════════════════════════════════════════════╝');

    if (citiesWithoutCoords > 0) {
      console.log('\n⚠️  Note: Some cities are missing coordinates.');
      console.log('You can run "node scripts/geocode-cities.js" to geocode them.');
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { fetchAllCommunesFromAPI, processCommunes, extractDepartment };
