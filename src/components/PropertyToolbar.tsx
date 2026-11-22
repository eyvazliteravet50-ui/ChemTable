import { Moon, RotateCcw, Sun, Thermometer } from 'lucide-react';
import {
  ElementCategory,
  MetalClass,
  OrbitalBlock,
  OxideAcidity,
  PropertyMode,
  StateAtSTP,
  TempUnit,
} from '../types/element';
import {
  ACIDITY_META,
  BLOCK_META,
  CATEGORY_META,
  METAL_CLASS_META,
  NUMERIC_BOUNDS,
  PROPERTY_MODES,
  STATE_META,
  formatTemp,
} from '../utils/propertyHelpers';

export interface ActiveFilter {
  category?: ElementCategory | null;
  metalClass?: MetalClass | null;
  acidity?: OxideAcidity | null;
  block?: OrbitalBlock | null;
  state?: StateAtSTP | null;
}

interface PropertyToolbarProps {
  mode: PropertyMode;
  onChangeMode: (mode: PropertyMode) => void;
  filter: ActiveFilter;
  onChangeFilter: (filter: ActiveFilter) => void;
  tempUnit: TempUnit;
  onToggleTempUnit: () => void;
  activeTempK: number;
  onChangeTempK: (k: number) => void;
  isDark: boolean;
  onToggleDark: () => void;
}

const TEMP_PRESETS = [
  { label: '0 K', k: 0 },
  { label: 'Otaq (298 K)', k: 298 },
  { label: '1000 K', k: 1000 },
  { label: '2500 K', k: 2500 },
  { label: '4000 K', k: 4000 },
];

