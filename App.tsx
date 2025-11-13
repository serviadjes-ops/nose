
import React, { useState, useMemo, useCallback } from 'react';

// --- Helper Types ---
type Base = 2 | 8 | 10 | 16;

const baseOptions: { label: string; value: Base }[] = [
  { label: 'Binario', value: 2 },
  { label: 'Octal', value: 8 },
  { label: 'Hexadecimal', value: 16 },
];

const validationPatterns: Record<Base, RegExp> = {
  2: /^[01]+$/,
  8: /^[0-7]+$/,
  10: /^[0-9]+$/,
  16: /^[0-9a-fA-F]+$/,
};

// --- Helper Components (defined outside the main component to prevent re-creation on re-renders) ---

interface SectionTitleProps {
  children: React.ReactNode;
  icon: React.ReactNode;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ children, icon }) => (
  <div className="flex items-center gap-3 mb-5">
    <span className="text-indigo-400">{icon}</span>
    <h2 className="text-2xl font-bold text-slate-100 tracking-tight">{children}</h2>
  </div>
);

interface ResultRowProps {
  label: string;
  value: string;
  isError?: boolean;
}

const ResultRow: React.FC<ResultRowProps> = ({ label, value, isError = false }) => (
  <div className="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg">
    <span className="text-slate-400 font-medium">{label}</span>
    <span
      className={`font-mono text-lg break-all text-right ${
        isError ? 'text-red-400' : 'text-emerald-400'
      }`}
    >
      {value || '-'}
    </span>
  </div>
);

// --- Main Application Component ---

export default function App() {
  const [decimalInput, setDecimalInput] = useState<string>('123');
  const [otherInput, setOtherInput] = useState<string>('1111011');
  const [sourceBase, setSourceBase] = useState<Base>(2);

  const handleDecimalChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || validationPatterns[10].test(value)) {
      setDecimalInput(value);
    }
  }, []);

  const handleOtherInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    // Allow empty input, otherwise test against the pattern for the current base
    if (value === '' || validationPatterns[sourceBase].test(value)) {
        setOtherInput(value);
    }
  }, [sourceBase]);

  const decimalToOtherResults = useMemo(() => {
    if (decimalInput.trim() === '') {
      return { binary: '', octal: '', hexadecimal: '', error: null };
    }
    const num = parseInt(decimalInput, 10);
    if (isNaN(num)) {
      return { binary: '', octal: '', hexadecimal: '', error: 'Entrada no válida' };
    }
    if (num < 0) {
      return { binary: '', octal: '', hexadecimal: '', error: 'Solo números positivos' };
    }
    
    return {
      binary: num.toString(2),
      octal: num.toString(8),
      hexadecimal: num.toString(16).toUpperCase(),
      error: null,
    };
  }, [decimalInput]);

  const otherToDecimalResult = useMemo(() => {
    if (otherInput.trim() === '') {
      return { decimal: '', error: null };
    }

    if (!validationPatterns[sourceBase].test(otherInput)) {
        return { decimal: '', error: 'Caracteres no válidos para la base seleccionada' };
    }

    const num = parseInt(otherInput, sourceBase);
    
    if (isNaN(num)) {
        return { decimal: '', error: 'Número no válido' };
    }

    return {
      decimal: num.toString(10),
      error: null,
    };
  }, [otherInput, sourceBase]);
  
  const ArrowIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col items-center justify-center p-4 sm:p-6">
      <header className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
          Convertidor de Bases Numéricas
        </h1>
        <p className="mt-2 text-slate-400 max-w-2xl">
          Una herramienta sencilla para convertir números entre sistemas decimal, binario, octal y hexadecimal.
        </p>
      </header>
      
      <main className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Card 1: Decimal to Others */}
        <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700 shadow-2xl shadow-slate-900/50">
          <SectionTitle icon={<span className="font-bold text-2xl">10</span>}>
            Decimal a Otras Bases
          </SectionTitle>
          <div className="space-y-4">
            <label htmlFor="decimal-input" className="block text-sm font-medium text-slate-400">
              Número Decimal
            </label>
            <input
              id="decimal-input"
              type="text"
              value={decimalInput}
              onChange={handleDecimalChange}
              placeholder="Ej: 123"
              className="w-full bg-slate-900/70 border border-slate-600 rounded-lg p-3 text-lg font-mono text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
            <div className="space-y-3 pt-2">
              <ResultRow label="Binario" value={decimalToOtherResults.binary} isError={!!decimalToOtherResults.error} />
              <ResultRow label="Octal" value={decimalToOtherResults.octal} isError={!!decimalToOtherResults.error} />
              <ResultRow label="Hexadecimal" value={decimalToOtherResults.hexadecimal} isError={!!decimalToOtherResults.error} />
            </div>
          </div>
        </div>

        {/* Card 2: Others to Decimal */}
        <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700 shadow-2xl shadow-slate-900/50">
          <SectionTitle icon={<ArrowIcon />}>
            Otras Bases a Decimal
          </SectionTitle>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Base de Origen
              </label>
              <div className="grid grid-cols-3 gap-2 bg-slate-900/70 p-1 rounded-lg border border-slate-700">
                {baseOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => { setSourceBase(option.value); setOtherInput(''); }}
                    className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500 ${
                      sourceBase === option.value
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-300 hover:bg-slate-700/50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <label htmlFor="other-input" className="block text-sm font-medium text-slate-400">
              Número en Base {sourceBase}
            </label>
            <input
              id="other-input"
              type="text"
              value={otherInput}
              onChange={handleOtherInputChange}
              placeholder={sourceBase === 2 ? 'Ej: 101101' : sourceBase === 8 ? 'Ej: 155' : 'Ej: 6D'}
              className="w-full bg-slate-900/70 border border-slate-600 rounded-lg p-3 text-lg font-mono text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
             <div className="space-y-3 pt-2">
                <ResultRow label="Decimal" value={otherToDecimalResult.error || otherToDecimalResult.decimal} isError={!!otherToDecimalResult.error} />
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
