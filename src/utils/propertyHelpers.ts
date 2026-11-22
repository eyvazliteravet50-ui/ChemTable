import {
  ChemicalElement,
  ElementCategory,
  MetalClass,
  OrbitalBlock,
  OxideAcidity,
  PropertyMode,
  StateAtSTP,
  TempUnit,
} from '../types/element';

export const CATEGORY_META: Record<
  ElementCategory,
  { label: string; shortLabel: string; bgLight: string; bgDark: string; border: string; text: string; swatch: string }
> = {
  'alkali-metal': {
    label: 'Qələvi metallar',
    shortLabel: 'Qələvi',
    bgLight: 'bg-rose-50 hover:bg-rose-100',
    bgDark: 'dark:bg-rose-950/55 dark:hover:bg-rose-900/65',
    border: 'border-rose-300 dark:border-rose-700/80',
    text: 'text-rose-900 dark:text-rose-100',
    swatch: '#e11d48',
  },
  'alkaline-earth': {
    label: 'Qələvi-torpaq metallar',
    shortLabel: 'Qələvi-torpaq',
    bgLight: 'bg-amber-50 hover:bg-amber-100',
    bgDark: 'dark:bg-amber-950/55 dark:hover:bg-amber-900/65',
    border: 'border-amber-300 dark:border-amber-700/80',
    text: 'text-amber-950 dark:text-amber-100',
    swatch: '#d97706',
  },
  'transition-metal': {
    label: 'Keçid metalları',
    shortLabel: 'Keçid metalı',
    bgLight: 'bg-sky-50 hover:bg-sky-100',
    bgDark: 'dark:bg-sky-950/55 dark:hover:bg-sky-900/65',
    border: 'border-sky-300 dark:border-sky-700/80',
    text: 'text-sky-950 dark:text-sky-100',
    swatch: '#0284c7',
  },
  'post-transition': {
    label: 'Post-keçid metalları',
    shortLabel: 'Post-keçid',
    bgLight: 'bg-teal-50 hover:bg-teal-100',
    bgDark: 'dark:bg-teal-950/55 dark:hover:bg-teal-900/65',
    border: 'border-teal-300 dark:border-teal-700/80',
    text: 'text-teal-950 dark:text-teal-100',
    swatch: '#0d9488',
  },
  metalloid: {
    label: 'Yarımmetallar (Metalloidlər)',
    shortLabel: 'Yarımmetal',
    bgLight: 'bg-emerald-50 hover:bg-emerald-100',
    bgDark: 'dark:bg-emerald-950/55 dark:hover:bg-emerald-900/65',
    border: 'border-emerald-300 dark:border-emerald-700/80',
    text: 'text-emerald-950 dark:text-emerald-100',
    swatch: '#059669',
  },
  'reactive-nonmetal': {
    label: 'Qeyri-metallar',
    shortLabel: 'Qeyri-metal',
    bgLight: 'bg-indigo-50 hover:bg-indigo-100',
    bgDark: 'dark:bg-indigo-950/55 dark:hover:bg-indigo-900/65',
    border: 'border-indigo-300 dark:border-indigo-700/80',
    text: 'text-indigo-950 dark:text-indigo-100',
    swatch: '#4f46e5',
  },
  halogen: {
    label: 'Halogenlər',
    shortLabel: 'Halogen',
    bgLight: 'bg-violet-50 hover:bg-violet-100',
    bgDark: 'dark:bg-violet-950/55 dark:hover:bg-violet-900/65',
    border: 'border-violet-300 dark:border-violet-700/80',
    text: 'text-violet-950 dark:text-violet-100',
    swatch: '#7c3aed',
  },
  'noble-gas': {
    label: 'Təsirsiz (nəcib) qazlar',
    shortLabel: 'Təsirsiz qaz',
    bgLight: 'bg-cyan-50 hover:bg-cyan-100',
    bgDark: 'dark:bg-cyan-950/55 dark:hover:bg-cyan-900/65',
    border: 'border-cyan-300 dark:border-cyan-700/80',
    text: 'text-cyan-950 dark:text-cyan-100',
    swatch: '#0891b2',
  },
  lanthanide: {
    label: 'Lantanoidlər',
    shortLabel: 'Lantanoid',
    bgLight: 'bg-orange-50 hover:bg-orange-100',
    bgDark: 'dark:bg-orange-950/55 dark:hover:bg-orange-900/65',
    border: 'border-orange-300 dark:border-orange-700/80',
    text: 'text-orange-950 dark:text-orange-100',
    swatch: '#ea580c',
  },
  actinide: {
    label: 'Aktinoidlər',
    shortLabel: 'Aktinoid',
    bgLight: 'bg-fuchsia-50 hover:bg-fuchsia-100',
    bgDark: 'dark:bg-fuchsia-950/55 dark:hover:bg-fuchsia-900/65',
    border: 'border-fuchsia-300 dark:border-fuchsia-700/80',
    text: 'text-fuchsia-950 dark:text-fuchsia-100',
    swatch: '#c026d3',
  },
};

