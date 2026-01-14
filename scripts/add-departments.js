/**
 * Add French departments to french-cities.json
 *
 * Usage: node scripts/add-departments.js
 */

const fs = require('fs');
const path = require('path');

const CITIES_FILE = path.join(__dirname, '../src/main/webapp/app/data/french-cities.json');

// French departments with their coordinates (center of department)
const departments = [
  { name: 'Ain', code: '01', postcode: '01000', lat: 46.2043, lon: 5.2266 },
  { name: 'Aisne', code: '02', postcode: '02000', lat: 49.4431, lon: 3.4117 },
  { name: 'Allier', code: '03', postcode: '03000', lat: 46.3448, lon: 3.4283 },
  { name: 'Alpes-de-Haute-Provence', code: '04', postcode: '04000', lat: 44.0925, lon: 6.2358 },
  { name: 'Hautes-Alpes', code: '05', postcode: '05000', lat: 44.6588, lon: 6.0825 },
  { name: 'Alpes-Maritimes', code: '06', postcode: '06000', lat: 43.7102, lon: 7.262 },
  { name: 'Ardèche', code: '07', postcode: '07000', lat: 44.7353, lon: 4.4314 },
  { name: 'Ardennes', code: '08', postcode: '08000', lat: 49.768, lon: 4.7197 },
  { name: 'Ariège', code: '09', postcode: '09000', lat: 43.0462, lon: 1.6072 },
  { name: 'Aube', code: '10', postcode: '10000', lat: 48.2973, lon: 4.0744 },
  { name: 'Aude', code: '11', postcode: '11000', lat: 43.2132, lon: 2.3517 },
  { name: 'Aveyron', code: '12', postcode: '12000', lat: 44.3494, lon: 2.5753 },
  { name: 'Bouches-du-Rhône', code: '13', postcode: '13000', lat: 43.5297, lon: 5.4474 },
  { name: 'Calvados', code: '14', postcode: '14000', lat: 49.1829, lon: -0.3707 },
  { name: 'Cantal', code: '15', postcode: '15000', lat: 45.0333, lon: 2.9333 },
  { name: 'Charente', code: '16', postcode: '16000', lat: 45.65, lon: 0.15 },
  { name: 'Charente-Maritime', code: '17', postcode: '17000', lat: 46.1603, lon: -1.1511 },
  { name: 'Cher', code: '18', postcode: '18000', lat: 47.0844, lon: 2.3964 },
  { name: 'Corrèze', code: '19', postcode: '19000', lat: 45.2667, lon: 1.7667 },
  { name: "Côte-d'Or", code: '21', postcode: '21000', lat: 47.322, lon: 5.0415 },
  { name: "Côtes-d'Armor", code: '22', postcode: '22000', lat: 48.4534, lon: -2.7684 },
  { name: 'Creuse', code: '23', postcode: '23000', lat: 46.1667, lon: 1.8667 },
  { name: 'Dordogne', code: '24', postcode: '24000', lat: 45.1833, lon: 0.7167 },
  { name: 'Doubs', code: '25', postcode: '25000', lat: 47.238, lon: 6.0243 },
  { name: 'Drôme', code: '26', postcode: '26000', lat: 44.9334, lon: 4.8924 },
  { name: 'Eure', code: '27', postcode: '27000', lat: 49.0232, lon: 1.1508 },
  { name: 'Eure-et-Loir', code: '28', postcode: '28000', lat: 48.4439, lon: 1.4881 },
  { name: 'Finistère', code: '29', postcode: '29000', lat: 48.3905, lon: -4.4861 },
  { name: 'Gard', code: '30', postcode: '30000', lat: 43.8367, lon: 4.3601 },
  { name: 'Haute-Garonne', code: '31', postcode: '31000', lat: 43.6047, lon: 1.4442 },
  { name: 'Gers', code: '32', postcode: '32000', lat: 43.6458, lon: 0.5876 },
  { name: 'Gironde', code: '33', postcode: '33000', lat: 44.8378, lon: -0.5792 },
  { name: 'Hérault', code: '34', postcode: '34000', lat: 43.6108, lon: 3.8767 },
  { name: 'Ille-et-Vilaine', code: '35', postcode: '35000', lat: 48.1173, lon: -1.6778 },
  { name: 'Indre', code: '36', postcode: '36000', lat: 46.8167, lon: 1.6833 },
  { name: 'Indre-et-Loire', code: '37', postcode: '37000', lat: 47.3941, lon: 0.6848 },
  { name: 'Isère', code: '38', postcode: '38000', lat: 45.1885, lon: 5.7245 },
  { name: 'Jura', code: '39', postcode: '39000', lat: 46.6756, lon: 5.5547 },
  { name: 'Landes', code: '40', postcode: '40000', lat: 43.8933, lon: -0.5031 },
  { name: 'Loir-et-Cher', code: '41', postcode: '41000', lat: 47.5922, lon: 1.3361 },
  { name: 'Loire', code: '42', postcode: '42000', lat: 45.4397, lon: 4.3872 },
  { name: 'Haute-Loire', code: '43', postcode: '43000', lat: 45.0431, lon: 3.8853 },
  { name: 'Loire-Atlantique', code: '44', postcode: '44000', lat: 47.2184, lon: -1.5536 },
  { name: 'Loiret', code: '45', postcode: '45000', lat: 47.9029, lon: 1.9093 },
  { name: 'Lot', code: '46', postcode: '46000', lat: 44.4475, lon: 1.4406 },
  { name: 'Lot-et-Garonne', code: '47', postcode: '47000', lat: 44.2017, lon: 0.6169 },
  { name: 'Lozère', code: '48', postcode: '48000', lat: 44.5167, lon: 3.5 },
  { name: 'Maine-et-Loire', code: '49', postcode: '49000', lat: 47.4784, lon: -0.5632 },
  { name: 'Manche', code: '50', postcode: '50000', lat: 49.1194, lon: -1.0903 },
  { name: 'Marne', code: '51', postcode: '51000', lat: 49.2583, lon: 4.0317 },
  { name: 'Haute-Marne', code: '52', postcode: '52000', lat: 48.1111, lon: 5.1417 },
  { name: 'Mayenne', code: '53', postcode: '53000', lat: 48.0667, lon: -0.7667 },
  { name: 'Meurthe-et-Moselle', code: '54', postcode: '54000', lat: 48.6921, lon: 6.1844 },
  { name: 'Meuse', code: '55', postcode: '55000', lat: 49.1586, lon: 5.3847 },
  { name: 'Morbihan', code: '56', postcode: '56000', lat: 47.7474, lon: -2.7603 },
  { name: 'Moselle', code: '57', postcode: '57000', lat: 49.1193, lon: 6.1757 },
  { name: 'Nièvre', code: '58', postcode: '58000', lat: 46.99, lon: 3.16 },
  { name: 'Nord', code: '59', postcode: '59000', lat: 50.6292, lon: 3.0573 },
  { name: 'Oise', code: '60', postcode: '60000', lat: 49.4333, lon: 2.0833 },
  { name: 'Orne', code: '61', postcode: '61000', lat: 48.4333, lon: 0.0833 },
  { name: 'Pas-de-Calais', code: '62', postcode: '62000', lat: 50.9513, lon: 1.8587 },
  { name: 'Puy-de-Dôme', code: '63', postcode: '63000', lat: 45.7772, lon: 3.087 },
  { name: 'Pyrénées-Atlantiques', code: '64', postcode: '64000', lat: 43.2951, lon: -0.3708 },
  { name: 'Hautes-Pyrénées', code: '65', postcode: '65000', lat: 43.2333, lon: 0.0833 },
  { name: 'Pyrénées-Orientales', code: '66', postcode: '66000', lat: 42.6886, lon: 2.8948 },
  { name: 'Bas-Rhin', code: '67', postcode: '67000', lat: 48.5734, lon: 7.7521 },
  { name: 'Haut-Rhin', code: '68', postcode: '68000', lat: 48.0793, lon: 7.358 },
  { name: 'Rhône', code: '69', postcode: '69000', lat: 45.764, lon: 4.8357 },
  { name: 'Haute-Saône', code: '70', postcode: '70000', lat: 47.6333, lon: 6.15 },
  { name: 'Saône-et-Loire', code: '71', postcode: '71000', lat: 46.3067, lon: 4.8283 },
  { name: 'Sarthe', code: '72', postcode: '72000', lat: 48.0077, lon: 0.1984 },
  { name: 'Savoie', code: '73', postcode: '73000', lat: 45.5646, lon: 5.9178 },
  { name: 'Haute-Savoie', code: '74', postcode: '74000', lat: 45.8992, lon: 6.1294 },
  { name: 'Paris', code: '75', postcode: '75000', lat: 48.8566, lon: 2.3522 },
  { name: 'Seine-Maritime', code: '76', postcode: '76000', lat: 49.4432, lon: 1.0993 },
  { name: 'Seine-et-Marne', code: '77', postcode: '77000', lat: 48.4084, lon: 2.7017 },
  { name: 'Yvelines', code: '78', postcode: '78000', lat: 48.8049, lon: 2.1204 },
  { name: 'Deux-Sèvres', code: '79', postcode: '79000', lat: 46.3231, lon: -0.4647 },
  { name: 'Somme', code: '80', postcode: '80000', lat: 49.8941, lon: 2.2958 },
  { name: 'Tarn', code: '81', postcode: '81000', lat: 43.6, lon: 2.1333 },
  { name: 'Tarn-et-Garonne', code: '82', postcode: '82000', lat: 44.1, lon: 1.35 },
  { name: 'Var', code: '83', postcode: '83000', lat: 43.1242, lon: 5.928 },
  { name: 'Vaucluse', code: '84', postcode: '84000', lat: 43.9493, lon: 4.8055 },
  { name: 'Vendée', code: '85', postcode: '85000', lat: 46.67, lon: -1.43 },
  { name: 'Vienne', code: '86', postcode: '86000', lat: 46.5802, lon: 0.3404 },
  { name: 'Haute-Vienne', code: '87', postcode: '87000', lat: 45.8336, lon: 1.2611 },
  { name: 'Vosges', code: '88', postcode: '88000', lat: 48.1728, lon: 6.4514 },
  { name: 'Yonne', code: '89', postcode: '89000', lat: 47.7986, lon: 3.5667 },
  { name: 'Territoire de Belfort', code: '90', postcode: '90000', lat: 47.6376, lon: 6.8628 },
  { name: 'Essonne', code: '91', postcode: '91000', lat: 48.5284, lon: 2.2667 },
  { name: 'Hauts-de-Seine', code: '92', postcode: '92000', lat: 48.8925, lon: 2.2069 },
  { name: 'Seine-Saint-Denis', code: '93', postcode: '93000', lat: 48.9362, lon: 2.3574 },
  { name: 'Val-de-Marne', code: '94', postcode: '94000', lat: 48.7903, lon: 2.4555 },
  { name: "Val-d'Oise", code: '95', postcode: '95000', lat: 49.0944, lon: 2.0778 },
  // DOM-TOM
  { name: 'Guadeloupe', code: '971', postcode: '97100', lat: 16.265, lon: -61.551 },
  { name: 'Martinique', code: '972', postcode: '97200', lat: 14.6415, lon: -61.0242 },
  { name: 'Guyane', code: '973', postcode: '97300', lat: 4.9224, lon: -52.3135 },
  { name: 'La Réunion', code: '974', postcode: '97400', lat: -21.1151, lon: 55.5364 },
  { name: 'Mayotte', code: '976', postcode: '97600', lat: -12.8275, lon: 45.1662 },
  // Corse
  { name: 'Corse-du-Sud', code: '2A', postcode: '20000', lat: 41.9267, lon: 8.7369 },
  { name: 'Haute-Corse', code: '2B', postcode: '20200', lat: 42.6976, lon: 9.45 },
];

