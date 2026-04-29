import React, { useState, useMemo } from 'react';
import { Calendar, Clock, ArrowDown, Plus, Minus, RotateCcw } from 'lucide-react';
import { ToolHeader, FeaturesSection } from './ToolLayout';

// ── helpers ──────────────────────────────────────────────────────────────────

const today = () => new Date().toISOString().split('T')[0];

const dateDiff = (d1, d2) => {
  const a = new Date(d1);
  const b = new Date(d2);
  const msPerDay = 1000 * 60 * 60 * 24;
  const totalDays = Math.round((b - a) / msPerDay);

  // Calculate years, months, days
  let start = new Date(a < b ? a : b);
  let end   = new Date(a < b ? b : a);

  let years  = end.getFullYear() - start.getFullYear();
  let months = end.getMonth()    - start.getMonth();
  let days   = end.getDate()     - start.getDate();

  if (days < 0) {
    months--;
    days += new Date(end.getFullYear(), end.getMonth(), 0).getDate();
  }
  if (months < 0) { years--; months += 12; }

  const weeks   = Math.floor(Math.abs(totalDays) / 7);
  const hours   = Math.abs(totalDays) * 24;
  const minutes = hours * 60;
  const past    = totalDays < 0;

  return { totalDays: Math.abs(totalDays), years, months, days, weeks, hours, minutes, past };
};

const addToDate = (baseDate, amount, unit) => {
  const d = new Date(baseDate);
  if (unit === 'days')   d.setDate(d.getDate() + amount);
  if (unit === 'weeks')  d.setDate(d.getDate() + amount * 7);
  if (unit === 'months') d.setMonth(d.getMonth() + amount);
  if (unit === 'years')  d.setFullYear(d.getFullYear() + amount);
  return d.toISOString().split('T')[0];
};

const formatDate = (str) => {
  if (!str) return '—';
  return new Date(str + 'T12:00:00').toLocaleDateString('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });
};

const WEEKDAY_ES = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];

const getDayName = (str) => {
  if (!str) return null;
  return WEEKDAY_ES[new Date(str + 'T12:00:00').getDay()];
};

const UNIT_LABELS = ['days','weeks','months','years'];
const UNIT_ES     = { days: 'Días', weeks: 'Semanas', months: 'Meses', years: 'Años' };

const TABS = [
  { id: 'diff',  label: 'Diferencia entre fechas' },
  { id: 'add',   label: 'Sumar / Restar tiempo'   },
];

// ── sub-components ────────────────────────────────────────────────────────────

const StatBox = ({ label, value, accent }) => (
  <div className={`rounded-2xl border p-4 text-center shadow-sm transition-all
    ${accent ? 'border-studio-primary/30 bg-studio-primary/5' : 'border-gray-100 bg-white'}`}>
    <span className={`block text-2xl font-black tabular-nums leading-none mb-1
      ${accent ? 'text-studio-primary' : 'text-gray-800'}`}>
      {value.toLocaleString()}
    </span>
    <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">{label}</span>
  </div>
);

// ── main component ────────────────────────────────────────────────────────────

