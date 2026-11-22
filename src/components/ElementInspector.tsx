import { ArrowLeftRight, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { ChemicalElement, PropertyMode, TempUnit } from '../types/element';
import {
  ACIDITY_META,
  CATEGORY_META,
  METAL_CLASS_META,
  STATE_META,
  formatTemp,
  normalizeNumericRatio,
} from '../utils/propertyHelpers';

type InspectorTab = 'atom' | 'energy' | 'acidity' | 'physical';

interface ElementInspectorProps {
  element: ChemicalElement;
  onSelectByNumber: (num: number) => void;
  onSelectMode: (mode: PropertyMode) => void;
  compareIds: number[];
  onToggleCompare: (num: number) => void;
  tempUnit: TempUnit;
}

const SHELL_NAMES = ['K', 'L', 'M', 'N', 'O', 'P', 'Q'];

export function ElementInspector({
  element,
  onSelectByNumber,
  onSelectMode,
  compareIds,
  onToggleCompare,
  tempUnit,
}: ElementInspectorProps) {
  const [activeTab, setActiveTab] = useState<InspectorTab>('atom');
  const [selectedShellIdx, setSelectedShellIdx] = useState<number | null>(null);

  const catMeta = CATEGORY_META[element.category];
  const metalMeta = METAL_CLASS_META[element.metalClass];
  const acidMeta = ACIDITY_META[element.oxideAcidity];
  const stateMeta = STATE_META[element.stateAtSTP];
  const isInCompare = compareIds.includes(element.number);

  const radiusRatio = normalizeNumericRatio(element.atomicRadius, 'atomic-radius');
  const ionizationRatio = normalizeNumericRatio(element.ionizationEnergy, 'ionization-energy');
  const enRatio = normalizeNumericRatio(element.electronegativity, 'electronegativity');
  const affinityRatio = normalizeNumericRatio(element.electronAffinity, 'electron-affinity');
  const densityRatio = normalizeNumericRatio(element.density, 'density');

  const tabs: { id: InspectorTab; label: string }[] = [
    { id: 'atom', label: 'Atom & Elektron' },
    { id: 'energy', label: 'Enerji & Radius' },
    { id: 'acidity', label: 'Turşuluq & Metal' },
    { id: 'physical', label: 'Fiziki & Tarix' },
  ];

  // Calculate Bohr model radii inside 180x180 SVG
  const shellCount = element.shells.length;
  const maxR = 76;
  const minR = 20;

  return (
    <aside className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col gap-4">
      {/* Header: Symbol Tile + Name + Clean Unboxed Metadata */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3.5 min-w-0">
          <div
            className={`w-16 h-16 rounded-lg border flex flex-col items-center justify-center shrink-0 ${catMeta.bgLight} ${catMeta.bgDark} ${catMeta.border} ${catMeta.text}`}
          >
            <span className="text-[10px] font-mono tabular-nums leading-none opacity-80">
              {element.number}
            </span>
            <span className="text-2xl font-bold leading-tight tracking-tight">
              {element.symbol}
            </span>
            <span className="text-[9px] font-mono tabular-nums leading-none opacity-80">
              {element.atomicMass}
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex items-baseline gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
                {element.nameAz}
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400 italic">
                {element.nameLatin}
              </span>
            </div>

            {/* Zero-pill clean unboxed metadata */}
            <div className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-slate-600 dark:text-slate-400">
              <span className="font-medium text-slate-800 dark:text-slate-200">{catMeta.label}</span>
              <span aria-hidden="true">·</span>
              <span>{metalMeta.label}</span>
              <span aria-hidden="true">·</span>
              <span>{stateMeta.label} (298 K)</span>
            </div>

            <div className="mt-0.5 flex items-center gap-1.5 text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
              <span>Dövr {element.period}</span>
              <span aria-hidden="true">/</span>
              <span>Qrup {element.group}</span>
              <span aria-hidden="true">/</span>
              <span>{element.block}-blok</span>
            </div>
          </div>
        </div>

        {/* Prev / Next Navigation */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            disabled={element.number <= 1}
            onClick={() => onSelectByNumber(element.number - 1)}
            className="p-1.5 rounded-md border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed"
            aria-label="Əvvəlki element"
            title="Əvvəlki element"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            disabled={element.number >= 118}
            onClick={() => onSelectByNumber(element.number + 1)}
            className="p-1.5 rounded-md border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed"
            aria-label="Növbəti element"
            title="Növbəti element"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Summary & Compare Action */}
      <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
        {element.summaryAz}
      </p>

      <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={() => onToggleCompare(element.number)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
            isInCompare
              ? 'bg-sky-600 text-white border-sky-600'
              : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <ArrowLeftRight className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{isInCompare ? 'Müqayisədədir' : 'Müqayisəyə əlavə et'}</span>
        </button>

        <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
          Oksidləşmə: {element.oxidationStates}
        </span>
      </div>

      {/* Clickable Property Category Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg">
        {tabs.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap truncate ${
                active
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Atom & Electron Configuration + Interactive Bohr Model */}
      {activeTab === 'atom' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center gap-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-lg p-3">
            <svg
              viewBox="0 0 180 180"
              className="w-36 h-36 shrink-0"
              role="img"
              aria-label={`${element.nameAz} elektron təbəqələri`}
            >
              {/* Nucleus */}
              <circle
                cx="90"
                cy="90"
                r="11"
                className="fill-slate-900 dark:fill-sky-500"
              />
              <text
                x="90"
                y="93.5"
                textAnchor="middle"
                className="fill-white text-[9px] font-mono font-bold"
              >
                {element.number}+
              </text>

              {/* Shells */}
              {element.shells.map((electronCount, idx) => {
                const r =
                  shellCount === 1
                    ? 46
                    : minR + ((maxR - minR) * (idx + 1)) / shellCount;
                const isShellSelected = selectedShellIdx === idx;
                const dotsToDraw = Math.min(electronCount, 32);

                return (
                  <g
                    key={`shell-${idx}`}
                    onClick={() =>
                      setSelectedShellIdx(isShellSelected ? null : idx)
                    }
                    className="cursor-pointer"
                  >
                    <circle
                      cx="90"
                      cy="90"
                      r={r}
                      fill="none"
                      strokeWidth={isShellSelected ? 2 : 1}
                      className={
                        isShellSelected
                          ? 'stroke-sky-600 dark:stroke-sky-400'
                          : 'stroke-slate-300 dark:stroke-slate-700 hover:stroke-sky-500'
                      }
                    />
                    {Array.from({ length: dotsToDraw }).map((_, eIdx) => {
                      const angle = (2 * Math.PI * eIdx) / dotsToDraw - Math.PI / 2;
                      const cx = 90 + r * Math.cos(angle);
                      const cy = 90 + r * Math.sin(angle);
                      return (
                        <circle
                          key={`e-${idx}-${eIdx}`}
                          cx={cx}
                          cy={cy}
                          r={isShellSelected ? 3.2 : 2.3}
                          className={
                            isShellSelected
                              ? 'fill-sky-600 dark:fill-sky-400'
                              : idx === shellCount - 1
                              ? 'fill-amber-500 dark:fill-amber-400'
                              : 'fill-slate-600 dark:fill-slate-400'
                          }
                        />
                      );
                    })}
                  </g>
                );
              })}
            </svg>

            <div className="flex-1 w-full space-y-2">
              <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Elektron təbəqələri (klikləyin)
              </div>
              <div className="flex flex-wrap gap-1.5">
                {element.shells.map((cnt, idx) => {
                  const active = selectedShellIdx === idx;
                  const maxCap = 2 * (idx + 1) * (idx + 1);
                  return (
                    <button
                      key={`btn-shell-${idx}`}
                      type="button"
                      onClick={() => setSelectedShellIdx(active ? null : idx)}
                      className={`px-2 py-1 text-xs font-mono tabular-nums rounded border transition-colors cursor-pointer ${
                        active
                          ? 'bg-sky-600 text-white border-sky-600'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-sky-400'
                      }`}
                      title={`Maksimum tutum: ${maxCap}`}
                    >
                      {SHELL_NAMES[idx]}: {cnt}
                    </button>
                  );
                })}
              </div>
              {selectedShellIdx !== null ? (
                <p className="text-xs text-sky-700 dark:text-sky-400 font-mono tabular-nums">
                  {SHELL_NAMES[selectedShellIdx]} təbəqəsi (n={selectedShellIdx + 1}):{' '}
                  {element.shells[selectedShellIdx]} /{' '}
                  {2 * (selectedShellIdx + 1) * (selectedShellIdx + 1)} elektron
                </p>
              ) : (
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Xarici valens təbəqəsi ({SHELL_NAMES[shellCount - 1]}) sarı rənglə işarələnib.
                </p>
              )}
            </div>
          </div>

          <dl className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            <div className="py-2 flex items-center justify-between gap-2">
              <dt className="text-slate-500 dark:text-slate-400">Elektron konfiqurasiyası</dt>
              <dd className="font-mono font-medium text-slate-900 dark:text-slate-100">
                {element.electronConfig}
              </dd>
            </div>
            <div className="py-2 flex items-center justify-between gap-2">
              <dt className="text-slate-500 dark:text-slate-400">Atom kütləsi</dt>
              <dd className="font-mono tabular-nums font-medium text-slate-900 dark:text-slate-100">
                {element.atomicMass} q/mol
              </dd>
            </div>
            <div className="py-2 flex items-center justify-between gap-2">
              <dt className="text-slate-500 dark:text-slate-400">Proton / Elektron sayı</dt>
              <dd className="font-mono tabular-nums font-medium text-slate-900 dark:text-slate-100">
                {element.number} p⁺ · {element.number} e⁻
              </dd>
            </div>
            <div className="py-2 flex items-center justify-between gap-2">
              <dt className="text-slate-500 dark:text-slate-400">Orbital bloku</dt>
              <dd>
                <button
                  type="button"
                  onClick={() => onSelectMode('block')}
                  className="inline-flex items-center gap-1 font-mono font-medium text-sky-700 dark:text-sky-400 hover:underline cursor-pointer"
                >
                  <span>{element.block}-blok</span>
                  <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </button>
              </dd>
            </div>
          </dl>
        </div>
      )}

      {/* Tab 2: Energy, Radius & Electronegativity (Clickable to switch map mode!) */}
      {activeTab === 'energy' && (
        <div className="space-y-3">
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            İstənilən xüsusiyyətə klikləyərək bütün dövri cədvəl üzrə paylanmasını xəritələyin.
          </p>

          {/* Atomic Radius */}
          <button
            type="button"
            onClick={() => onSelectMode('atomic-radius')}
            className="w-full text-left p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-600 transition-colors cursor-pointer space-y-1.5"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700 dark:text-slate-300">
                Atom radiusu
              </span>
              <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100">
                {element.atomicRadius !== null ? `${element.atomicRadius} pm` : '—'}
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-600 dark:bg-sky-400 rounded-full"
                style={{ width: `${(radiusRatio ?? 0) * 100}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono tabular-nums">
              <span>Kovalent radius: {element.covalentRadius ?? '—'} pm</span>
              <span className="text-sky-600 dark:text-sky-400">Cədvəldə göstər</span>
            </div>
          </button>

          {/* Ionization Energy */}
          <button
            type="button"
            onClick={() => onSelectMode('ionization-energy')}
            className="w-full text-left p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-600 transition-colors cursor-pointer space-y-1.5"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700 dark:text-slate-300">
                1-ci İonlaşma enerjisi
              </span>
              <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100">
                {element.ionizationEnergy !== null
                  ? `${element.ionizationEnergy.toFixed(1)} kJ/mol`
                  : '—'}
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-600 dark:bg-amber-400 rounded-full"
                style={{ width: `${(ionizationRatio ?? 0) * 100}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono tabular-nums">
              <span>
                {element.ionizationEnergy !== null
                  ? `≈ ${(element.ionizationEnergy / 96.485).toFixed(2)} eV`
                  : '—'}
              </span>
              <span className="text-sky-600 dark:text-sky-400">Cədvəldə göstər</span>
            </div>
          </button>

          {/* Electronegativity */}
          <button
            type="button"
            onClick={() => onSelectMode('electronegativity')}
            className="w-full text-left p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-600 transition-colors cursor-pointer space-y-1.5"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700 dark:text-slate-300">
                Elektron mənfilik (Pauling)
              </span>
              <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100">
                {element.electronegativity !== null
                  ? element.electronegativity.toFixed(2)
                  : 'Təyin olunmayıb'}
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-600 dark:bg-rose-400 rounded-full"
                style={{ width: `${(enRatio ?? 0) * 100}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>Şkala: 0.70 (Fr) – 3.98 (F)</span>
              <span className="text-sky-600 dark:text-sky-400 font-mono">Cədvəldə göstər</span>
            </div>
          </button>

          {/* Electron Affinity */}
          <button
            type="button"
            onClick={() => onSelectMode('electron-affinity')}
            className="w-full text-left p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-600 transition-colors cursor-pointer space-y-1.5"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700 dark:text-slate-300">
                Elektron qohumluğu enerjisi
              </span>
              <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100">
                {element.electronAffinity !== null
                  ? `${element.electronAffinity.toFixed(1)} kJ/mol`
                  : '—'}
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 dark:bg-emerald-400 rounded-full"
                style={{ width: `${(affinityRatio ?? 0) * 100}%` }}
              />
            </div>
          </button>
        </div>
      )}

      {/* Tab 3: Acidity & Metal / Non-metal Classification */}
      {activeTab === 'acidity' && (
        <div className="space-y-3.5">
          {/* Metal / Non-metal block */}
          <button
            type="button"
            onClick={() => onSelectMode('metal-class')}
            className="w-full text-left p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-sky-400 transition-colors cursor-pointer space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Metal / Qeyri-metal təsnifatı
              </span>
              <span className="text-xs font-semibold text-sky-700 dark:text-sky-400">
                Xəritədə göstər
              </span>
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {metalMeta.label}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {metalMeta.description}
            </p>
          </button>

          {/* Oxide Acidity Spectrum */}
          <button
            type="button"
            onClick={() => onSelectMode('acidity')}
            className="w-full text-left p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-sky-400 transition-colors cursor-pointer space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Oksid və hidroksid turşuluğu
              </span>
              <span className="text-xs font-semibold text-sky-700 dark:text-sky-400">
                Xəritədə göstər
              </span>
            </div>

            <div className="flex items-baseline justify-between gap-2">
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {acidMeta.label}
              </span>
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                Oksid: {element.oxideFormula}
              </span>
            </div>

            {/* 6-step Basic -> Amphoteric -> Acidic Bar */}
            <div className="grid grid-cols-6 gap-1 pt-1" aria-hidden="true">
              {[
                { rank: 1, color: 'bg-blue-600', name: 'Q.Ə' },
                { rank: 2, color: 'bg-sky-500', name: 'Ə' },
                { rank: 3, color: 'bg-emerald-500', name: 'Amf' },
                { rank: 4, color: 'bg-amber-500', name: 'Z.T' },
                { rank: 5, color: 'bg-orange-600', name: 'T' },
                { rank: 6, color: 'bg-rose-600', name: 'Q.T' },
              ].map((step) => {
                const isCurrent = acidMeta.rank === step.rank;
                return (
                  <div key={step.rank} className="space-y-1 text-center">
                    <div
                      className={`h-2 rounded-xs ${step.color} ${
                        isCurrent ? 'ring-2 ring-slate-900 dark:ring-white opacity-100' : 'opacity-30'
                      }`}
                    />
                    <span
                      className={`block text-[9px] font-mono ${
                        isCurrent
                          ? 'font-bold text-slate-900 dark:text-white'
                          : 'text-slate-400'
                      }`}
                    >
                      {step.name}
                    </span>
                  </div>
                );
              })}
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              {acidMeta.note}
            </p>
          </button>

          <dl className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            <div className="py-2 flex items-center justify-between gap-2">
              <dt className="text-slate-500 dark:text-slate-400">Oksidləşmə dərəcələri</dt>
              <dd className="font-mono font-medium text-slate-900 dark:text-slate-100">
                {element.oxidationStates}
              </dd>
            </div>
            <div className="py-2 flex items-center justify-between gap-2">
              <dt className="text-slate-500 dark:text-slate-400">Kimyəvi ailə</dt>
              <dd className="font-medium text-slate-900 dark:text-slate-100">
                {catMeta.label}
              </dd>
            </div>
          </dl>
        </div>
      )}

      {/* Tab 4: Physical Properties, Thermodynamics & Discovery */}
      {activeTab === 'physical' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onSelectMode('melting-point')}
              className="text-left p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-sky-400 transition-colors cursor-pointer"
            >
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Ərimə temp.</div>
              <div className="text-sm font-mono tabular-nums font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                {formatTemp(element.meltingPointK, tempUnit)}
              </div>
            </button>

            <button
              type="button"
              onClick={() => onSelectMode('boiling-point')}
              className="text-left p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-sky-400 transition-colors cursor-pointer"
            >
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Qaynama temp.</div>
              <div className="text-sm font-mono tabular-nums font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                {formatTemp(element.boilingPointK, tempUnit)}
              </div>
            </button>
          </div>

          <button
            type="button"
            onClick={() => onSelectMode('density')}
            className="w-full text-left p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-sky-400 transition-colors cursor-pointer space-y-1.5"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700 dark:text-slate-300">Sıxlıq (STP)</span>
              <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100">
                {element.density !== null ? `${element.density} q/sm³` : '—'}
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-600 dark:bg-teal-400 rounded-full"
                style={{ width: `${(densityRatio ?? 0) * 100}%` }}
              />
            </div>
          </button>

          <dl className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            <div className="py-2 flex items-center justify-between gap-2">
              <dt className="text-slate-500 dark:text-slate-400">Aqreqat halı (298 K)</dt>
              <dd>
                <button
                  type="button"
                  onClick={() => onSelectMode('state-temperature')}
                  className="font-medium text-sky-700 dark:text-sky-400 hover:underline cursor-pointer"
                >
                  {stateMeta.label}
                </button>
              </dd>
            </div>
            <div className="py-2 flex items-center justify-between gap-2">
              <dt className="text-slate-500 dark:text-slate-400">Kristal qəfəs</dt>
              <dd className="font-medium text-slate-900 dark:text-slate-100 text-right">
                {element.crystalStructure}
              </dd>
            </div>
            <div className="py-2 flex items-center justify-between gap-2">
              <dt className="text-slate-500 dark:text-slate-400">Yer qabığında yayılması</dt>
              <dd className="font-mono tabular-nums font-medium text-slate-900 dark:text-slate-100">
                {element.abundanceCrust}
              </dd>
            </div>
            <div className="py-2 flex items-center justify-between gap-2">
              <dt className="text-slate-500 dark:text-slate-400">Kəşf ili</dt>
              <dd className="font-mono tabular-nums font-medium text-slate-900 dark:text-slate-100">
                {element.discoveryYear}
              </dd>
            </div>
            <div className="py-2 flex items-start justify-between gap-2">
              <dt className="text-slate-500 dark:text-slate-400 shrink-0">Kəşf edən</dt>
              <dd className="font-medium text-slate-900 dark:text-slate-100 text-right">
                {element.discoverer}
              </dd>
            </div>
          </dl>
        </div>
      )}
    </aside>
  );
}
