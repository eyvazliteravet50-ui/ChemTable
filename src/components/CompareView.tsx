import { ArrowLeftRight } from 'lucide-react';
import { ChemicalElement, TempUnit } from '../types/element';
import {
  ACIDITY_META,
  CATEGORY_META,
  METAL_CLASS_META,
  STATE_META,
  formatTemp,
} from '../utils/propertyHelpers';

interface CompareViewProps {
  elements: ChemicalElement[];
  compareIds: number[];
  onChangeCompareIds: (ids: number[]) => void;
  onInspectElement: (el: ChemicalElement) => void;
  tempUnit: TempUnit;
}

const PRESET_PAIRS: { label: string; ids: [number, number] }[] = [
  { label: 'Na vs Cl (Qələvi metal və Halogen)', ids: [11, 17] },
  { label: 'Fe vs Cu (Keçid metalları)', ids: [26, 29] },
  { label: 'C vs Si (Üzvi və Yarımkeçirici)', ids: [6, 14] },
  { label: 'Al vs S (Amfoter və Turşulu)', ids: [13, 16] },
  { label: 'He vs Fr (Ən kiçik və Ən böyük)', ids: [2, 87] },
];

export function CompareView({
  elements,
  compareIds,
  onChangeCompareIds,
  onInspectElement,
  tempUnit,
}: CompareViewProps) {
  const firstId = compareIds[0] ?? 11;
  const secondId = compareIds[1] ?? 17;

  const elA = elements.find((e) => e.number === firstId) ?? elements[10];
  const elB = elements.find((e) => e.number === secondId) ?? elements[16];

  const setElA = (num: number) => onChangeCompareIds([num, elB.number]);
  const setElB = (num: number) => onChangeCompareIds([elA.number, num]);

  const maxRadius = Math.max(elA.atomicRadius ?? 100, elB.atomicRadius ?? 100, 1);
  const rA = ((elA.atomicRadius ?? 100) / maxRadius) * 58;
  const rB = ((elB.atomicRadius ?? 100) / maxRadius) * 58;

  const rows: {
    label: string;
    valA: string;
    valB: string;
    numA?: number | null;
    numB?: number | null;
  }[] = [
    {
      label: 'Kateqoriya',
      valA: CATEGORY_META[elA.category].label,
      valB: CATEGORY_META[elB.category].label,
    },
    {
      label: 'Metal / Qeyri-metal',
      valA: METAL_CLASS_META[elA.metalClass].label,
      valB: METAL_CLASS_META[elB.metalClass].label,
    },
    {
      label: 'Oksid turşuluğu',
      valA: `${ACIDITY_META[elA.oxideAcidity].label} (${elA.oxideFormula})`,
      valB: `${ACIDITY_META[elB.oxideAcidity].label} (${elB.oxideFormula})`,
    },
    {
      label: 'Atom radiusu',
      valA: elA.atomicRadius !== null ? `${elA.atomicRadius} pm` : '—',
      valB: elB.atomicRadius !== null ? `${elB.atomicRadius} pm` : '—',
      numA: elA.atomicRadius,
      numB: elB.atomicRadius,
    },
    {
      label: 'İonlaşma enerjisi',
      valA: elA.ionizationEnergy !== null ? `${elA.ionizationEnergy} kJ/mol` : '—',
      valB: elB.ionizationEnergy !== null ? `${elB.ionizationEnergy} kJ/mol` : '—',
      numA: elA.ionizationEnergy,
      numB: elB.ionizationEnergy,
    },
    {
      label: 'Elektron mənfilik',
      valA: elA.electronegativity !== null ? elA.electronegativity.toFixed(2) : '—',
      valB: elB.electronegativity !== null ? elB.electronegativity.toFixed(2) : '—',
      numA: elA.electronegativity,
      numB: elB.electronegativity,
    },
    {
      label: 'Elektron qohumluğu',
      valA: elA.electronAffinity !== null ? `${elA.electronAffinity} kJ/mol` : '—',
      valB: elB.electronAffinity !== null ? `${elB.electronAffinity} kJ/mol` : '—',
      numA: elA.electronAffinity,
      numB: elB.electronAffinity,
    },
    {
      label: 'Ərimə temperaturu',
      valA: formatTemp(elA.meltingPointK, tempUnit),
      valB: formatTemp(elB.meltingPointK, tempUnit),
      numA: elA.meltingPointK,
      numB: elB.meltingPointK,
    },
    {
      label: 'Qaynama temperaturu',
      valA: formatTemp(elA.boilingPointK, tempUnit),
      valB: formatTemp(elB.boilingPointK, tempUnit),
      numA: elA.boilingPointK,
      numB: elB.boilingPointK,
    },
    {
      label: 'Sıxlıq',
      valA: elA.density !== null ? `${elA.density} q/sm³` : '—',
      valB: elB.density !== null ? `${elB.density} q/sm³` : '—',
      numA: elA.density,
      numB: elB.density,
    },
    {
      label: 'Aqreqat halı (298 K)',
      valA: STATE_META[elA.stateAtSTP].label,
      valB: STATE_META[elB.stateAtSTP].label,
    },
    {
      label: 'Elektron konfiqurasiyası',
      valA: elA.electronConfig,
      valB: elB.electronConfig,
    },
    {
      label: 'Oksidləşmə dərəcələri',
      valA: elA.oxidationStates,
      valB: elB.oxidationStates,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Presets & Element Pickers */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mr-1">
            Hazır müqayisələr:
          </span>
          {PRESET_PAIRS.map((p) => {
            const active = elA.number === p.ids[0] && elB.number === p.ids[1];
            return (
              <button
                key={p.label}
                type="button"
                onClick={() => onChangeCompareIds([...p.ids])}
                className={`px-2.5 py-1 text-xs rounded-md border transition-colors cursor-pointer ${
                  active
                    ? 'bg-slate-900 text-white border-slate-900 dark:bg-sky-600 dark:border-sky-600'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div className="space-y-1">
            <label htmlFor="select-el-a" className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Birinci element
            </label>
            <select
              id="select-el-a"
              value={elA.number}
              onChange={(e) => setElA(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
            >
              {elements.map((e) => (
                <option key={e.number} value={e.number}>
                  {e.number}. {e.symbol} — {e.nameAz}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => onChangeCompareIds([elB.number, elA.number])}
            className="self-end p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer"
            title="Yerini dəyiş"
            aria-label="Elementlərin yerini dəyiş"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>

          <div className="space-y-1">
            <label htmlFor="select-el-b" className="text-xs font-medium text-slate-500 dark:text-slate-400">
              İkinci element
            </label>
            <select
              id="select-el-b"
              value={elB.number}
              onChange={(e) => setElB(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
            >
              {elements.map((e) => (
                <option key={e.number} value={e.number}>
                  {e.number}. {e.symbol} — {e.nameAz}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Scaled Atomic Radius Visual Comparison */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="flex items-center justify-around gap-4 py-2">
            <button
              type="button"
              onClick={() => onInspectElement(elA)}
              className="flex flex-col items-center gap-2 group cursor-pointer"
            >
              <svg viewBox="0 0 140 140" className="w-32 h-32">
                <circle
                  cx="70"
                  cy="70"
                  r={rA}
                  fill={CATEGORY_META[elA.category].swatch}
                  fillOpacity="0.18"
                  stroke={CATEGORY_META[elA.category].swatch}
                  strokeWidth="2"
                />
                <text
                  x="70"
                  y="74"
                  textAnchor="middle"
                  className="fill-slate-900 dark:fill-white text-lg font-bold"
                >
                  {elA.symbol}
                </text>
              </svg>
              <div className="text-center">
                <div className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-sky-600">
                  {elA.nameAz}
                </div>
                <div className="text-xs font-mono tabular-nums text-slate-500">
                  {elA.atomicRadius ?? '—'} pm
                </div>
              </div>
            </button>

            <div className="text-xs font-mono text-slate-400">vs</div>

            <button
              type="button"
              onClick={() => onInspectElement(elB)}
              className="flex flex-col items-center gap-2 group cursor-pointer"
            >
              <svg viewBox="0 0 140 140" className="w-32 h-32">
                <circle
                  cx="70"
                  cy="70"
                  r={rB}
                  fill={CATEGORY_META[elB.category].swatch}
                  fillOpacity="0.18"
                  stroke={CATEGORY_META[elB.category].swatch}
                  strokeWidth="2"
                />
                <text
                  x="70"
                  y="74"
                  textAnchor="middle"
                  className="fill-slate-900 dark:fill-white text-lg font-bold"
                >
                  {elB.symbol}
                </text>
              </svg>
              <div className="text-center">
                <div className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-sky-600">
                  {elB.nameAz}
                </div>
                <div className="text-xs font-mono tabular-nums text-slate-500">
                  {elB.atomicRadius ?? '—'} pm
                </div>
              </div>
            </button>
          </div>

          <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Ölçü və Reaktivlik Müqayisəsi
            </h3>
            <p>
              <strong>{elA.nameAz} ({elA.symbol})</strong> — {elA.summaryAz}
            </p>
            <p>
              <strong>{elB.nameAz} ({elB.symbol})</strong> — {elB.summaryAz}
            </p>
          </div>
        </div>
      </section>

      {/* Detailed Side-by-Side Comparison Matrix */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <th className="py-3 px-4 font-semibold text-slate-600 dark:text-slate-300 w-1/3">
                Xüsusiyyət
              </th>
              <th className="py-3 px-4 font-bold text-slate-900 dark:text-white w-1/3">
                {elA.number}. {elA.nameAz} ({elA.symbol})
              </th>
              <th className="py-3 px-4 font-bold text-slate-900 dark:text-white w-1/3">
                {elB.number}. {elB.nameAz} ({elB.symbol})
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {rows.map((row) => {
              const aHigher =
                row.numA != null && row.numB != null && row.numA > row.numB;
              const bHigher =
                row.numA != null && row.numB != null && row.numB > row.numA;

              return (
                <tr key={row.label} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 px-4 text-slate-500 dark:text-slate-400 font-medium">
                    {row.label}
                  </td>
                  <td
                    className={`py-2.5 px-4 font-mono tabular-nums ${
                      aHigher
                        ? 'font-bold text-sky-700 dark:text-sky-400'
                        : 'text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {row.valA}
                  </td>
                  <td
                    className={`py-2.5 px-4 font-mono tabular-nums ${
                      bHigher
                        ? 'font-bold text-sky-700 dark:text-sky-400'
                        : 'text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {row.valB}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}
