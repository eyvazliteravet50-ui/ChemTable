import { Search, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ChemicalElement } from '../types/element';
import { ACIDITY_META, CATEGORY_META, METAL_CLASS_META } from '../utils/propertyHelpers';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  elements: ChemicalElement[];
  onSelectElement: (el: ChemicalElement) => void;
}

export function SearchModal({
  isOpen,
  onClose,
  elements,
  onSelectElement,
}: SearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 20);
    }
  }, [isOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return elements.slice(0, 12);
    return elements
      .filter((el) => {
        const catLabel = CATEGORY_META[el.category].label.toLowerCase();
        const metalLabel = METAL_CLASS_META[el.metalClass].label.toLowerCase();
        const acidLabel = ACIDITY_META[el.oxideAcidity].label.toLowerCase();
        return (
          el.nameAz.toLowerCase().includes(q) ||
          el.nameLatin.toLowerCase().includes(q) ||
          el.symbol.toLowerCase().includes(q) ||
          String(el.number) === q ||
          catLabel.includes(q) ||
          metalLabel.includes(q) ||
          acidLabel.includes(q)
        );
      })
      .slice(0, 20);
  }, [query, elements]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-start justify-center pt-16 px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Element axtarışı"
    >
      <div
        className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Element adı, simvolu, nömrəsi və ya xassəsi (məs. Dəmir, Fe, 26, amfoter)..."
            className="flex-1 bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
            aria-label="Bağla"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto pt-scroll divide-y divide-slate-100 dark:divide-slate-800">
          {results.map((el) => {
            const cat = CATEGORY_META[el.category];
            const acid = ACIDITY_META[el.oxideAcidity];
            return (
              <button
                key={el.number}
                type="button"
                onClick={() => {
                  onSelectElement(el);
                  onClose();
                }}
                className="w-full px-4 py-2.5 flex items-center justify-between gap-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-9 h-9 rounded-md border flex items-center justify-center font-mono font-bold text-sm shrink-0 ${cat.bgLight} ${cat.bgDark} ${cat.border} ${cat.text}`}
                  >
                    {el.symbol}
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {el.number}. {el.nameAz}{' '}
                      <span className="font-normal text-xs text-slate-400 italic">
                        {el.nameLatin}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {cat.label} · {acid.label}
                    </div>
                  </div>
                </div>

                <div className="text-right text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400 shrink-0">
                  <div>{el.atomicRadius ?? '—'} pm</div>
                  <div>{el.ionizationEnergy ?? '—'} kJ</div>
                </div>
              </button>
            );
          })}

          {results.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-500 dark:text-slate-400">
              Uyğun element tapılmadı.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