const DateCalculator = () => {
  const [tab,   setTab]   = useState('diff');
  const [date1, setDate1] = useState(today());
  const [date2, setDate2] = useState('');

  // Add/subtract mode
  const [baseDate,  setBaseDate]  = useState(today());
  const [amount,    setAmount]    = useState(30);
  const [unit,      setUnit]      = useState('days');
  const [operation, setOperation] = useState('add'); // 'add' | 'sub'

  const diff = useMemo(() => {
    if (!date1 || !date2) return null;
    return dateDiff(date1, date2);
  }, [date1, date2]);

  const resultDate = useMemo(() => {
    if (!baseDate || !amount) return null;
    const n = operation === 'sub' ? -Number(amount) : Number(amount);
    return addToDate(baseDate, n, unit);
  }, [baseDate, amount, unit, operation]);

  const swapDates = () => { setDate1(date2 || today()); setDate2(date1); };

  return (
    <div className="pt-32 min-h-screen bg-studio-bg">
      <ToolHeader
        title="Date"
        accent="Calculator"
        subtitle="Calcula la diferencia entre fechas o suma y resta tiempo de forma precisa."
      />

      <div className="max-w-2xl mx-auto px-6 mb-16 space-y-5">

        {/* Tab switcher */}
        <div className="flex gap-2 p-1 bg-white rounded-2xl border border-gray-100 shadow-sm">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-wide transition-all
                ${tab === t.id ? 'bg-studio-primary text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── TAB: DIFFERENCE ── */}
        {tab === 'diff' && (
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-7 space-y-5">

            {/* Date inputs */}
            <div className="space-y-3">
              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">Fecha de inicio</label>
                <div className="relative">
                  <input type="date" value={date1} onChange={e => setDate1(e.target.value)}
                    className="w-full bg-studio-bg rounded-xl p-4 text-sm font-bold text-gray-700 border-none focus:ring-2 focus:ring-studio-primary outline-none" />
                </div>
              </div>

              {/* Swap button */}
              <div className="flex justify-center">
                <button onClick={swapDates}
                  className="w-9 h-9 rounded-xl bg-studio-bg text-studio-primary flex items-center justify-center hover:bg-studio-primary hover:text-white transition-all active:scale-90 shadow-sm">
                  <ArrowDown size={16} />
                </button>
              </div>

              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">Fecha de fin</label>
                <div className="relative">
                  <input type="date" value={date2} onChange={e => setDate2(e.target.value)}
                    className="w-full bg-studio-bg rounded-xl p-4 text-sm font-bold text-gray-700 border-none focus:ring-2 focus:ring-studio-primary outline-none" />
                </div>
              </div>
            </div>

            {/* Quick fill buttons */}
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Hoy → +7d',    fn: () => { setDate1(today()); setDate2(addToDate(today(), 7, 'days')); }},
                { label: 'Hoy → +30d',   fn: () => { setDate1(today()); setDate2(addToDate(today(), 30, 'days')); }},
                { label: 'Hoy → +1 año', fn: () => { setDate1(today()); setDate2(addToDate(today(), 1, 'years')); }},
                { label: 'Limpiar',       fn: () => { setDate1(today()); setDate2(''); }, danger: true },
              ].map(({ label, fn, danger }) => (
                <button key={label} onClick={fn}
                  className={`px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all
                    ${danger ? 'border-gray-100 text-gray-300 hover:text-red-400 hover:border-red-100' : 'border-gray-100 text-gray-400 hover:border-studio-primary hover:text-studio-primary bg-studio-bg'}`}>
                  {label}
                </button>
              ))}
            </div>

            {/* Result */}
            {diff ? (
              <div className="space-y-4">
                {/* Hero number */}
                <div className={`rounded-2xl p-6 text-center ${diff.past ? 'bg-violet-50' : 'bg-studio-primary/5'}`}>
                  <p className="text-[9px] font-black uppercase tracking-widest mb-2 text-gray-400">
                    {diff.past ? 'Hace' : 'Faltan'}
                  </p>
                  <p className={`text-5xl font-black italic tracking-tighter leading-none ${diff.past ? 'text-violet-500' : 'text-studio-primary'}`}>
                    {diff.totalDays.toLocaleString()}
                    <span className="text-2xl ml-2">días</span>
                  </p>
                  {(diff.years > 0 || diff.months > 0) && (
                    <p className="text-xs font-bold text-gray-500 mt-3">
                      {diff.years > 0 && `${diff.years} año${diff.years !== 1 ? 's' : ''}, `}
                      {diff.months > 0 && `${diff.months} mes${diff.months !== 1 ? 'es' : ''} y `}
                      {diff.days} día{diff.days !== 1 ? 's' : ''}
                    </p>
                  )}
                  <p className="text-[9px] text-gray-400 font-medium mt-1 italic">
                    {formatDate(date1)} → {formatDate(date2)}
                  </p>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-3">
                  <StatBox label="Semanas"  value={diff.weeks}   accent />
                  <StatBox label="Días"     value={diff.totalDays} />
                  <StatBox label="Horas"    value={diff.hours}   />
                  <StatBox label="Minutos"  value={diff.minutes} />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center py-8 gap-3">
                <Calendar size={36} className="text-gray-200" />
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest text-center">
                  Selecciona ambas fechas para ver la diferencia
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── TAB: ADD / SUBTRACT ── */}
        {tab === 'add' && (
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-7 space-y-5">

            <div>
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">Fecha base</label>
              <div className="relative">
                <input type="date" value={baseDate} onChange={e => setBaseDate(e.target.value)}
                  className="w-full bg-studio-bg rounded-xl p-4 text-sm font-bold text-gray-700 border-none focus:ring-2 focus:ring-studio-primary outline-none" />
                {baseDate && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-studio-primary uppercase tracking-wide">
                    {getDayName(baseDate)}
                  </span>
                )}
              </div>
            </div>

            {/* Operation toggle */}
            <div>
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">Operación</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'add', label: 'Sumar', icon: <Plus size={14} /> },
                  { id: 'sub', label: 'Restar', icon: <Minus size={14} /> },
                ].map(op => (
                  <button key={op.id} onClick={() => setOperation(op.id)}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-[9px] font-black uppercase tracking-wide transition-all
                      ${operation === op.id ? 'border-studio-primary bg-studio-primary/5 text-studio-primary' : 'border-gray-100 text-gray-400 hover:border-studio-primary/30'}`}>
                    {op.icon} {op.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount + Unit */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">Cantidad</label>
                <div className="flex items-center gap-2 bg-studio-bg rounded-xl px-3 py-2.5">
                  <button onClick={() => setAmount(a => Math.max(1, Number(a) - 1))}
                    className="w-7 h-7 rounded-lg bg-white text-gray-500 font-black hover:text-studio-primary transition-colors shadow-sm flex items-center justify-center">
                    <Minus size={12} />
                  </button>
                  <input type="number" min="1" max="9999" value={amount}
                    onChange={e => setAmount(Math.max(1, Number(e.target.value)))}
                    className="flex-1 bg-transparent text-center font-black text-gray-700 text-sm border-none outline-none" />
                  <button onClick={() => setAmount(a => Number(a) + 1)}
                    className="w-7 h-7 rounded-lg bg-white text-gray-500 font-black hover:text-studio-primary transition-colors shadow-sm flex items-center justify-center">
                    <Plus size={12} />
                  </button>
                </div>
              </div>
              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">Unidad</label>
                <select value={unit} onChange={e => setUnit(e.target.value)}
                  className="w-full bg-studio-bg rounded-xl p-3.5 text-sm font-black text-gray-700 border-none focus:ring-2 focus:ring-studio-primary outline-none">
                  {UNIT_LABELS.map(u => <option key={u} value={u}>{UNIT_ES[u]}</option>)}
                </select>
              </div>
            </div>

            {/* Result */}
            {resultDate && (
              <div className="bg-studio-primary/5 border border-studio-primary/20 rounded-2xl p-6 text-center space-y-2">
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Resultado</p>
                <p className="text-2xl font-black text-studio-primary italic tracking-tight">
                  {formatDate(resultDate)}
                </p>
                <p className="text-xs font-bold text-gray-500">
                  {getDayName(resultDate)} · {resultDate}
                </p>
                <div className="pt-2 border-t border-studio-primary/10 text-[10px] text-gray-400 font-medium">
                  {formatDate(baseDate)} {operation === 'add' ? '+' : '−'} {amount} {UNIT_ES[unit].toLowerCase()}
                </div>
              </div>
            )}

          </div>
        )}

      </div>

      <FeaturesSection
        title="Cómo usar la calculadora"
        description="Calcula exactamente cuántos días, semanas, meses y años hay entre dos fechas, o descubre qué fecha caerá dentro de un tiempo determinado."
        steps={[
          'Para la diferencia: selecciona fecha de inicio y fin y ve el desglose completo.',
          'Para sumar/restar: elige una fecha base, la cantidad y la unidad de tiempo.',
          'Usa los atajos rápidos para calcular plazos comunes en segundos.',
        ]}
      />
    </div>
  );
};

export default DateCalculator;