export function PropertyToolbar({
  mode,
  onChangeMode,
  filter,
  onChangeFilter,
  tempUnit,
  onToggleTempUnit,
  activeTempK,
  onChangeTempK,
  isDark,
  onToggleDark,
}: PropertyToolbarProps) {
  const activeConfig = PROPERTY_MODES.find((m) => m.id === mode)!;

  const hasFilter = Boolean(
    filter.category || filter.metalClass || filter.acidity || filter.block || filter.state
  );

  const toggleCategory = (cat: ElementCategory) => {
    onChangeFilter({ ...filter, category: filter.category === cat ? null : cat });
  };

  const toggleMetalClass = (mc: MetalClass) => {
    onChangeFilter({ ...filter, metalClass: filter.metalClass === mc ? null : mc });
  };

  const toggleAcidity = (ac: OxideAcidity) => {
    onChangeFilter({ ...filter, acidity: filter.acidity === ac ? null : ac });
  };

  const toggleBlock = (bl: OrbitalBlock) => {
    onChangeFilter({ ...filter, block: filter.block === bl ? null : bl });
  };

  const toggleState = (st: StateAtSTP) => {
    onChangeFilter({ ...filter, state: filter.state === st ? null : st });
  };

  const isNumericMode = mode in NUMERIC_BOUNDS;

  return (
    <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3.5">
      {/* Row 1: Property Mode Selector + Global Units/Theme Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          {PROPERTY_MODES.map((m) => {
            const active = m.id === mode;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  onChangeMode(m.id);
                  onChangeFilter({});
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 ${
                  active
                    ? 'bg-slate-900 text-white border-slate-900 dark:bg-sky-600 dark:border-sky-600 dark:text-white'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900 dark:bg-slate-800/70 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800'
                }`}
              >
                {m.shortLabel}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {hasFilter && (
            <button
              type="button"
              onClick={() => onChangeFilter({})}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Filtri sıfırla</span>
            </button>
          )}

          <button
            type="button"
            onClick={onToggleTempUnit}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            title="Temperatur vahidini dəyişdir (°C / K)"
          >
            <Thermometer className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" aria-hidden="true" />
            <span>Vahid: °{tempUnit === 'C' ? 'C' : 'K'}</span>
          </button>

          <button
            type="button"
            onClick={onToggleDark}
            aria-label={isDark ? 'İşıqlı rejimə keç' : 'Tünd rejimə keç'}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {isDark ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                <span>İşıqlı</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-slate-600" aria-hidden="true" />
                <span>Tünd</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Row 2: Active Mode Description + Clickable Legend / Interactive Controls */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col xl:flex-row xl:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 text-xs text-slate-900 dark:text-slate-100 font-semibold">
            <span>{activeConfig.label}</span>
            {activeConfig.unit && (
              <>
                <span aria-hidden="true" className="text-slate-400">·</span>
                <span className="font-mono text-slate-500 dark:text-slate-400 font-normal">
                  {activeConfig.unit}
                </span>
              </>
            )}
            {activeConfig.trendHint && (
              <>
                <span aria-hidden="true" className="text-slate-400">·</span>
                <span className="text-sky-700 dark:text-sky-400 font-normal">
                  {activeConfig.trendHint}
                </span>
              </>
            )}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {activeConfig.description}
          </p>
        </div>

        {/* Interactive Legend Area */}
        <div className="flex flex-wrap items-center gap-1.5">
          {mode === 'category' &&
            (Object.keys(CATEGORY_META) as ElementCategory[]).map((cat) => {
              const meta = CATEGORY_META[cat];
              const isSelected = filter.category === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md border transition-all whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white font-medium'
                      : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-xs shrink-0"
                    style={{ backgroundColor: meta.swatch }}
                    aria-hidden="true"
                  />
                  <span>{meta.shortLabel}</span>
                </button>
              );
            })}

          {mode === 'metal-class' &&
            (Object.keys(METAL_CLASS_META) as MetalClass[]).map((mc) => {
              const meta = METAL_CLASS_META[mc];
              const isSelected = filter.metalClass === mc;
              return (
                <button
                  key={mc}
                  type="button"
                  onClick={() => toggleMetalClass(mc)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border transition-all whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white font-medium'
                      : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-xs shrink-0"
                    style={{ backgroundColor: meta.swatch }}
                    aria-hidden="true"
                  />
                  <span>{meta.label}</span>
                </button>
              );
            })}

          {mode === 'acidity' &&
            (
              [
                'strongly-basic',
                'basic',
                'amphoteric',
                'weakly-acidic',
                'acidic',
                'strongly-acidic',
                'neutral',
              ] as OxideAcidity[]
            ).map((ac) => {
              const meta = ACIDITY_META[ac];
              const isSelected = filter.acidity === ac;
              return (
                <button
                  key={ac}
                  type="button"
                  onClick={() => toggleAcidity(ac)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md border transition-all whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white font-medium'
                      : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-xs shrink-0"
                    style={{ backgroundColor: meta.swatch }}
                    aria-hidden="true"
                  />
                  <span>{meta.label}</span>
                </button>
              );
            })}

          {mode === 'block' &&
            (['s', 'p', 'd', 'f'] as OrbitalBlock[]).map((bl) => {
              const meta = BLOCK_META[bl];
              const isSelected = filter.block === bl;
              return (
                <button
                  key={bl}
                  type="button"
                  onClick={() => toggleBlock(bl)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border transition-all whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white font-medium'
                      : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-xs shrink-0"
                    style={{ backgroundColor: meta.swatch }}
                    aria-hidden="true"
                  />
                  <span>{meta.label}</span>
                </button>
              );
            })}

          {mode === 'state-temperature' && (
            <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
              <div className="flex items-center gap-1.5">
                {(['solid', 'liquid', 'gas'] as StateAtSTP[]).map((st) => {
                  const meta = STATE_META[st];
                  const isSelected = filter.state === st;
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => toggleState(st)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md border transition-all whitespace-nowrap cursor-pointer ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white font-medium'
                          : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-xs shrink-0"
                        style={{ backgroundColor: meta.swatch }}
                        aria-hidden="true"
                      />
                      <span>{meta.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5">
                <label htmlFor="temp-slider" className="text-xs font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                  Temperatur:
                </label>
                <input
                  id="temp-slider"
                  type="range"
                  min={0}
                  max={6000}
                  step={10}
                  value={activeTempK}
                  onChange={(e) => onChangeTempK(Number(e.target.value))}
                  className="w-32 sm:w-44 accent-sky-600 cursor-pointer"
                />
                <span className="text-xs font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100 min-w-[74px] text-right">
                  {formatTemp(activeTempK, tempUnit)}
                </span>
              </div>

              <div className="flex items-center gap-1">
                {TEMP_PRESETS.map((p) => (
                  <button
                    key={p.k}
                    type="button"
                    onClick={() => onChangeTempK(p.k)}
                    className={`px-2 py-1 text-xs font-mono rounded border transition-colors cursor-pointer whitespace-nowrap ${
                      activeTempK === p.k
                        ? 'bg-sky-600 text-white border-sky-600'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isNumericMode && (
            <div className="flex items-center gap-2.5 text-xs font-mono tabular-nums text-slate-600 dark:text-slate-300">
              <span>
                {mode === 'density'
                  ? '0.0001'
                  : mode === 'melting-point' || mode === 'boiling-point'
                  ? formatTemp(NUMERIC_BOUNDS[mode as keyof typeof NUMERIC_BOUNDS].min, tempUnit)
                  : NUMERIC_BOUNDS[mode as keyof typeof NUMERIC_BOUNDS].min}
              </span>
              <div
                className="w-36 sm:w-48 h-3 rounded-sm border border-slate-300 dark:border-slate-700"
                style={{
                  background:
                    mode === 'atomic-radius'
                      ? 'linear-gradient(90deg, hsl(195, 55%, 88%), hsl(220, 70%, 68%), hsl(245, 85%, 52%))'
                      : mode === 'density'
                      ? 'linear-gradient(90deg, hsl(165, 55%, 88%), hsl(195, 70%, 68%), hsl(225, 85%, 52%))'
                      : mode === 'electronegativity'
                      ? 'linear-gradient(90deg, hsl(180, 55%, 88%), hsl(260, 70%, 66%), hsl(335, 85%, 54%))'
                      : 'linear-gradient(90deg, hsl(205, 55%, 88%), hsl(290, 70%, 65%), hsl(370, 85%, 52%))',
                }}
                aria-hidden="true"
              />
              <span>
                {mode === 'melting-point' || mode === 'boiling-point'
                  ? formatTemp(NUMERIC_BOUNDS[mode as keyof typeof NUMERIC_BOUNDS].max, tempUnit)
                  : NUMERIC_BOUNDS[mode as keyof typeof NUMERIC_BOUNDS].max}
                {activeConfig.unit && mode !== 'melting-point' && mode !== 'boiling-point'
                  ? ` ${activeConfig.unit}`
                  : ''}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
