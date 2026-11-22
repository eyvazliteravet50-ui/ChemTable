import { Search } from 'lucide-react';
import { MainView } from '../types/element';

interface TopBarProps {
  activeView: MainView;
  onSelectView: (view: MainView) => void;
  onOpenSearch: () => void;
}

const NAV_ITEMS: { id: MainView; label: string }[] = [
  { id: 'table', label: 'Cədvəl' },
  { id: 'trends', label: 'Qrafiklər' },
  { id: 'compare', label: 'Müqayisə' },
  { id: 'database', label: 'Məlumat Bazası' },
];

export function TopBar({ activeView, onSelectView, onOpenSearch }: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark (single text element) */}
        <button
          type="button"
          onClick={() => onSelectView('table')}
          className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-600 cursor-pointer"
        >
          Dövri Sistem
        </button>

        {/* Zone 2: 4 concise single-line navigation links */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Əsas bölmələr">
          {NAV_ITEMS.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectView(item.id)}
                className={`relative py-1 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-600 ${
                  isActive
                    ? 'text-sky-700 dark:text-sky-400'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute left-0 right-0 -bottom-[17px] h-0.5 bg-sky-600 dark:bg-sky-400" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenSearch}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-white bg-slate-900 dark:bg-sky-600 hover:bg-slate-800 dark:hover:bg-sky-500 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
          >
            <Search className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Element Axtar</span>
          </button>
        </div>
      </div>

      {/* Mobile secondary nav strip */}
      <div className="md:hidden border-t border-slate-200 dark:border-slate-800 px-4 py-1.5 flex items-center gap-4 overflow-x-auto pt-scroll">
        {NAV_ITEMS.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectView(item.id)}
              className={`py-1 text-xs font-medium whitespace-nowrap shrink-0 ${
                isActive
                  ? 'text-sky-700 dark:text-sky-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}
