import { ArrowDown, ArrowUp, ArrowUpDown, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ChemicalElement, MetalClass, OxideAcidity, TempUnit } from '../types/element';
import {
  ACIDITY_META,
  CATEGORY_META,
  METAL_CLASS_META,
  formatTemp,
} from '../utils/propertyHelpers';

type SortField =
  | 'number'
  | 'nameAz'
  | 'atomicMassNum'
  | 'atomicRadius'
  | 'ionizationEnergy'
  | 'electronegativity'
  | 'meltingPointK'
  | 'density';

interface DatabaseTableViewProps {
  elements: ChemicalElement[];
  onInspectElement: (el: ChemicalElement) => void;
  tempUnit: TempUnit;
}

export function DatabaseTableView({
  elements,
  onInspectElement,
  tempUnit,
}: DatabaseTableViewProps) {
  const [query, setQuery] = useState('');
  const [metalFilter, setMetalFilter] = useState<MetalClass | 'all'>('all');
  const [acidityFilter, setAcidityFilter] = useState<OxideAcidity | 'all'>('all');
  const [sortField, setSortField] = useState<SortField>('number');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const filteredAndSorted = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = elements.filter((el) => {
      if (metalFilter !== 'all' && el.metalClass !== metalFilter) return false;
      if (acidityFilter !== 'all' && el.oxideAcidity !== acidityFilter) return false;
      if (!q) return true;
      return (
        el.nameAz.toLowerCase().includes(q) ||
        el.nameLatin.toLowerCase().includes(q) ||
        el.symbol.toLowerCase().includes(q) ||
        String(el.number) === q ||
        el.oxideFormula.toLowerCase().includes(q)
      );
    });

    list.sort((a, b) => {
      const av = a[sortField];
      const bv = b[sortField];
      if (av === null && bv === null) return 0;
      if (av === null) return 1;
      if (bv === null) return -1;
      if (typeof av === 'string' && typeof bv === 'string') {
        return sortDir === 'asc'
          ? av.localeCompare(bv, 'az')
          : bv.localeCompare(av, 'az');
      }
      return sortDir === 'asc'
        ? (av as number) - (bv as number)
        : (bv as number) - (av as number);
    });

    return list;
  }, [elements, query, metalFilter, acidityFilter, sortField, sortDir]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 opacity-40" aria-hidden="true" />;
    }
    return sortDir === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-sky-600 dark:text-sky-400" aria-hidden="true" />
    ) : (
      <ArrowDown className="w-3 h-3 text-sky-600 dark:text-sky-400" aria-hidden="true" />
    );
  };

  return (
    <div className="space-y-4">
      {/* Filter & Search Bar */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search
            className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
            aria-hidden="true"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ad, simvol, atom nömrəsi və ya oksid (məs. Al₂O₃)..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-2 focus:outline-sky-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            {(
              [
                { id: 'all', label: 'Hamısı (118)' },
                { id: 'metal', label: 'Metallar' },
                { id: 'metalloid', label: 'Yarımmetallar' },
                { id: 'nonmetal', label: 'Qeyri-metallar' },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setMetalFilter(item.id)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  metalFilter === item.id
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <select
            aria-label="Turşuluğa görə filtr"
            value={acidityFilter}
            onChange={(e) => setAcidityFilter(e.target.value as OxideAcidity | 'all')}
            className="px-3 py-1.5 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
          >
            <option value="all">Turşuluq: Hamısı</option>
            {(Object.keys(ACIDITY_META) as OxideAcidity[]).map((k) => (
              <option key={k} value={k}>
                {ACIDITY_META[k].label}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Sortable Table */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto pt-scroll">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300">
                <th className="py-3 px-3 font-semibold whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => handleSort('number')}
                    className="inline-flex items-center gap-1 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                  >
                    <span>Z</span>
                    <SortIcon field="number" />
                  </button>
                </th>
                <th className="py-3 px-3 font-semibold whitespace-nowrap">Simvol</th>
                <th className="py-3 px-3 font-semibold whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => handleSort('nameAz')}
                    className="inline-flex items-center gap-1 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                  >
                    <span>Element</span>
                    <SortIcon field="nameAz" />
                  </button>
                </th>
                <th className="py-3 px-3 font-semibold whitespace-nowrap">Təsnifat / Metal</th>
                <th className="py-3 px-3 font-semibold whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => handleSort('atomicMassNum')}
                    className="inline-flex items-center gap-1 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                  >
                    <span>Kütlə</span>
                    <SortIcon field="atomicMassNum" />
                  </button>
                </th>
                <th className="py-3 px-3 font-semibold whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => handleSort('atomicRadius')}
                    className="inline-flex items-center gap-1 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                  >
                    <span>Radius (pm)</span>
                    <SortIcon field="atomicRadius" />
                  </button>
                </th>
                <th className="py-3 px-3 font-semibold whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => handleSort('ionizationEnergy')}
                    className="inline-flex items-center gap-1 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                  >
                    <span>İonlaşma (kJ/mol)</span>
                    <SortIcon field="ionizationEnergy" />
                  </button>
                </th>
                <th className="py-3 px-3 font-semibold whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => handleSort('electronegativity')}
                    className="inline-flex items-center gap-1 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                  >
                    <span>E. mənfilik</span>
                    <SortIcon field="electronegativity" />
                  </button>
                </th>
                <th className="py-3 px-3 font-semibold whitespace-nowrap">Oksid / Turşuluq</th>
                <th className="py-3 px-3 font-semibold whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => handleSort('meltingPointK')}
                    className="inline-flex items-center gap-1 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                  >
                    <span>Ərimə</span>
                    <SortIcon field="meltingPointK" />
                  </button>
                </th>
                <th className="py-3 px-3 font-semibold whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => handleSort('density')}
                    className="inline-flex items-center gap-1 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                  >
                    <span>Sıxlıq (q/sm³)</span>
                    <SortIcon field="density" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredAndSorted.map((el) => {
                const cat = CATEGORY_META[el.category];
                const mc = METAL_CLASS_META[el.metalClass];
                const acid = ACIDITY_META[el.oxideAcidity];
                return (
                  <tr
                    key={el.number}
                    onClick={() => onInspectElement(el)}
                    className="hover:bg-sky-50/60 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                  >
                    <td className="py-2.5 px-3 font-mono tabular-nums text-slate-500 dark:text-slate-400">
                      {el.number}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-white">
                      {el.symbol}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap">
                      {el.nameAz}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      <span>{cat.shortLabel}</span>
                      <span className="mx-1 text-slate-400" aria-hidden="true">·</span>
                      <span className="text-slate-500 dark:text-slate-400">{mc.label}</span>
                    </td>
                    <td className="py-2.5 px-3 font-mono tabular-nums text-slate-800 dark:text-slate-200">
                      {el.atomicMass}
                    </td>
                    <td className="py-2.5 px-3 font-mono tabular-nums text-slate-800 dark:text-slate-200">
                      {el.atomicRadius ?? '—'}
                    </td>
                    <td className="py-2.5 px-3 font-mono tabular-nums text-slate-800 dark:text-slate-200">
                      {el.ionizationEnergy !== null ? el.ionizationEnergy.toFixed(1) : '—'}
                    </td>
                    <td className="py-2.5 px-3 font-mono tabular-nums text-slate-800 dark:text-slate-200">
                      {el.electronegativity !== null ? el.electronegativity.toFixed(2) : '—'}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap text-slate-700 dark:text-slate-300">
                      <span className="font-mono">{el.oxideFormula}</span>
                      <span className="mx-1 text-slate-400" aria-hidden="true">·</span>
                      <span>{acid.shortLabel}</span>
                    </td>
                    <td className="py-2.5 px-3 font-mono tabular-nums text-slate-800 dark:text-slate-200 whitespace-nowrap">
                      {formatTemp(el.meltingPointK, tempUnit)}
                    </td>
                    <td className="py-2.5 px-3 font-mono tabular-nums text-slate-800 dark:text-slate-200">
                      {el.density !== null ? el.density : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredAndSorted.length === 0 && (
            <div className="py-10 text-center text-sm text-slate-500 dark:text-slate-400">
              Axtarış şərtlərinə uyğun element tapılmadı.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
