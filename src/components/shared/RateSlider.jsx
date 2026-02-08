import React from 'react';

export default function RateSlider({ label, value, onChange, min = 0, max = 100, step = 0.1, color = 'text-slate-400', className = '' }) {
  return (
    <div className={className}>
      {label && <label className="block text-xs text-slate-400 mb-1">{label}</label>}
      <div className="flex gap-2 items-center">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 h-1.5 bg-slate-600 rounded-lg appearance-none cursor-pointer"
        />
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => {
            const val = Number(e.target.value);
            onChange(Math.max(min, Math.min(max, val)));
          }}
          className="w-16 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-xs"
        />
      </div>
    </div>
  );
}