export const METAL_CLASS_META: Record<
  MetalClass,
  { label: string; description: string; bgLight: string; bgDark: string; border: string; text: string; swatch: string }
> = {
  metal: {
    label: 'Metallar',
    description: 'Elektrik və istiliyi yaxşı keçirir, elektron verməyə meyllidir (89 element).',
    bgLight: 'bg-sky-50 hover:bg-sky-100',
    bgDark: 'dark:bg-sky-950/55 dark:hover:bg-sky-900/65',
    border: 'border-sky-300 dark:border-sky-700',
    text: 'text-sky-950 dark:text-sky-100',
    swatch: '#0284c7',
  },
  metalloid: {
    label: 'Yarımmetallar',
    description: 'Metal və qeyri-metal arasında keçid yarımkeçirici xassə göstərir.',
    bgLight: 'bg-emerald-50 hover:bg-emerald-100',
    bgDark: 'dark:bg-emerald-950/55 dark:hover:bg-emerald-900/65',
    border: 'border-emerald-300 dark:border-emerald-700',
    text: 'text-emerald-950 dark:text-emerald-100',
    swatch: '#059669',
  },
  nonmetal: {
    label: 'Qeyri-metallar',
    description: 'Yüksək elektron mənfiliyə malikdir, kovalent əlaqə və anion yaratmağa meyllidir.',
    bgLight: 'bg-amber-50 hover:bg-amber-100',
    bgDark: 'dark:bg-amber-950/55 dark:hover:bg-amber-900/65',
    border: 'border-amber-300 dark:border-amber-700',
    text: 'text-amber-950 dark:text-amber-100',
    swatch: '#d97706',
  },
};

export const ACIDITY_META: Record<
  OxideAcidity,
  { label: string; shortLabel: string; rank: number; bgLight: string; bgDark: string; border: string; text: string; swatch: string; note: string }
