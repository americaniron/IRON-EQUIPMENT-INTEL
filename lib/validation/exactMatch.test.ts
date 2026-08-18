import assert from 'assert';
import { validateExactMatch } from './exactMatch.ts';
import type { CandidateListing, ModelTarget } from './exactMatch.ts';

const target950E: ModelTarget = { manufacturer: "CAT", model: "950E", category: "WHEEL LOADER", aliases: ["CATERPILLAR"], prohibitedVariants: [] };
const targetD9N: ModelTarget = { manufacturer: "CAT", model: "D9N", category: "BULLDOZER", aliases: ["CATERPILLAR"], prohibitedVariants: [] };
const target595D: ModelTarget = { manufacturer: "JOHN DEERE", model: "595D", category: "WHEEL EXCAVATOR", aliases: [], prohibitedVariants: [] };
const target140: ModelTarget = { manufacturer: "VOLVO", model: "140", category: "WHEEL EXCAVATOR", aliases: [], prohibitedVariants: [] };

function runTests() {
  const t = (target: ModelTarget, title: string, structModel: string, expectedValid: boolean, expectedReason?: string, cCategory?: string) => {
    const candidate: CandidateListing = { title, description: "", manufacturer: target.manufacturer, model: structModel, category: cCategory || target.category };
    const res = validateExactMatch(candidate, target);
    assert.strictEqual(res.valid, expectedValid, `Failed for "${title}". Expected ${expectedValid}, got ${res.valid}. Reason: ${res.reason}`);
    if (expectedReason && !res.valid) {
       assert.strictEqual(res.reason, expectedReason, `Failed reason for "${title}". Expected ${expectedReason}, got ${res.reason}`);
    }
  };

  t(target950E, 'CAT 950E WHEEL LOADER', '950E', true);
  t(target950E, 'CATERPILLAR 950E WHEEL LOADER', '950E', true);
  t(target950E, 'CAT 950F WHEEL LOADER', '950F', false, 'REJECTED_WRONG_MODEL');
  t(target950E, 'CAT 0950E WHEEL LOADER', '0950E', false, 'REJECTED_WRONG_MODEL');
  t(target950E, 'CAT 950 WHEEL LOADER', '950', false, 'REJECTED_WRONG_MODEL');
  t(target950E, 'CAT 950E BUCKET', '', false, 'REJECTED_PART_OR_ATTACHMENT');
  t(target950E, 'BUCKET FITS CAT 950E', '', false, 'REJECTED_PART_OR_ATTACHMENT');
  t(target950E, 'CAT 950E TRANSMISSION', '', false, 'REJECTED_PART_OR_ATTACHMENT');
  t(target950E, 'CAT 950E OR 950F', '950E', false, 'REJECTED_AMBIGUOUS_MODEL');
  t(target950E, 'CAT 950 SERIES LOADER', '', false, 'REJECTED_WRONG_MODEL'); // "950" doesn't match exact "950E", and "SERIES" is a part keyword
  
  t({ manufacturer: "CAT", model: "966F", category: "WHEEL LOADER", aliases:[], prohibitedVariants:[] }, 'CAT 966F WHEEL LOADER', '966F', true);
  t({ manufacturer: "CAT", model: "966F", category: "WHEEL LOADER", aliases:[], prohibitedVariants:[] }, 'CAT 966G WHEEL LOADER', '966G', false, 'REJECTED_WRONG_MODEL');
  
  t(targetD9N, 'CAT D9N BULLDOZER', 'D9N', true);
  t(targetD9N, 'CAT D9R BULLDOZER', 'D9R', false, 'REJECTED_WRONG_MODEL');
  
  t(target595D, 'JOHN DEERE 595D WHEELED EXCAVATOR', '595D', true); // Struct category WHEEL EXCAVATOR validates this
  t(target595D, 'JOHN DEERE 595 WHEEL EXCAVATOR', '595', false, 'REJECTED_WRONG_MODEL');
  
  t(target140, 'VOLVO 140 WHEEL EXCAVATOR', '140', true);
  // Track excavator should reject by category
  t(target140, 'VOLVO 140 TRACK EXCAVATOR', '140', false, 'REJECTED_WRONG_CATEGORY', 'TRACK EXCAVATOR');
  
  console.log("All validation tests passed!");
}

runTests();
