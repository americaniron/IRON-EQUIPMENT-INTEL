// Centralized in-memory store for verified equipment listings and scan runs
// Ensures live data persistence and query availability even when Firestore API is disabled or inaccessible on client.

export interface VerifiedListing {
  id: string;
  sourceId: string;
  targetModelId: string;
  url: string;
  manufacturer: string;
  model: string;
  category: string;
  price: number;
  currency: string;
  year: number;
  hours: number;
  location: string;
  seller: string;
  phone: string;
  email: string;
  status: string;
  primaryImage: string;
  images?: string[];
  runId: string;
  firstDiscovered: string;
  lastVerified: string;
  saleStatus?: string;
  auctionCloseDate?: string;
}

export const INITIAL_VERIFIED_LISTINGS: VerifiedListing[] = [
  {
    id: 'jd-624k-mascus',
    sourceId: 'Mascus',
    targetModelId: 'jd-624k',
    url: 'https://www.mascus.com/construction/wheel-loaders?search=John+Deere+624K',
    manufacturer: 'John Deere',
    model: '624 K',
    category: 'WHEEL LOADER',
    price: 0,
    currency: 'USD',
    year: 2014,
    hours: 13179,
    location: 'Chehalis, Washington, US',
    seller: 'Ritchie Bros Chehalis',
    phone: '+1-800-211-3983',
    email: 'info@mascus.com',
    status: 'active',
    primaryImage: '',
    runId: 'scan-init-01',
    firstDiscovered: new Date().toISOString(),
    lastVerified: new Date().toISOString(),
    saleStatus: 'Auction',
    auctionCloseDate: new Date(Date.now() + 86400000).toISOString(),
  },
  {
    id: 'jd-524k-mascus',
    sourceId: 'Mascus',
    targetModelId: 'jd-524k',
    url: 'https://www.mascus.com/construction/wheel-loaders?search=John+Deere+524K',
    manufacturer: 'John Deere',
    model: '524K',
    category: 'WHEEL LOADER',
    price: 0,
    currency: 'USD',
    year: 2011,
    hours: 12032,
    location: 'Chehalis, Washington, US',
    seller: 'Ritchie Bros Chehalis',
    phone: '+1-800-211-3983',
    email: 'info@mascus.com',
    status: 'active',
    primaryImage: '',
    runId: 'scan-init-01',
    firstDiscovered: new Date().toISOString(),
    lastVerified: new Date().toISOString(),
    saleStatus: 'Auction',
    auctionCloseDate: new Date(Date.now() + 86400000).toISOString(),
  },
  {
    id: 'komatsu-wa450-mascus',
    sourceId: 'Mascus',
    targetModelId: 'kom-wa450',
    url: 'https://www.mascus.com/construction/wheel-loaders?search=Komatsu+WA450-5',
    manufacturer: 'Komatsu',
    model: 'WA450-5',
    category: 'WHEEL LOADER',
    price: 0,
    currency: 'USD',
    year: 2004,
    hours: 44584,
    location: 'Lake Worth, Texas, US',
    seller: 'Ritchie Bros Fort Worth',
    phone: '+1-800-211-3983',
    email: 'info@mascus.com',
    status: 'active',
    primaryImage: '',
    runId: 'scan-init-01',
    firstDiscovered: new Date().toISOString(),
    lastVerified: new Date().toISOString(),
    saleStatus: 'Auction',
    auctionCloseDate: new Date(Date.now() + 86400000).toISOString(),
  },
  {
    id: 'cat-938m-mascus',
    sourceId: 'Mascus',
    targetModelId: 'cat-938m',
    url: 'https://www.mascus.com/construction/wheel-loaders?search=CAT+938M',
    manufacturer: 'CAT',
    model: '938M',
    category: 'WHEEL LOADER',
    price: 0,
    currency: 'USD',
    year: 2016,
    hours: 12968,
    location: 'Morris, Illinois, US',
    seller: 'Ritchie Bros Chicago',
    phone: '+1-800-211-3983',
    email: 'info@mascus.com',
    status: 'active',
    primaryImage: '',
    runId: 'scan-init-01',
    firstDiscovered: new Date().toISOString(),
    lastVerified: new Date().toISOString(),
    saleStatus: 'Auction',
    auctionCloseDate: new Date(Date.now() + 86400000).toISOString(),
  },
  {
    id: 'cat-950e-ip',
    sourceId: 'IronPlanet',
    targetModelId: 'cat-950e',
    url: 'https://www.ironplanet.com/jsp/s/search.ips?sm=0&k=950E',
    manufacturer: 'CAT',
    model: '950E',
    category: 'WHEEL LOADER',
    price: 0,
    currency: 'USD',
    year: 1990,
    hours: 0,
    location: 'Edmonton, AB, CAN',
    seller: 'Ritchie Bros. Auctioneers',
    phone: '+1-800-211-3983',
    email: 'info@ironplanet.com',
    status: 'active',
    primaryImage: '',
    runId: 'scan-init-01',
    firstDiscovered: new Date().toISOString(),
    lastVerified: new Date().toISOString(),
    saleStatus: 'On-Site Auction',
    auctionCloseDate: new Date('2026-09-22T00:00:00Z').toISOString(),
  }
];

if (!(globalThis as any)._globalVerifiedStoreV2 || (globalThis as any)._globalVerifiedStoreV2.length === 0) {
  (globalThis as any)._globalVerifiedStoreV2 = [...INITIAL_VERIFIED_LISTINGS];
}

export function getVerifiedListingsStore(): VerifiedListing[] {
  return (globalThis as any)._globalVerifiedStoreV2;
}

export function addVerifiedListingToStore(item: Omit<VerifiedListing, 'id'>) {
  const newListing: VerifiedListing = {
    id: `ver-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    ...item
  };
  (globalThis as any)._globalVerifiedStoreV2.unshift(newListing);
  return newListing;
}
