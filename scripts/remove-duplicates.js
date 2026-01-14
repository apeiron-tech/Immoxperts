/**
 * Remove duplicate cities from french-cities.json
 * Keeps only one entry per city name (prefers main postcode ending in 000)
 *
 * Usage: node scripts/remove-duplicates.js
 */

const fs = require('fs');
const path = require('path');

const CITIES_FILE = path.join(__dirname, '../src/main/webapp/app/data/french-cities.json');

/**
 * Main function
 */
async function main() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║  REMOVING DUPLICATE CITIES                               ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  if (!fs.existsSync(CITIES_FILE)) {
    console.error(`❌ Error: File not found: ${CITIES_FILE}`);
    process.exit(1);
  }

  console.log(`📖 Reading cities from: ${CITIES_FILE}`);

  // Read cities
  const cities = JSON.parse(fs.readFileSync(CITIES_FILE, 'utf8'));
  console.log(`Found ${cities.length} cities\n`);

  // Group by name (case-insensitive, normalized)
  const normalizeName = name => name.toLowerCase().trim();

  const cityGroups = new Map();

  cities.forEach(city => {
    const normalizedName = normalizeName(city.name);

    if (!cityGroups.has(normalizedName)) {
      cityGroups.set(normalizedName, []);
    }

    cityGroups.get(normalizedName).push(city);
  });

  // Find duplicates
  const duplicates = [];
  cityGroups.forEach((group, name) => {
    if (group.length > 1) {
      duplicates.push({ name, cities: group });
    }
  });

  console.log(`🔍 Found ${duplicates.length} cities with duplicates\n`);

  if (duplicates.length === 0) {
    console.log('✅ No duplicates found!');
    return;
  }

  // Show some examples
  console.log('📋 Examples of duplicates:');
  duplicates.slice(0, 5).forEach(({ name, cities: group }) => {
    console.log(`   ${name}: ${group.length} entries`);
    group.forEach(city => {
      console.log(`      - ${city.name} (${city.postcode}) - ${city.type}`);
    });
  });
  console.log('');

  // Strategy: Keep one entry per city name
  // Priority:
  // 1. Main postcode (ends with 000) for cities/departments
  // 2. First arrondissement if it's an arrondissement
  // 3. First entry by postcode (alphabetically)

  const deduplicated = [];
  const removed = [];

  cityGroups.forEach((group, normalizedName) => {
    if (group.length === 1) {
      // No duplicate, keep it
      deduplicated.push(group[0]);
      return;
    }

    // Has duplicates, choose the best one
    let best = null;
    let bestScore = -1;

    group.forEach(city => {
      let score = 0;

      // Priority 1: Main postcode (ends with 000)
      if (city.postcode && city.postcode.endsWith('000')) {
        score += 100;
      }

      // Priority 2: Type preference (department > city > arrondissement)
      if (city.type === 'department') {
        score += 50;
      } else if (city.type === 'city') {
        score += 30;
      } else if (city.type === 'arrondissement') {
        score += 10;
      }

      // Priority 3: Shorter postcode (prefer main codes)
      if (city.postcode && city.postcode.length === 5) {
        score += 5;
      }

      // Priority 4: Lower postcode number (prefer 01000 over 20000)
      if (city.postcode) {
        const postcodeNum = parseInt(city.postcode, 10);
        if (!isNaN(postcodeNum)) {
          score += (100000 - postcodeNum) / 10000; // Lower is better
        }
      }

      if (score > bestScore) {
        bestScore = score;
        best = city;
      }
    });

    if (best) {
      deduplicated.push(best);

      // Track removed duplicates
      group.forEach(city => {
        if (city !== best) {
          removed.push({
            name: city.name,
            postcode: city.postcode,
            kept: best.postcode,
          });
        }
      });
    }
  });

  // Sort by name, then postcode
  deduplicated.sort((a, b) => {
    const nameCompare = a.name.localeCompare(b.name);
    if (nameCompare !== 0) return nameCompare;
    return a.postcode.localeCompare(b.postcode);
  });

  console.log(`\n✅ Deduplication complete:`);
  console.log(`   Original: ${cities.length} entries`);
  console.log(`   After: ${deduplicated.length} entries`);
  console.log(`   Removed: ${removed.length} duplicates\n`);

  // Show some removed examples
  console.log('📋 Examples of removed duplicates:');
  const removedExamples = removed.slice(0, 10);
  removedExamples.forEach(removed => {
    console.log(`   ❌ ${removed.name} (${removed.postcode}) → Kept: ${removed.kept}`);
  });

  if (removed.length > 10) {
    console.log(`   ... and ${removed.length - 10} more`);
  }

  // Save
  console.log(`\n💾 Saving to ${CITIES_FILE}...`);
  fs.writeFileSync(CITIES_FILE, JSON.stringify(deduplicated, null, 2), 'utf8');

  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║  ✅ ALL DONE!                                             ║');
  console.log(`║  Total cities: ${deduplicated.length.toString().padEnd(46)} ║`);
  console.log(`║  Removed duplicates: ${removed.length.toString().padEnd(36)} ║`);
  console.log('║  File updated: french-cities.json                         ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
}

// Run the script
if (require.main === module) {
  main().catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
}

module.exports = { main };
