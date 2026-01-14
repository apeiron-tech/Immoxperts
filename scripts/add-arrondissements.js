/**
 * Add arrondissements for Paris, Lyon, and Marseille
 *
 * The official API doesn't include arrondissements, so we add them manually
 * with their specific coordinates.
 *
 * Usage: node scripts/add-arrondissements.js
 */

const fs = require('fs');
const path = require('path');

const CITIES_FILE = path.join(__dirname, '../src/main/webapp/app/data/french-cities.json');

// Paris arrondissements (20) with accurate coordinates
const parisArrondissements = [
  { name: 'Paris 1er Arrondissement', postcode: '75001', department: 'Paris', lat: 48.8631, lon: 2.3364, type: 'arrondissement' },
  { name: 'Paris 2e Arrondissement', postcode: '75002', department: 'Paris', lat: 48.8679, lon: 2.341, type: 'arrondissement' },
  { name: 'Paris 3e Arrondissement', postcode: '75003', department: 'Paris', lat: 48.863, lon: 2.3633, type: 'arrondissement' },
  { name: 'Paris 4e Arrondissement', postcode: '75004', department: 'Paris', lat: 48.8546, lon: 2.359, type: 'arrondissement' },
  { name: 'Paris 5e Arrondissement', postcode: '75005', department: 'Paris', lat: 48.8445, lon: 2.3444, type: 'arrondissement' },
  { name: 'Paris 6e Arrondissement', postcode: '75006', department: 'Paris', lat: 48.8509, lon: 2.3306, type: 'arrondissement' },
  { name: 'Paris 7e Arrondissement', postcode: '75007', department: 'Paris', lat: 48.8562, lon: 2.316, type: 'arrondissement' },
  { name: 'Paris 8e Arrondissement', postcode: '75008', department: 'Paris', lat: 48.8738, lon: 2.3111, type: 'arrondissement' },
  { name: 'Paris 9e Arrondissement', postcode: '75009', department: 'Paris', lat: 48.8768, lon: 2.3389, type: 'arrondissement' },
  { name: 'Paris 10e Arrondissement', postcode: '75010', department: 'Paris', lat: 48.876, lon: 2.3602, type: 'arrondissement' },
  { name: 'Paris 11e Arrondissement', postcode: '75011', department: 'Paris', lat: 48.8594, lon: 2.3808, type: 'arrondissement' },
  { name: 'Paris 12e Arrondissement', postcode: '75012', department: 'Paris', lat: 48.8412, lon: 2.388, type: 'arrondissement' },
  { name: 'Paris 13e Arrondissement', postcode: '75013', department: 'Paris', lat: 48.8322, lon: 2.3561, type: 'arrondissement' },
  { name: 'Paris 14e Arrondissement', postcode: '75014', department: 'Paris', lat: 48.8333, lon: 2.3272, type: 'arrondissement' },
  { name: 'Paris 15e Arrondissement', postcode: '75015', department: 'Paris', lat: 48.8401, lon: 2.2975, type: 'arrondissement' },
  { name: 'Paris 16e Arrondissement', postcode: '75016', department: 'Paris', lat: 48.8636, lon: 2.2686, type: 'arrondissement' },
  { name: 'Paris 17e Arrondissement', postcode: '75017', department: 'Paris', lat: 48.8873, lon: 2.3147, type: 'arrondissement' },
  { name: 'Paris 18e Arrondissement', postcode: '75018', department: 'Paris', lat: 48.8927, lon: 2.3445, type: 'arrondissement' },
  { name: 'Paris 19e Arrondissement', postcode: '75019', department: 'Paris', lat: 48.8866, lon: 2.3843, type: 'arrondissement' },
  { name: 'Paris 20e Arrondissement', postcode: '75020', department: 'Paris', lat: 48.8647, lon: 2.3989, type: 'arrondissement' },
];

