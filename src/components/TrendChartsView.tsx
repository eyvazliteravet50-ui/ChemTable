import { useMemo, useState } from 'react';
import { ChemicalElement, TempUnit } from '../types/element';
import { CATEGORY_META, formatTemp } from '../utils/propertyHelpers';

type TrendMetricKey =
  | 'atomicRadius'
  | 'ionizationEnergy'
  | 'electronegativity'
  | 'electronAffinity'
  | 'meltingPointK'
  | 'boilingPointK'
  | 'density';

interface TrendChartsViewProps {
  elements: ChemicalElement[];
  selectedElement: ChemicalElement;
  onSelectElement: (el: ChemicalElement) => void;
  tempUnit: TempUnit;
}

const TREND_METRICS: {
  key: TrendMetricKey;
  label: string;
  unit: string;
  description: string;
}[] = [
  {
    key: 'atomicRadius',
    label: 'Atom radiusu',
    unit: 'pm',
    description: 'Hər dövrün başlanğıcında (qələvi metallarda) kəskin sıçrayış, təsirsiz qazlara doğru azalma müşahidə olunur.',
  },
  {
    key: 'ionizationEnergy',
    label: 'İonlaşma enerjisi',
    unit: 'kJ/mol',
    description: 'Təsirsiz qazlarda (He, Ne, Ar, Kr, Xe) maksimuma çatır, qələvi metallarda minimuma enir.',
  },
  {
    key: 'electronegativity',
    label: 'Elektron mənfilik',
    unit: 'Pauling',
    description: 'Halogenlərə doğru artır (Flüor = 3.98), qələvi metallarda ən aşağıdır.',
  },
  {
    key: 'electronAffinity',
    label: 'Elektron qohumluğu',
    unit: 'kJ/mol',
    description: 'Halogenlər (Cl, F, Br, I) elektron qəbul etdikdə ən yüksək enerji ayırır.',
  },
  {
    key: 'meltingPointK',
    label: 'Ərimə temperaturu',
    unit: 'K / °C',
    description: 'Karbon və d-blok keçid metallarında (Volfram, Renium) ən yüksək zirvələr yaranır.',
  },
  {
    key: 'boilingPointK',
    label: 'Qaynama temperaturu',
    unit: 'K / °C',
    description: 'Metalik və kovalent rabitələrin möhkəmliyini əks etdirən dövri əyri.',
  },
  {
    key: 'density',
    label: 'Sıxlıq',
    unit: 'q/sm³',
    description: '6-cı dövr keçid metallarında (Osmium 22.59, İridium 22.56) sıxlıq pik həddə çatır.',
  },
];

const PERIOD_STARTS = [
  { z: 1, label: 'D1 (H)' },
  { z: 3, label: 'D2 (Li)' },
  { z: 11, label: 'D3 (Na)' },
  { z: 19, label: 'D4 (K)' },
  { z: 37, label: 'D5 (Rb)' },
  { z: 55, label: 'D6 (Cs)' },
  { z: 87, label: 'D7 (Fr)' },
];

