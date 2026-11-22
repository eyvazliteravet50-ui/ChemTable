import { ArrowDown, ArrowRight } from 'lucide-react';
import { ChemicalElement, PropertyMode, TempUnit } from '../types/element';
import {
  ACIDITY_META,
  BLOCK_META,
  CATEGORY_META,
  METAL_CLASS_META,
  NUMERIC_BOUNDS,
  STATE_META,
  formatCellMetric,
  getHeatmapInlineStyle,
  getNumericPropertyValue,
  getStateAtTemperature,
  normalizeNumericRatio,
} from '../utils/propertyHelpers';
import { ActiveFilter } from './PropertyToolbar';

interface PeriodicTableGridProps {
  elements: ChemicalElement[];
  selectedElement: ChemicalElement;
  onSelectElement: (el: ChemicalElement) => void;
  compareIds: number[];
  mode: PropertyMode;
  filter: ActiveFilter;
  onChangeFilter: (filter: ActiveFilter) => void;
  tempUnit: TempUnit;
  activeTempK: number;
  isDark: boolean;
}

const GROUPS = Array.from({ length: 18 }, (_, i) => i + 1);

export function PeriodicTableGrid({
  elements,
  selectedElement,
  onSelectElement,
  compareIds,
  mode,
  filter,
  onChangeFilter,
  tempUnit,
  activeTempK,
  isDark,
}: PeriodicTableGridProps) {
  const hasFilter = Boolean(
    filter.category || filter.metalClass || filter.acidity || filter.block || filter.state
  );

  const matchesFilter = (el: ChemicalElement): boolean => {
    if (!hasFilter) return true;
    if (filter.category && el.category !== filter.category) return false;
    if (filter.metalClass && el.metalClass !== filter.metalClass) return false;
    if (filter.acidity && el.oxideAcidity !== filter.acidity) return false;
    if (filter.block && el.block !== filter.block) return false;
    if (filter.state) {
      const st =
        mode === 'state-temperature'
          ? getStateAtTemperature(el, activeTempK)
          : el.stateAtSTP;
      if (st !== filter.state) return false;
    }
    return true;
  };

  const getCellStyle = (el: ChemicalElement) => {
    const isNumeric = mode in NUMERIC_BOUNDS;
    if (isNumeric) {
      const val = getNumericPropertyValue(el, mode);
      const ratio = normalizeNumericRatio(val, mode as keyof typeof NUMERIC_BOUNDS);
      if (ratio === null) {
        return {
          className:
            'bg-slate-100/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500',
          inlineStyle: undefined,
        };
      }
      return {
        className: 'border transition-colors',
        inlineStyle: getHeatmapInlineStyle(ratio, mode, isDark),
      };
    }

    if (mode === 'category') {
      const m = CATEGORY_META[el.category];
      return {
        className: `${m.bgLight} ${m.bgDark} ${m.border} ${m.text}`,
        inlineStyle: undefined,
      };
    }

    if (mode === 'metal-class') {
      const m = METAL_CLASS_META[el.metalClass];
      return {
        className: `${m.bgLight} ${m.bgDark} ${m.border} ${m.text}`,
        inlineStyle: undefined,
      };
    }

    if (mode === 'acidity') {
      const m = ACIDITY_META[el.oxideAcidity];
      return {
        className: `${m.bgLight} ${m.bgDark} ${m.border} ${m.text}`,
        inlineStyle: undefined,
      };
    }

    if (mode === 'block') {
      const m = BLOCK_META[el.block];
      return {
        className: `${m.bgLight} ${m.bgDark} ${m.border} ${m.text}`,
        inlineStyle: undefined,
      };
    }

    if (mode === 'state-temperature') {
      const st = getStateAtTemperature(el, activeTempK);
      if (st === 'unknown') {
        return {
          className:
            'bg-slate-100/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500',
          inlineStyle: undefined,
        };
      }
      const m = STATE_META[st];
      return {
        className: `${m.bgLight} ${m.bgDark} ${m.border} ${m.text}`,
        inlineStyle: undefined,
      };
    }

    return {
      className: 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800',
      inlineStyle: undefined,
    };
  };

  // Directional trend indicators for quick visual comprehension
  const showTrendGuide =
    mode === 'atomic-radius' ||
    mode === 'ionization-energy' ||
    mode === 'electronegativity' ||
    mode === 'acidity' ||
    mode === 'metal-class';

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 sm:p-4">
      {showTrendGuide && (
        <div className="mb-3 pb-2.5 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <ArrowRight className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" aria-hidden="true" />
            <span>
              <strong className="font-medium text-slate-800 dark:text-slate-200">Dövr üzrə (soldan sağa):</strong>{' '}
              {mode === 'atomic-radius'
                ? 'Atom radiusu azalır (nüvə yükü artdığı üçün)'
                : mode === 'ionization-energy'
                ? 'İonlaşma enerjisi artır'
                : mode === 'electronegativity'
                ? 'Elektron mənfilik artır'
                : mode === 'acidity'
                ? 'Əsasi xassə → Amfoter → Turşulu xassə güclənir'
                : 'Metal xassəsi zəifləyir, qeyri-metal xassəsi artır'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <ArrowDown className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" aria-hidden="true" />
            <span>
              <strong className="font-medium text-slate-800 dark:text-slate-200">Qrup üzrə (yuxarıdan aşağı):</strong>{' '}
              {mode === 'atomic-radius'
                ? 'Yeni elektron təbəqələri hesabına radius artır'
                : mode === 'ionization-energy'
                ? 'İonlaşma enerjisi azalır'
                : mode === 'electronegativity'
                ? 'Elektron mənfilik azalır'
                : mode === 'acidity'
                ? 'Metallarda əsasi xassə artır'
                : 'Metal xassəsi artır'}
            </span>
          </div>
        </div>
      )}

      <div className="overflow-x-auto pt-scroll pb-1">
        <div
          className="min-w-[880px] grid gap-1"
          style={{
            gridTemplateColumns: '22px repeat(18, minmax(0, 1fr))',
            gridTemplateRows: '20px repeat(7, minmax(56px, auto)) 12px repeat(2, minmax(56px, auto))',
          }}
        >
          {/* Group headers (1..18) */}
          <div style={{ gridRow: 1, gridColumn: 1 }} />
          {GROUPS.map((g) => (
            <div
              key={`g-${g}`}
              style={{ gridRow: 1, gridColumn: g + 1 }}
              className="flex items-center justify-center text-[10px] font-mono tabular-nums font-medium text-slate-400 dark:text-slate-500"
            >
              {g}
            </div>
          ))}

          {/* Period headers (1..7) */}
          {[1, 2, 3, 4, 5, 6, 7].map((p) => (
            <div
              key={`p-${p}`}
              style={{ gridRow: p + 1, gridColumn: 1 }}
              className="flex items-center justify-center text-[10px] font-mono tabular-nums font-medium text-slate-400 dark:text-slate-500"
            >
              {p}
            </div>
          ))}

          {/* Lanthanide & Actinide marker bridges in Group 3, Periods 6 & 7 */}
          <button
            type="button"
            onClick={() =>
              onChangeFilter({
                ...filter,
                category: filter.category === 'lanthanide' ? null : 'lanthanide',
              })
            }
            style={{ gridRow: 7, gridColumn: 4 }}
            className="rounded-md border border-dashed border-orange-300 dark:border-orange-700/70 bg-orange-50/50 dark:bg-orange-950/30 text-orange-800 dark:text-orange-200 flex flex-col items-center justify-center p-1 text-center hover:bg-orange-100/70 dark:hover:bg-orange-900/40 transition-colors cursor-pointer"
            title="Lantanoidləri göstər (57–71)"
          >
            <span className="text-[10px] font-mono font-semibold tabular-nums">57–71</span>
            <span className="text-[8px] leading-tight">La–Lu</span>
          </button>

          <button
            type="button"
            onClick={() =>
              onChangeFilter({
                ...filter,
                category: filter.category === 'actinide' ? null : 'actinide',
              })
            }
            style={{ gridRow: 8, gridColumn: 4 }}
            className="rounded-md border border-dashed border-fuchsia-300 dark:border-fuchsia-700/70 bg-fuchsia-50/50 dark:bg-fuchsia-950/30 text-fuchsia-800 dark:text-fuchsia-200 flex flex-col items-center justify-center p-1 text-center hover:bg-fuchsia-100/70 dark:hover:bg-fuchsia-900/40 transition-colors cursor-pointer"
            title="Aktinoidləri göstər (89–103)"
          >
            <span className="text-[10px] font-mono font-semibold tabular-nums">89–103</span>
            <span className="text-[8px] leading-tight">Ac–Lr</span>
          </button>

          {/* Labels for f-block rows */}
          <div
            style={{ gridRow: 10, gridColumn: '1 / span 4' }}
            className="flex items-center justify-end pr-2 text-[11px] font-medium text-slate-500 dark:text-slate-400"
          >
            Lantanoidlər (4f)
          </div>
          <div
            style={{ gridRow: 11, gridColumn: '1 / span 4' }}
            className="flex items-center justify-end pr-2 text-[11px] font-medium text-slate-500 dark:text-slate-400"
          >
            Aktinoidlər (5f)
          </div>

          {/* All 118 Element Cells */}
          {elements.map((el) => {
            const isSelected = selectedElement.number === el.number;
            const isCompared = compareIds.includes(el.number);
            const isMatch = matchesFilter(el);
            const { className, inlineStyle } = getCellStyle(el);
            const metricText = formatCellMetric(el, mode, tempUnit, activeTempK);

            return (
              <button
                key={el.number}
                type="button"
                onClick={() => onSelectElement(el)}
                style={{
                  gridRow: el.gridRow + 1,
                  gridColumn: el.gridCol + 1,
                  ...inlineStyle,
                }}
                aria-label={`${el.number} ${el.nameAz} (${el.symbol})`}
                aria-pressed={isSelected}
                className={`group relative rounded-md border p-1 flex flex-col justify-between text-left transition-all duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-sky-600 ${className} ${
                  isSelected
                    ? 'ring-2 ring-slate-900 dark:ring-white z-20 scale-[1.06] shadow-md'
                    : isCompared
                    ? 'ring-2 ring-sky-500 z-10'
                    : ''
                } ${!isMatch ? 'opacity-20 grayscale-[60%]' : 'opacity-100'}`}
              >
                <div className="flex items-start justify-between gap-0.5 leading-none">
                  <span className="text-[9px] font-mono tabular-nums opacity-80 font-medium">
                    {el.number}
                  </span>
                  {isCompared && (
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0 mt-0.5"
                      title="Müqayisədə"
                    />
                  )}
                </div>

                <div className="text-center my-0.5">
                  <div className="text-[13px] sm:text-[14px] font-bold leading-tight tracking-tight">
                    {el.symbol}
                  </div>
                  <div className="text-[8px] leading-tight truncate opacity-85 max-w-full">
                    {el.nameAz}
                  </div>
                </div>

                <div className="text-[8.5px] font-mono tabular-nums leading-none text-center truncate opacity-90">
                  {metricText}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