// Lyon arrondissements (9) with accurate coordinates
const lyonArrondissements = [
  { name: 'Lyon 1er Arrondissement', postcode: '69001', department: 'Rhône', lat: 45.7679, lon: 4.8345, type: 'arrondissement' },
  { name: 'Lyon 2e Arrondissement', postcode: '69002', department: 'Rhône', lat: 45.7492, lon: 4.8262, type: 'arrondissement' },
  { name: 'Lyon 3e Arrondissement', postcode: '69003', department: 'Rhône', lat: 45.7533, lon: 4.8562, type: 'arrondissement' },
  { name: 'Lyon 4e Arrondissement', postcode: '69004', department: 'Rhône', lat: 45.7786, lon: 4.8267, type: 'arrondissement' },
  { name: 'Lyon 5e Arrondissement', postcode: '69005', department: 'Rhône', lat: 45.7558, lon: 4.8022, type: 'arrondissement' },
  { name: 'Lyon 6e Arrondissement', postcode: '69006', department: 'Rhône', lat: 45.7728, lon: 4.8508, type: 'arrondissement' },
  { name: 'Lyon 7e Arrondissement', postcode: '69007', department: 'Rhône', lat: 45.7346, lon: 4.8317, type: 'arrondissement' },
  { name: 'Lyon 8e Arrondissement', postcode: '69008', department: 'Rhône', lat: 45.7342, lon: 4.8668, type: 'arrondissement' },
  { name: 'Lyon 9e Arrondissement', postcode: '69009', department: 'Rhône', lat: 45.7817, lon: 4.8048, type: 'arrondissement' },
];

// Marseille arrondissements (16) with accurate coordinates
const marseilleArrondissements = [
  {
    name: 'Marseille 1er Arrondissement',
    postcode: '13001',
    department: 'Bouches-du-Rhône',
    lat: 43.2978,
    lon: 5.3817,
    type: 'arrondissement',
  },
  {
    name: 'Marseille 2e Arrondissement',
    postcode: '13002',
    department: 'Bouches-du-Rhône',
    lat: 43.313,
    lon: 5.3662,
    type: 'arrondissement',
  },
  {
    name: 'Marseille 3e Arrondissement',
    postcode: '13003',
    department: 'Bouches-du-Rhône',
    lat: 43.3089,
    lon: 5.3789,
    type: 'arrondissement',
  },
  {
    name: 'Marseille 4e Arrondissement',
    postcode: '13004',
    department: 'Bouches-du-Rhône',
    lat: 43.3055,
    lon: 5.3989,
    type: 'arrondissement',
  },
  {
    name: 'Marseille 5e Arrondissement',
    postcode: '13005',
    department: 'Bouches-du-Rhône',
    lat: 43.2928,
    lon: 5.3978,
    type: 'arrondissement',
  },
  {
    name: 'Marseille 6e Arrondissement',
    postcode: '13006',
    department: 'Bouches-du-Rhône',
    lat: 43.2876,
    lon: 5.3789,
    type: 'arrondissement',
  },
  {
    name: 'Marseille 7e Arrondissement',
    postcode: '13007',
    department: 'Bouches-du-Rhône',
    lat: 43.2821,
    lon: 5.3589,
    type: 'arrondissement',
  },
  {
    name: 'Marseille 8e Arrondissement',
    postcode: '13008',
    department: 'Bouches-du-Rhône',
    lat: 43.2508,
    lon: 5.381,
    type: 'arrondissement',
  },
  {
    name: 'Marseille 9e Arrondissement',
    postcode: '13009',
    department: 'Bouches-du-Rhône',
    lat: 43.2508,
    lon: 5.4178,
    type: 'arrondissement',
  },
  {
    name: 'Marseille 10e Arrondissement',
    postcode: '13010',
    department: 'Bouches-du-Rhône',
    lat: 43.2756,
    lon: 5.4189,
    type: 'arrondissement',
  },
  {
    name: 'Marseille 11e Arrondissement',
    postcode: '13011',
    department: 'Bouches-du-Rhône',
    lat: 43.2878,
    lon: 5.4589,
    type: 'arrondissement',
  },
  {
    name: 'Marseille 12e Arrondissement',
    postcode: '13012',
    department: 'Bouches-du-Rhône',
    lat: 43.3045,
    lon: 5.4367,
    type: 'arrondissement',
  },
  {
    name: 'Marseille 13e Arrondissement',
    postcode: '13013',
    department: 'Bouches-du-Rhône',
    lat: 43.3345,
    lon: 5.4223,
    type: 'arrondissement',
  },
  {
    name: 'Marseille 14e Arrondissement',
    postcode: '13014',
    department: 'Bouches-du-Rhône',
    lat: 43.3389,
    lon: 5.3789,
    type: 'arrondissement',
  },
  {
    name: 'Marseille 15e Arrondissement',
    postcode: '13015',
    department: 'Bouches-du-Rhône',
    lat: 43.3556,
    lon: 5.36,
    type: 'arrondissement',
  },
  {
    name: 'Marseille 16e Arrondissement',
    postcode: '13016',
    department: 'Bouches-du-Rhône',
    lat: 43.3567,
    lon: 5.3278,
    type: 'arrondissement',
  },
];