export function TrendChartsView({
  elements,
  selectedElement,
  onSelectElement,
  tempUnit,
}: TrendChartsViewProps) {
  const [metric, setMetric] = useState<TrendMetricKey>('atomicRadius');
  const [periodFilter, setPeriodFilter] = useState<number | 'all'>('all');
  const [hoveredEl, setHoveredEl] = useState<ChemicalElement | null>(null);

  const metricMeta = TREND_METRICS.find((m) => m.key === metric)!;

  const filteredPoints = useMemo(() => {
    return elements
      .filter((el) => (periodFilter === 'all' ? true : el.period === periodFilter))
      .map((el) => ({
        el,
        val: el[metric] as number | null,
      }))
      .filter((pt): pt is { el: ChemicalElement; val: number } => pt.val !== null);
  }, [elements, metric, periodFilter]);

  const { minVal, maxVal, minZ, maxZ } = useMemo(() => {
    if (filteredPoints.length === 0) {
      return { minVal: 0, maxVal: 1, minZ: 1, maxZ: 118 };
    }
    let minV = Infinity;
    let maxV = -Infinity;
    let minAtomic = Infinity;
    let maxAtomic = -Infinity;
    for (const p of filteredPoints) {
      if (p.val < minV) minV = p.val;
      if (p.val > maxV) maxV = p.val;
      if (p.el.number < minAtomic) minAtomic = p.el.number;
      if (p.el.number > maxAtomic) maxAtomic = p.el.number;
    }
    if (minV === maxV) {
      minV = minV - 1;
      maxV = maxV + 1;
    }
    return { minVal: minV, maxVal: maxV, minZ: minAtomic, maxZ: maxAtomic };
  }, [filteredPoints]);

  const width = 1040;
  const height = 400;
  const pad = { top: 28, right: 24, bottom: 42, left: 64 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;

  const xScale = (z: number) => {
    if (maxZ === minZ) return pad.left + plotW / 2;
    return pad.left + ((z - minZ) / (maxZ - minZ)) * plotW;
  };

  const yScale = (v: number) => {
    return pad.top + plotH - ((v - minVal) / (maxVal - minVal)) * plotH;
  };

  // Build continuous SVG path per consecutive valid points
  const polylinePath = useMemo(() => {
    return filteredPoints
      .map((pt, idx) => `${idx === 0 ? 'M' : 'L'} ${xScale(pt.el.number).toFixed(1)} ${yScale(pt.val).toFixed(1)}`)
      .join(' ');
  }, [filteredPoints, minVal, maxVal, minZ, maxZ]);

  const activePointEl = hoveredEl ?? selectedElement;
  const activePointVal = activePointEl[metric] as number | null;

  const formatMetricValue = (v: number | null) => {
    if (v === null) return '—';
    if (metric === 'meltingPointK' || metric === 'boilingPointK') {
      return formatTemp(v, tempUnit);
    }
    if (metric === 'density') {
      return `${v < 0.01 ? v.toFixed(4) : v.toFixed(2)} q/sm³`;
    }
    return `${v} ${metricMeta.unit}`;
  };

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => minVal + t * (maxVal - minVal));

  return (
    <div className="space-y-4">
      {/* Control Header */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {TREND_METRICS.map((m) => {
              const active = m.key === metric;
              return (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => setMetric(m.key)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-slate-900 text-white border-slate-900 dark:bg-sky-600 dark:border-sky-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                  }`}
                >
                  {m.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-slate-500 dark:text-slate-400 mr-1">Dövr:</span>
            <button
              type="button"
              onClick={() => setPeriodFilter('all')}
              className={`px-2.5 py-1 text-xs font-mono rounded-md border cursor-pointer ${
                periodFilter === 'all'
                  ? 'bg-sky-600 text-white border-sky-600'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              Hamısı
            </button>
            {[1, 2, 3, 4, 5, 6, 7].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriodFilter(p)}
                className={`px-2.5 py-1 text-xs font-mono rounded-md border cursor-pointer ${
                  periodFilter === p
                    ? 'bg-sky-600 text-white border-sky-600'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400">
          {metricMeta.description} Hər hansı nöqtənin üzərinə gəlin və ya klikləyin.
        </p>
      </section>

      {/* Main Chart Stage */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {metricMeta.label} — Atom nömrəsindən asılılıq qrafiki
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Şaquli xətlər yeni dövrlərin başlanğıcını göstərir
            </p>
          </div>

          {/* Live Crosshair HUD */}
          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2">
            <span className="font-mono text-xs font-bold text-sky-700 dark:text-sky-400">
              {activePointEl.number} · {activePointEl.symbol}
            </span>
            <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
              {activePointEl.nameAz}
            </span>
            <span aria-hidden="true" className="text-slate-400">·</span>
            <span className="font-mono tabular-nums text-xs font-bold text-slate-900 dark:text-white">
              {formatMetricValue(activePointVal)}
            </span>
          </div>
        </div>

        <div className="w-full overflow-x-auto pt-scroll">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full min-w-[700px] h-auto select-none"
            role="img"
            aria-label={`${metricMeta.label} dövri qrafiki`}
          >
            {/* Horizontal grid lines */}
            {yTicks.map((tickVal, idx) => {
              const y = yScale(tickVal);
              const label =
                metric === 'meltingPointK' || metric === 'boilingPointK'
                  ? formatTemp(tickVal, tempUnit)
                  : tickVal >= 100
                  ? Math.round(tickVal).toString()
                  : tickVal.toFixed(1);
              return (
                <g key={`yt-${idx}`}>
                  <line
                    x1={pad.left}
                    y1={y}
                    x2={width - pad.right}
                    y2={y}
                    className="stroke-slate-100 dark:stroke-slate-800"
                    strokeWidth="1"
                  />
                  <text
                    x={pad.left - 8}
                    y={y + 3.5}
                    textAnchor="end"
                    className="fill-slate-400 dark:fill-slate-500 text-[10px] font-mono tabular-nums"
                  >
                    {label}
                  </text>
                </g>
              );
            })}

            {/* Period boundary markers */}
            {periodFilter === 'all' &&
              PERIOD_STARTS.map((ps) => {
                const x = xScale(ps.z);
                return (
                  <g key={`ps-${ps.z}`}>
                    <line
                      x1={x}
                      y1={pad.top}
                      x2={x}
                      y2={height - pad.bottom}
                      className="stroke-slate-200 dark:stroke-slate-700"
                      strokeDasharray="3 3"
                      strokeWidth="1"
                    />
                    <text
                      x={x + 4}
                      y={pad.top + 11}
                      className="fill-slate-500 dark:fill-slate-400 text-[10px] font-mono"
                    >
                      {ps.label}
                    </text>
                  </g>
                );
              })}

            {/* Trend Line */}
            <path
              d={polylinePath}
              fill="none"
              className="stroke-sky-600 dark:stroke-sky-400"
              strokeWidth="2"
              strokeLinejoin="round"
            />

            {/* Crosshair for hovered/selected element */}
            {activePointVal !== null &&
              (periodFilter === 'all' || activePointEl.period === periodFilter) && (
                <g>
                  <line
                    x1={xScale(activePointEl.number)}
                    y1={pad.top}
                    x2={xScale(activePointEl.number)}
                    y2={height - pad.bottom}
                    className="stroke-slate-400 dark:stroke-slate-500"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                  <line
                    x1={pad.left}
                    y1={yScale(activePointVal)}
                    x2={width - pad.right}
                    y2={yScale(activePointVal)}
                    className="stroke-slate-400 dark:stroke-slate-500"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                </g>
              )}

            {/* Data points */}
            {filteredPoints.map(({ el, val }) => {
              const cx = xScale(el.number);
              const cy = yScale(val);
              const isSelected = el.number === selectedElement.number;
              const isHovered = hoveredEl?.number === el.number;
              const swatch = CATEGORY_META[el.category].swatch;

              return (
                <g
                  key={el.number}
                  onMouseEnter={() => setHoveredEl(el)}
                  onMouseLeave={() => setHoveredEl(null)}
                  onClick={() => onSelectElement(el)}
                  className="cursor-pointer"
                >
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected || isHovered ? 6 : 3.5}
                    fill={swatch}
                    stroke="#ffffff"
                    strokeWidth={isSelected || isHovered ? 2 : 1}
                  />
                  {(isSelected || isHovered) && (
                    <text
                      x={cx}
                      y={cy - 10}
                      textAnchor="middle"
                      className="fill-slate-900 dark:fill-white text-[11px] font-mono font-bold"
                    >
                      {el.symbol}
                    </text>
                  )}
                </g>
              );
            })}

            {/* X axis label */}
            <text
              x={pad.left + plotW / 2}
              y={height - 10}
              textAnchor="middle"
              className="fill-slate-500 dark:fill-slate-400 text-[11px] font-medium"
            >
              Atom nömrəsi (Z)
            </text>
          </svg>
        </div>
      </section>
    </div>
  );
}
