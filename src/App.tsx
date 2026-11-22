import { useEffect, useState } from 'react';
import { CompareView } from './components/CompareView';
import { DatabaseTableView } from './components/DatabaseTableView';
import { ElementInspector } from './components/ElementInspector';
import { PeriodicTableGrid } from './components/PeriodicTableGrid';
import { ActiveFilter, PropertyToolbar } from './components/PropertyToolbar';
import { SearchModal } from './components/SearchModal';
import { TopBar } from './components/TopBar';
import { TrendChartsView } from './components/TrendChartsView';
import { ELEMENTS } from './data/elements';
import { ChemicalElement, MainView, PropertyMode, TempUnit } from './types/element';

export default function App() {
  const [activeView, setActiveView] = useState<MainView>('table');
  const [mode, setMode] = useState<PropertyMode>('category');
  const [filter, setFilter] = useState<ActiveFilter>({});
  const [selectedNumber, setSelectedNumber] = useState<number>(26); // Dəmir (Fe)
  const [compareIds, setCompareIds] = useState<number[]>([11, 17]); // Na vs Cl
  const [tempUnit, setTempUnit] = useState<TempUnit>('C');
  const [activeTempK, setActiveTempK] = useState<number>(298);
  const [isDark, setIsDark] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  const selectedElement =
    ELEMENTS.find((e) => e.number === selectedNumber) ?? ELEMENTS[0];

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  // Global keyboard shortcut: Cmd/Ctrl + K for search
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleSelectElement = (el: ChemicalElement) => {
    setSelectedNumber(el.number);
  };

  const handleToggleCompare = (num: number) => {
    setCompareIds((prev) => {
      if (prev.includes(num)) {
        if (prev.length <= 1) return prev;
        return prev.filter((id) => id !== num);
      }
      if (prev.length >= 2) {
        return [prev[1], num];
      }
      return [...prev, num];
    });
  };

  const handleInspectAndGoToTable = (el: ChemicalElement) => {
    setSelectedNumber(el.number);
    setActiveView('table');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <TopBar
        activeView={activeView}
        onSelectView={setActiveView}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 py-4 sm:py-5 space-y-4">
        {activeView === 'table' && (
          <>
            <PropertyToolbar
              mode={mode}
              onChangeMode={setMode}
              filter={filter}
              onChangeFilter={setFilter}
              tempUnit={tempUnit}
              onToggleTempUnit={() =>
                setTempUnit((u) => (u === 'C' ? 'K' : 'C'))
              }
              activeTempK={activeTempK}
              onChangeTempK={setActiveTempK}
              isDark={isDark}
              onToggleDark={() => setIsDark((d) => !d)}
            />

            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_390px] gap-4 items-start">
              <PeriodicTableGrid
                elements={ELEMENTS}
                selectedElement={selectedElement}
                onSelectElement={handleSelectElement}
                compareIds={compareIds}
                mode={mode}
                filter={filter}
                onChangeFilter={setFilter}
                tempUnit={tempUnit}
                activeTempK={activeTempK}
                isDark={isDark}
              />

              <ElementInspector
                element={selectedElement}
                onSelectByNumber={(n) => {
                  const target = ELEMENTS.find((e) => e.number === n);
                  if (target) setSelectedNumber(target.number);
                }}
                onSelectMode={(nextMode) => {
                  setMode(nextMode);
                  setFilter({});
                }}
                compareIds={compareIds}
                onToggleCompare={handleToggleCompare}
                tempUnit={tempUnit}
              />
            </div>
          </>
        )}

        {activeView === 'trends' && (
          <TrendChartsView
            elements={ELEMENTS}
            selectedElement={selectedElement}
            onSelectElement={handleInspectAndGoToTable}
            tempUnit={tempUnit}
          />
        )}

        {activeView === 'compare' && (
          <CompareView
            elements={ELEMENTS}
            compareIds={compareIds}
            onChangeCompareIds={setCompareIds}
            onInspectElement={handleInspectAndGoToTable}
            tempUnit={tempUnit}
          />
        )}

        {activeView === 'database' && (
          <DatabaseTableView
            elements={ELEMENTS}
            onInspectElement={handleInspectAndGoToTable}
            tempUnit={tempUnit}
          />
        )}
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-3 px-4 sm:px-6">
        <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>Dövri Sistem · 118 Kimyəvi Element</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveView('trends')}
              className="hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer"
            >
              Dövri qrafiklər
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setActiveView('compare')}
              className="hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer"
            >
              Element müqayisəsi ({compareIds.length}/2)
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setTempUnit((u) => (u === 'C' ? 'K' : 'C'))}
              className="hover:text-slate-900 dark:hover:text-slate-200 font-mono cursor-pointer"
            >
              Vahid: °{tempUnit}
            </button>
          </div>
        </div>
      </footer>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        elements={ELEMENTS}
        onSelectElement={handleInspectAndGoToTable}
      />
    </div>
  );
}