/**
 * Main function
 */
async function main() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║  ADDING ARRONDISSEMENTS                                   ║');
  console.log('║  Paris (20), Lyon (9), Marseille (16)                    ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  if (!fs.existsSync(CITIES_FILE)) {
    console.error(`❌ Error: File not found: ${CITIES_FILE}`);
    process.exit(1);
  }

  console.log(`📖 Reading cities from: ${CITIES_FILE}`);

  // Read cities
  const cities = JSON.parse(fs.readFileSync(CITIES_FILE, 'utf8'));
  console.log(`Found ${cities.length} cities\n`);

  // Remove existing arrondissements (if any)
  const citiesWithoutArrondissements = cities.filter(city => !city.name.includes('Arrondissement'));

  const removedCount = cities.length - citiesWithoutArrondissements.length;
  if (removedCount > 0) {
    console.log(`🗑️  Removed ${removedCount} existing arrondissements`);
  }

  // Add all arrondissements
  const allArrondissements = [...parisArrondissements, ...lyonArrondissements, ...marseilleArrondissements];

  console.log(`\n➕ Adding ${allArrondissements.length} arrondissements:`);
  console.log(`   - Paris: ${parisArrondissements.length} arrondissements`);
  console.log(`   - Lyon: ${lyonArrondissements.length} arrondissements`);
  console.log(`   - Marseille: ${marseilleArrondissements.length} arrondissements`);

  // Merge
  const allCities = [...citiesWithoutArrondissements, ...allArrondissements];

  // Sort by name
  allCities.sort((a, b) => {
    const nameCompare = a.name.localeCompare(b.name);
    if (nameCompare !== 0) return nameCompare;
    return a.postcode.localeCompare(b.postcode);
  });

  // Save
  console.log(`\n💾 Saving to ${CITIES_FILE}...`);
  fs.writeFileSync(CITIES_FILE, JSON.stringify(allCities, null, 2), 'utf8');

  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║  ✅ ALL DONE!                                             ║');
  console.log(`║  Total cities: ${allCities.length.toString().padEnd(46)} ║`);
  console.log(`║  Including ${allArrondissements.length} arrondissements${' '.repeat(32)}║`);
  console.log('║  File updated: french-cities.json                         ║');
  console.log('╚════════════════════════════════════════════════════════════╝');

  // Show some examples
  console.log('\n📋 Examples:');
  const exampleArrondissements = [
    allCities.find(c => c.name === 'Paris 13e Arrondissement'),
    allCities.find(c => c.name === 'Lyon 3e Arrondissement'),
    allCities.find(c => c.name === 'Marseille 14e Arrondissement'),
  ].filter(Boolean);

  exampleArrondissements.forEach(city => {
    console.log(`   ${city.name} (${city.postcode}) - ${city.department}`);
    console.log(`   → lat: ${city.lat}, lon: ${city.lon}`);
  });
}

// Run the script
if (require.main === module) {
  main().catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
}

module.exports = { parisArrondissements, lyonArrondissements, marseilleArrondissements };
