import { db } from './firebase-admin';

export const TARGET_MODELS = [
  // Wheel Loaders
  { manufacturer: "CAT", model: "966F", category: "WHEEL LOADER" },
  { manufacturer: "CAT", model: "936F", category: "WHEEL LOADER" },
  { manufacturer: "CAT", model: "936E", category: "WHEEL LOADER" },
  { manufacturer: "CAT", model: "950E", category: "WHEEL LOADER" },
  { manufacturer: "CAT", model: "970F", category: "WHEEL LOADER" },
  { manufacturer: "CAT", model: "972G", category: "WHEEL LOADER" },
  { manufacturer: "CAT", model: "972H", category: "WHEEL LOADER" },
  { manufacturer: "CAT", model: "966H", category: "WHEEL LOADER" },
  { manufacturer: "CAT", model: "966E", category: "WHEEL LOADER" },
  { manufacturer: "CAT", model: "966D", category: "WHEEL LOADER" },
  // Motor Graders
  { manufacturer: "CAT", model: "14G", category: "MOTOR GRADER" },
  { manufacturer: "CAT", model: "14H", category: "MOTOR GRADER" },
  // Bulldozers
  { manufacturer: "CAT", model: "D9N", category: "BULLDOZER" },
  { manufacturer: "CAT", model: "D9R", category: "BULLDOZER" },
  { manufacturer: "CAT", model: "D10N", category: "BULLDOZER" },
  { manufacturer: "CAT", model: "D10R", category: "BULLDOZER" },
  // Wheel Excavators
  { manufacturer: "JOHN DEERE", model: "595D", category: "WHEEL EXCAVATOR" },
  { manufacturer: "VOLVO", model: "130", category: "WHEEL EXCAVATOR" },
  { manufacturer: "VOLVO", model: "140", category: "WHEEL EXCAVATOR" },
  { manufacturer: "VOLVO", model: "170", category: "WHEEL EXCAVATOR" },
  { manufacturer: "VOLVO", model: "180", category: "WHEEL EXCAVATOR" }
];

export const SOURCES = [
  { id: 'RITCHIE_BROS', name: 'Ritchie Bros. Auctioneers', domain: 'rbauction.com' },
  { id: 'IRONPLANET', name: 'IronPlanet', domain: 'ironplanet.com' },
  { id: 'RITCHIE_LIST', name: 'Ritchie List', domain: 'ritchielist.com' },
  { id: 'MASCUS', name: 'Mascus', domain: 'mascus.com' },
  { id: 'PUBLIC_SURPLUS', name: 'Public Surplus', domain: 'publicsurplus.com' },
  { id: 'GSA_AUCTIONS', name: 'GSA Auctions', domain: 'gsaauctions.gov' },
  { id: 'MACHINERY_TRADER', name: 'Machinery Trader', domain: 'machinerytrader.com' },
  { id: 'MACHINIO', name: 'Machinio', domain: 'machinio.com' },
  { id: 'EQUIPMENT_TRADER', name: 'Equipment Trader', domain: 'equipmenttrader.com' },
  { id: 'ROCK_AND_DIRT', name: 'Rock & Dirt', domain: 'rockanddirt.com' },
  { id: 'MY_LITTLE_SALESMAN', name: 'My Little Salesman', domain: 'mylittlesalesman.com' }
];

export async function seedTargetModels() {
  console.log("Seeding target models and sources...");
  const batch = db.batch();
  for (const m of TARGET_MODELS) {
    const id = `${m.manufacturer}-${m.model}`.replace(/\s+/g, '-').toUpperCase();
    const docRef = db.collection('target_models').doc(id);
    batch.set(docRef, {
      ...m,
      aliases: [],
      prohibitedVariants: [],
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, { merge: true });
  }
  
  for (const src of SOURCES) {
    const docRef = db.collection('sources').doc(src.id);
    batch.set(docRef, {
       ...src,
       status: 'active',
       createdAt: new Date()
    }, { merge: true });
  }
  
  await batch.commit();
  console.log("Seeding target models and sources complete.");
}

// Seed the Super Admin user
export async function seedSuperAdmin(uid: string, email: string) {
  await db.collection('users').doc(uid).set({
    email,
    role: 'SUPER_ADMIN',
    createdAt: new Date()
  }, { merge: true });
  console.log(`Seeded SUPER_ADMIN for ${email}`);
}