> = {
  'strongly-basic': {
    label: 'Qüvvətli əsasi',
    shortLabel: 'Q. əsasi',
    rank: 1,
    bgLight: 'bg-blue-100 hover:bg-blue-200/80',
    bgDark: 'dark:bg-blue-950/75 dark:hover:bg-blue-900/80',
    border: 'border-blue-400 dark:border-blue-700',
    text: 'text-blue-950 dark:text-blue-100',
    swatch: '#2563eb',
    note: 'Su ilə qüvvətli qələvilər (pH > 12) və turşularla duzlar əmələ gətirir.',
  },
  basic: {
    label: 'Əsasi',
    shortLabel: 'Əsasi',
    rank: 2,
    bgLight: 'bg-sky-50 hover:bg-sky-100',
    bgDark: 'dark:bg-sky-950/55 dark:hover:bg-sky-900/65',
    border: 'border-sky-300 dark:border-sky-700',
    text: 'text-sky-950 dark:text-sky-100',
    swatch: '#0284c7',
    note: 'Turşularla neytrallaşma reaksiyasına girərək duz və su əmələ gətirir.',
  },
  amphoteric: {
    label: 'Amfoter',
    shortLabel: 'Amfoter',
    rank: 3,
    bgLight: 'bg-emerald-50 hover:bg-emerald-100',
    bgDark: 'dark:bg-emerald-950/55 dark:hover:bg-emerald-900/65',
    border: 'border-emerald-300 dark:border-emerald-700',
    text: 'text-emerald-950 dark:text-emerald-100',
    swatch: '#10b981',
    note: 'İkili xassəli: həm qüvvətli turşularla, həm də qüvvətli qələvilərlə reaksiyaya girir.',
  },
  'weakly-acidic': {
    label: 'Zəif turşulu',
    shortLabel: 'Z. turşulu',
    rank: 4,
    bgLight: 'bg-amber-50 hover:bg-amber-100',
    bgDark: 'dark:bg-amber-950/55 dark:hover:bg-amber-900/65',
    border: 'border-amber-300 dark:border-amber-700',
    text: 'text-amber-950 dark:text-amber-100',
    swatch: '#f59e0b',
    note: 'Suda qismən dissosiasiya edən zəif turşular (H₂CO₃, H₃BO₃, H₂SiO₃) əmələ gətirir.',
  },
  acidic: {
    label: 'Turşulu',
    shortLabel: 'Turşulu',
    rank: 5,
    bgLight: 'bg-orange-100 hover:bg-orange-200/80',
    bgDark: 'dark:bg-orange-950/65 dark:hover:bg-orange-900/75',
    border: 'border-orange-300 dark:border-orange-700',
    text: 'text-orange-950 dark:text-orange-100',
    swatch: '#ea580c',
    note: 'Əsaslarla reaksiya verərək duzlar və oksid-turşular yaradır.',
  },
  'strongly-acidic': {
    label: 'Qüvvətli turşulu',
    shortLabel: 'Q. turşulu',
    rank: 6,
    bgLight: 'bg-rose-100 hover:bg-rose-200/80',
    bgDark: 'dark:bg-rose-950/70 dark:hover:bg-rose-900/80',
    border: 'border-rose-400 dark:border-rose-700',
    text: 'text-rose-950 dark:text-rose-100',
    swatch: '#dc2626',
    note: 'Suda tam dissosiasiya edən qüvvətli mineral turşular (H₂SO₄, HNO₃, HClO₄) əmələ gətirir.',
  },
  neutral: {
    label: 'Neytral / Təsirsiz',
    shortLabel: 'Neytral',
    rank: 0,
    bgLight: 'bg-slate-100 hover:bg-slate-200/80',
    bgDark: 'dark:bg-slate-800/70 dark:hover:bg-slate-800',
    border: 'border-slate-300 dark:border-slate-700',
    text: 'text-slate-700 dark:text-slate-300',
    swatch: '#64748b',
    note: 'Oksidləri neytral xassəlidir və ya standart şəraitdə oksid əmələ gətirmir.',
  },
};

export const BLOCK_META: Record<
  OrbitalBlock,
  { label: string; description: string; bgLight: string; bgDark: string; border: string; text: string; swatch: string }
> = {
  s: {
    label: 's-blok',
    description: 'Valens elektronları s-orbitalında yerləşir (Qrup 1–2 və He).',
    bgLight: 'bg-rose-50 hover:bg-rose-100',
    bgDark: 'dark:bg-rose-950/55 dark:hover:bg-rose-900/65',
    border: 'border-rose-300 dark:border-rose-700',
    text: 'text-rose-950 dark:text-rose-100',
    swatch: '#e11d48',
  },
  p: {
    label: 'p-blok',
    description: 'Valens elektronları p-orbitalında tamamlanır (Qrup 13–18).',
    bgLight: 'bg-amber-50 hover:bg-amber-100',
    bgDark: 'dark:bg-amber-950/55 dark:hover:bg-amber-900/65',
    border: 'border-amber-300 dark:border-amber-700',
    text: 'text-amber-950 dark:text-amber-100',
    swatch: '#d97706',
  },
  d: {
    label: 'd-blok',
    description: 'Keçid metalları — d-orbitalları tədricən dolur (Qrup 3–12).',
    bgLight: 'bg-sky-50 hover:bg-sky-100',
    bgDark: 'dark:bg-sky-950/55 dark:hover:bg-sky-900/65',
    border: 'border-sky-300 dark:border-sky-700',
    text: 'text-sky-950 dark:text-sky-100',
    swatch: '#0284c7',
  },
  f: {
    label: 'f-blok',
    description: 'Daxili keçid metalları — 4f (Lantanoid) və 5f (Aktinoid) orbitalları.',
    bgLight: 'bg-violet-50 hover:bg-violet-100',
    bgDark: 'dark:bg-violet-950/55 dark:hover:bg-violet-900/65',
    border: 'border-violet-300 dark:border-violet-700',
    text: 'text-violet-950 dark:text-violet-100',
    swatch: '#7c3aed',
  },
};