/**
 * Main function
 */
async function main() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║  ADDING FRENCH DEPARTMENTS                                ║');
  console.log('║  101 departments (96 métropole + 5 DOM + 2 Corse)       ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  if (!fs.existsSync(CITIES_FILE)) {
    console.error(`❌ Error: File not found: ${CITIES_FILE}`);
    process.exit(1);
  }

  console.log(`📖 Reading cities from: ${CITIES_FILE}`);

  // Read cities
  const cities = JSON.parse(fs.readFileSync(CITIES_FILE, 'utf8'));
  console.log(`Found ${cities.length} cities\n`);

  // Check which departments are missing
  const existingDepartments = new Set();
  cities.forEach(city => {
    if (city.type === 'department') {
      existingDepartments.add(city.name);
    }
  });

  const missingDepartments = departments.filter(dept => !existingDepartments.has(dept.name));

  if (missingDepartments.length === 0) {
    console.log('✅ All departments already exist!');
    return;
  }

  console.log(`➕ Adding ${missingDepartments.length} departments...`);

  // Convert departments to city format
  const departmentEntries = missingDepartments.map(dept => ({
    name: dept.name,
    postcode: dept.postcode,
    department: dept.name, // Department is itself
    lat: dept.lat,
    lon: dept.lon,
    type: 'department',
  }));

  // Add departments
  cities.push(...departmentEntries);

  // Sort by name
  cities.sort((a, b) => {
    const nameCompare = a.name.localeCompare(b.name);
    if (nameCompare !== 0) return nameCompare;
    return a.postcode.localeCompare(b.postcode);
  });

  // Save
  console.log(`\n💾 Saving to ${CITIES_FILE}...`);
  fs.writeFileSync(CITIES_FILE, JSON.stringify(cities, null, 2), 'utf8');

  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║  ✅ ALL DONE!                                             ║');
  console.log(`║  Total cities: ${cities.length.toString().padEnd(46)} ║`);
  console.log(`║  Including ${departments.length} departments${' '.repeat(33)}║`);
  console.log('║  File updated: french-cities.json                         ║');
  console.log('╚════════════════════════════════════════════════════════════╝');

  // Show some examples
  console.log('\n📋 Examples:');
  const examples = ['Bouches-du-Rhône', 'Isère', 'Nord', 'Paris'];
  examples.forEach(deptName => {
    const dept = cities.find(c => c.name === deptName && c.type === 'department');
    if (dept) {
      console.log(`   ✅ ${dept.name} (${dept.postcode}) - lat: ${dept.lat}, lon: ${dept.lon}`);
    }
  });
}

// Run the script
if (require.main === module) {
  main().catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
}

module.exports = { departments };
