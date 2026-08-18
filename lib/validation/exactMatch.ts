export interface ModelTarget {
  manufacturer: string;
  model: string;
  category: string;
  aliases: string[];
  prohibitedVariants: string[];
  status?: string;
}


export interface CandidateListing {
  title: string;
  description: string;
  manufacturer: string;
  model: string;
  category: string;
}

export type ValidationResult = {
  valid: boolean;
  reason?: string;
};

export function validateExactMatch(candidate: CandidateListing, target: ModelTarget): ValidationResult {
  const cTitle = candidate.title.toUpperCase();
  const cDesc = candidate.description.toUpperCase();
  const cModel = candidate.model.toUpperCase();
  const cMan = candidate.manufacturer.toUpperCase();

  // 1. Manufacturer check
  const validMan = [target.manufacturer.toUpperCase(), ...(target.aliases || []).map(a => a.toUpperCase())];
  const isManMatch = validMan.some(m => cTitle.includes(m) || cMan.includes(m) || cDesc.includes(m));
  
  if (!isManMatch) {
    return { valid: false, reason: 'REJECTED_WRONG_MANUFACTURER' };
  }

  // 2. Exact Model Check in Title or structured Model
  // It must have boundaries. A regex that checks for word boundaries or safe punctuation.
  // The model target.model could be '950E'
  // We need to ensure it's not matched within '0950E', '950EF', '950E/F' etc unless / means another machine.
  
  const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const targetModelRegex = new RegExp(`(^|[^a-zA-Z0-9])${escapeRegExp(target.model.toUpperCase())}([^a-zA-Z0-9]|$)`);
  
  const titleHasExactModel = targetModelRegex.test(cTitle);
  const structHasExactModel = targetModelRegex.test(cModel);
  const descHasExactModel = targetModelRegex.test(cDesc);

  if (!titleHasExactModel && !structHasExactModel && !descHasExactModel) {
    return { valid: false, reason: 'REJECTED_WRONG_MODEL' };
  }

  // 3. Reject Wrong Suffixes or Ambiguous Models in Title
  // Look for target model minus suffix (e.g. 950 for 950E) and see if another suffix is present.
  const baseModelMatch = target.model.match(/^([A-Z]*\d+)[A-Z]*$/i);
  if (baseModelMatch) {
    const baseModel = baseModelMatch[1].toUpperCase();
    const otherSuffixRegex = new RegExp(`(^|[^a-zA-Z0-9])${escapeRegExp(baseModel)}[A-DF-Z]([^a-zA-Z0-9]|$)`); // if E is target, look for A-D, F-Z. 
    // Actually, safer is to check if ANY model-like word starts with baseModel but isn't targetModel.
    const allTokens = cTitle.split(/[^a-zA-Z0-9]/).filter(Boolean);
    for (const token of allTokens) {
      if (token.startsWith(baseModel) && token !== target.model.toUpperCase()) {
        // Only reject if it's considered another model of the same family
        // E.g. '950F' when looking for '950E'
        if (/^[A-Z]*\d+[A-Z]*$/.test(token)) {
          return { valid: false, reason: 'REJECTED_AMBIGUOUS_MODEL' };
        }
      }
    }
  }

  // 4. Prohibited Variants Check
  for (const variant of target.prohibitedVariants || []) {
    if (cTitle.includes(variant.toUpperCase()) || cModel.includes(variant.toUpperCase())) {
      return { valid: false, reason: 'REJECTED_MODEL_SUFFIX_MISMATCH' };
    }
  }

  // 5. Parts and Attachments Exclusion
  // Only reject if the listing title indicates a part/component/attachment rather than a complete machine.
  // E.g. "CAT 950E BUCKET", "TRANSMISSION FOR CAT 950E", "BUCKET FITS CAT 950E"
  const partTitlePatterns = [
    /\b(BUCKET|TRANSMISSION|ENGINE|TIRE|TIRES|TRACK|TRACKS|MANUAL|CAB|BOOM|ARM|CYLINDER|PUMP|ATTACHMENT|ATTACHMENTS)\s+(FOR|FITS|FIT|TO FIT)\b/i,
    /\b(FITS|FIT|COMPATIBLE WITH)\s+(CAT|CATERPILLAR|DEERE|VOLVO)\b/i,
    /\b(CAT|CATERPILLAR|DEERE|VOLVO)\s+[A-Z0-9-]+\s+(BUCKET|TRANSMISSION|ENGINE|TIRE|TIRES|MANUAL|COMPONENT|CYLINDER|PUMP|PARTS? ONLY)\b/i,
    /\b(PARTS? ONLY|DISMANTLED|SALVAGE|FOR PARTS)\b/i,
    /\bSERIES LOADER\b/i
  ];

  for (const pattern of partTitlePatterns) {
    if (pattern.test(cTitle)) {
      return { valid: false, reason: 'REJECTED_PART_OR_ATTACHMENT' };
    }
  }

  // 6. Category validation
  const catParts = target.category.toUpperCase().split(' ').filter(Boolean);
  const titleHasCat = catParts.every(p => cTitle.includes(p)) || cTitle.includes(target.category.toUpperCase().replace(' ', ', '));
  const structHasCat = catParts.every(p => candidate.category.toUpperCase().includes(p));

  // Category match check
  if (!titleHasCat && !structHasCat) {
     return { valid: false, reason: 'REJECTED_WRONG_CATEGORY' };
  }

  return { valid: true };
}