export const STATE_META: Record<
  StateAtSTP,
  { label: string; symbol: string; bgLight: string; bgDark: string; border: string; text: string; swatch: string }
> = {
  solid: {
    label: 'Bərk',
    symbol: 'S',
    bgLight: 'bg-slate-100 hover:bg-slate-200/80',
    bgDark: 'dark:bg-slate-800/80 dark:hover:bg-slate-700/80',
    border: 'border-slate-300 dark:border-slate-600',
    text: 'text-slate-900 dark:text-slate-100',
    swatch: '#475569',
  },
  liquid: {
    label: 'Maye',
    symbol: 'L',
    bgLight: 'bg-sky-100 hover:bg-sky-200/80',
    bgDark: 'dark:bg-sky-950/75 dark:hover:bg-sky-900/80',
    border: 'border-sky-400 dark:border-sky-600',
    text: 'text-sky-950 dark:text-sky-100',
    swatch: '#0284c7',
  },
  gas: {
    label: 'Qaz',
    symbol: 'G',
    bgLight: 'bg-amber-100 hover:bg-amber-200/80',
    bgDark: 'dark:bg-amber-950/70 dark:hover:bg-amber-900/80',
    border: 'border-amber-400 dark:border-amber-600',
    text: 'text-amber-950 dark:text-amber-100',
    swatch: '#d97706',
  },
};

export interface PropertyModeConfig {
  id: PropertyMode;
  label: string;
  shortLabel: string;
  unit: string;
  description: string;
  trendHint?: string;
}

export const PROPERTY_MODES: PropertyModeConfig[] = [
  {
    id: 'category',
    label: 'Kateqoriyalar',
    shortLabel: 'Təsnifat',
    unit: '',
    description: 'Elementlərin kimyəvi ailələrə görə klassik bölgüsü (10 kateqoriya).',
  },
  {
    id: 'metal-class',
    label: 'Metallar / Qeyri-metallar',
    shortLabel: 'Metallar',
    unit: '',
    description: 'Metallar, yarımmetallar və qeyri-metallar arasında diaqonal sərhəd.',
    trendHint: 'Sağdan sola və yuxarıdan aşağı metal xassəsi artır',
  },
  {
    id: 'atomic-radius',
    label: 'Atom radiusu',
    shortLabel: 'Atom radiusu',
    unit: 'pm',
    description: 'Atomun ölçüsü (pikometr). Dövrlər üzrə sağa doğru kiçilir, qruplar üzrə aşağıya doğru böyüyür.',
    trendHint: 'Soldan sağa azalır · Yuxarıdan aşağı artır',
  },
  {
    id: 'acidity',
    label: 'Turşuluq / Əsaslıq',
    shortLabel: 'Turşuluq',
    unit: 'Oksid',
    description: 'Elementlərin yüksək oksid və hidroksidlərinin əsasi, amfoter və ya turşulu xassəsi.',
    trendHint: 'Soldan sağa əsasi → amfoter → turşulu xassə güclənir',
  },
  {
    id: 'ionization-energy',
    label: 'İonlaşma enerjisi',
    shortLabel: 'İonlaşma enerjisi',
    unit: 'kJ/mol',
    description: 'Neytral atomdan ilk elektronu qoparmaq üçün tələb olunan minimal enerji.',
    trendHint: 'Soldan sağa artır · Yuxarıdan aşağı azalır',
  },
  {
    id: 'electronegativity',
    label: 'Elektron mənfilik',
    shortLabel: 'Elektron mənfilik',
    unit: 'Pauling',
    description: 'Atomun kimyəvi rabitədə elektron cütünü özünə cəlb etmə qabiliyyəti.',
    trendHint: 'Ən yüksək: Flüor (3.98) · Ən aşağı: Fransium (0.70)',
  },
  {
    id: 'electron-affinity',
    label: 'Elektron qohumluğu',
    shortLabel: 'Elektron qohumluğu',
    unit: 'kJ/mol',
    description: 'Neytral atoma bir elektron birləşdikdə ayrılan və ya udulan enerji.',
    trendHint: 'Halogenlərdə ən yüksəkdir (Cl: 348.6 kJ/mol)',
  },
  {
    id: 'state-temperature',
    label: 'Aqreqat halı (T)',
    shortLabel: 'Aqreqat halı',
    unit: 'K / °C',
    description: 'Seçilmiş temperaturda elementlərin bərk, maye və ya qaz aqreqat halını izləyin.',
  },
  {
    id: 'melting-point',
    label: 'Ərimə temperaturu',
    shortLabel: 'Ərimə temp.',
    unit: 'K',
    description: 'Bərk haldan maye hala keçid temperaturu (Volfram: 3695 K, Karbon: 3823 K).',
  },
  {
    id: 'boiling-point',
    label: 'Qaynama temperaturu',
    shortLabel: 'Qaynama temp.',
    unit: 'K',
    description: 'Maye haldan qaz halına keçid temperaturu.',
  },
  {
    id: 'density',
    label: 'Sıxlıq',
    shortLabel: 'Sıxlıq',
    unit: 'g/cm³',
    description: 'Vahid həcmin kütləsi (Osmium: 22.59 g/cm³ — ən sıx təbii element).',
  },
  {
    id: 'block',
    label: 'Orbital blokları',
    shortLabel: 's/p/d/f Blok',
    unit: '',
    description: 'Son elektronun doldurduğu kvant alt-səviyyəsi (s, p, d, f).',
  },
];

export function formatTemp(kelvin: number | null, unit: TempUnit): string {
  if (kelvin === null) return '—';
  if (unit === 'K') return `${kelvin.toFixed(kelvin < 100 ? 1 : 0)} K`;
  const c = kelvin - 273.15;
  return `${c.toFixed(Math.abs(c) < 100 ? 1 : 0)} °C`;
}

export function getStateAtTemperature(el: ChemicalElement, tempK: number): StateAtSTP | 'unknown' {
  if (el.meltingPointK === null && el.boilingPointK === null) {
    return tempK >= 290 && tempK <= 310 ? el.stateAtSTP : 'unknown';
  }
  const mp = el.meltingPointK;
  const bp = el.boilingPointK;

  if (bp !== null && tempK >= bp) return 'gas';
  if (mp !== null && tempK >= mp) {
    if (bp !== null && tempK < bp) return 'liquid';
    if (bp === null) return 'liquid';
  }
  if (mp !== null && tempK < mp) return 'solid';
  if (bp !== null && tempK < bp) return 'solid';
  return 'unknown';
}

export function getNumericPropertyValue(
  el: ChemicalElement,
  mode: PropertyMode
): number | null {
  switch (mode) {
    case 'atomic-radius':
      return el.atomicRadius;
    case 'ionization-energy':
      return el.ionizationEnergy;
    case 'electronegativity':
      return el.electronegativity;
    case 'electron-affinity':
      return el.electronAffinity;
    case 'melting-point':
      return el.meltingPointK;
    case 'boiling-point':
      return el.boilingPointK;
    case 'density':
      return el.density;
    default:
      return null;
  }
}

export const NUMERIC_BOUNDS: Record<
  'atomic-radius' | 'ionization-energy' | 'electronegativity' | 'electron-affinity' | 'melting-point' | 'boiling-point' | 'density',
  { min: number; max: number; scale: 'linear' | 'log' }
> = {
  'atomic-radius': { min: 31, max: 348, scale: 'linear' },
  'ionization-energy': { min: 375, max: 2373, scale: 'linear' },
  electronegativity: { min: 0.7, max: 3.98, scale: 'linear' },
  'electron-affinity': { min: -100, max: 350, scale: 'linear' },
  'melting-point': { min: 1, max: 3823, scale: 'linear' },
  'boiling-point': { min: 4, max: 6203, scale: 'linear' },
  density: { min: 0.0001, max: 23, scale: 'log' },
};

export function normalizeNumericRatio(
  val: number | null,
  mode: keyof typeof NUMERIC_BOUNDS
): number | null {
  if (val === null) return null;
  const { min, max, scale } = NUMERIC_BOUNDS[mode];
  if (scale === 'log') {
    const safeVal = Math.max(val, min);
    const ratio = (Math.log10(safeVal) - Math.log10(min)) / (Math.log10(max) - Math.log10(min));
    return Math.max(0, Math.min(1, ratio));
  }
  const ratio = (val - min) / (max - min);
  return Math.max(0, Math.min(1, ratio));
}

/**
 * Generates an inline heatmap background + contrasting text color for continuous scientific scales.
 */
export function getHeatmapInlineStyle(
  ratio: number | null,
  mode: PropertyMode,
  isDark: boolean
): { backgroundColor?: string; borderColor?: string; color?: string } {
  if (ratio === null) {
    return {};
  }

  // Distinct calibrated palettes per scientific domain
  // atomic-radius: Cool sky -> deep cobalt/indigo
  // ionization-energy / electronegativity: Slate/teal -> amber/crimson
  // thermal (melting/boiling): Ice cyan -> amber -> fiery coral
  let hueStart = 200;
  let hueEnd = 250;

  if (mode === 'atomic-radius') {
    hueStart = 195; // cyan
    hueEnd = 245; // deep indigo
  } else if (mode === 'ionization-energy' || mode === 'electron-affinity') {
    hueStart = 210;
    hueEnd = 15; // warm orange-red
  } else if (mode === 'electronegativity') {
    hueStart = 180;
    hueEnd = 335; // teal -> rose
  } else if (mode === 'melting-point' || mode === 'boiling-point') {
    hueStart = 205;
    hueEnd = 10; // icy blue -> molten red-orange
  } else if (mode === 'density') {
    hueStart = 165;
    hueEnd = 225;
  }

  // Interpolate hue smoothly without passing through muddy greens when crossing 0/360
  let hue: number;
  if (hueEnd < hueStart && hueStart - hueEnd > 180) {
    // Wrap forward across 360 (e.g. 200 -> 375)
    hue = (hueStart + ratio * (hueEnd + 360 - hueStart)) % 360;
  } else if (hueEnd < hueStart) {
    // Move backwards cleanly (e.g. 210 -> 15 via purple/red? No, 210 -> 370 is blue->magenta->red!)
    hue = (hueStart + ratio * (hueEnd + 360 - hueStart)) % 360;
  } else {
    hue = hueStart + ratio * (hueEnd - hueStart);
  }

  if (isDark) {
    const lightness = 18 + ratio * 24;
    const saturation = 55 + ratio * 25;
    return {
      backgroundColor: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
      borderColor: `hsl(${hue}, ${saturation}%, ${lightness + 14}%)`,
      color: '#f8fafc',
    };
  } else {
    const lightness = 94 - ratio * 42;
    const saturation = 55 + ratio * 30;
    return {
      backgroundColor: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
      borderColor: `hsl(${hue}, ${saturation}%, ${Math.max(35, lightness - 16)}%)`,
      color: lightness < 62 ? '#ffffff' : '#0f172a',
    };
  }
}

export function formatCellMetric(
  el: ChemicalElement,
  mode: PropertyMode,
  tempUnit: TempUnit,
  activeTempK: number
): string {
  switch (mode) {
    case 'category':
      return el.atomicMass;
    case 'metal-class':
      return el.metalClass === 'metal'
        ? 'Metal'
        : el.metalClass === 'metalloid'
        ? 'Yarım'
        : 'Qeyri-m';
    case 'atomic-radius':
      return el.atomicRadius !== null ? `${el.atomicRadius} pm` : '—';
    case 'acidity':
      return el.oxideFormula !== '—' ? el.oxideFormula : 'Neytral';
    case 'ionization-energy':
      return el.ionizationEnergy !== null ? `${Math.round(el.ionizationEnergy)}` : '—';
    case 'electronegativity':
      return el.electronegativity !== null ? el.electronegativity.toFixed(2) : '—';
    case 'electron-affinity':
      return el.electronAffinity !== null ? `${Math.round(el.electronAffinity)}` : '—';
    case 'state-temperature': {
      const st = getStateAtTemperature(el, activeTempK);
      return st === 'solid' ? 'Bərk' : st === 'liquid' ? 'Maye' : st === 'gas' ? 'Qaz' : '?';
    }
    case 'melting-point':
      return formatTemp(el.meltingPointK, tempUnit);
    case 'boiling-point':
      return formatTemp(el.boilingPointK, tempUnit);
    case 'density':
      if (el.density === null) return '—';
      if (el.density < 0.01) return el.density.toFixed(4);
      if (el.density < 1) return el.density.toFixed(2);
      return el.density.toFixed(1);
    case 'block':
      return `${el.block}-blok`;
  }
}
