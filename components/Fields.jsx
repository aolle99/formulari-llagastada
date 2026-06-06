'use client';

import { ALERGIES } from '@/lib/schema';
import { Check } from 'lucide-react';

export function TextField({ field, value, onChange }) {
  return (
    <div>
      <Label field={field} />
      <input
        type={field.type === 'email' ? 'email' : 'text'}
        value={value || ''}
        onChange={(e) => onChange(field.id, e.target.value)}
        placeholder={field.placeholder}
        className="input"
      />
    </div>
  );
}

export function SingleChoice({ field, value, onChange }) {
  return (
    <div>
      <Label field={field} />
      <div className="grid gap-2.5">
        {field.options.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(field.id, opt.value)}
              className={`choice text-left ${selected ? 'choice-selected' : ''}`}
            >
              {opt.emoji && <span className="text-xl leading-none">{opt.emoji}</span>}
              <span className="flex-1 text-ash-900 font-medium">{opt.label}</span>
              <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                ${selected ? 'bg-brand-500 border-brand-500' : 'border-ash-300'}`}>
                {selected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function MultiChoice({ field, value, onChange }) {
  const sel = Array.isArray(value) ? value : [];
  const toggle = (v) => {
    const next = sel.includes(v) ? sel.filter((x) => x !== v) : [...sel, v];
    onChange(field.id, next);
  };
  return (
    <div>
      <Label field={field} />
      <div className="grid gap-2.5">
        {field.options.map((opt) => {
          const selected = sel.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggle(opt.value)}
              className={`choice text-left ${selected ? 'choice-selected' : ''}`}
            >
              <span className="flex-1 text-ash-900 font-medium">{opt.label}</span>
              <span className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all
                ${selected ? 'bg-brand-500 border-brand-500' : 'border-ash-300'}`}>
                {selected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Allergies({ field, value, onChange }) {
  const sel = value && typeof value === 'object' ? value : { list: [], altres: '' };
  const list = sel.list || [];
  const altres = sel.altres || '';
  const toggle = (v) => {
    let next;
    if (v === 'No') {
      next = list.includes('No') ? [] : ['No'];
    } else {
      next = list.includes(v) ? list.filter((x) => x !== v) : [...list.filter((x) => x !== 'No'), v];
    }
    onChange(field.id, { list: next, altres });
  };
  const setAltres = (txt) => onChange(field.id, { list, altres: txt });
  return (
    <div>
      <Label field={field} />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
        {['No', ...ALERGIES].map((a) => {
          const selected = list.includes(a);
          return (
            <button
              key={a}
              type="button"
              onClick={() => toggle(a)}
              className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all
                ${selected
                  ? 'border-brand-500 bg-brand-500 text-white'
                  : 'border-ash-200 bg-white text-ash-700 hover:border-brand-300 hover:bg-brand-50/30'}`}
            >
              {a}
            </button>
          );
        })}
      </div>
      <input
        type="text"
        value={altres}
        onChange={(e) => setAltres(e.target.value)}
        placeholder="Altres (opcional)"
        className="input text-sm"
      />
    </div>
  );
}

export function NumberPicker({ field, value, onChange }) {
  return (
    <div>
      <Label field={field} />
      <div className="grid grid-cols-4 gap-2">
        {field.options.map((label, i) => {
          const v = i === 0 ? '0' : String(i);
          const selected = value === v;
          return (
            <button
              key={v}
              type="button"
              onClick={() => onChange(field.id, v)}
              className={`px-3 py-3 rounded-xl border-2 font-semibold text-sm transition-all
                ${selected
                  ? 'border-brand-500 bg-brand-500 text-white shadow-brand'
                  : 'border-ash-200 bg-white text-ash-800 hover:border-brand-300 hover:bg-brand-50/30'}`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ProfileCards({ value, onChange }) {
  const profiles = [
    {
      v: 'adult', icon: '🧑‍🚒', title: 'Membre adult',
      desc: 'Sóc membre de la Colla adulta i NO tinc fills/es a Polls Folls.',
    },
    {
      v: 'infant', icon: '🧒', title: 'Infant Polls Folls',
      desc: 'Estic apuntant un infant. Si en tinc dos, ompliré el formulari dues vegades.',
    },
    {
      v: 'pare', icon: '👨‍👩‍👧', title: 'Pare/mare PF (no membre adult)',
      desc: 'Tinc un fill/a a Polls Folls, però JO no sóc membre de la Colla adulta.',
    },
    {
      v: 'pare_adult', icon: '🔥', title: 'Pare/mare PF + membre adult',
      desc: 'Sóc membre adult I a més tinc un fill/a a Polls Folls. En un sol enviament cobrim tot.',
    },
  ];
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {profiles.map((p) => {
        const selected = value === p.v;
        return (
          <button
            key={p.v}
            type="button"
            onClick={() => onChange('profile', p.v)}
            className={`relative text-left p-5 rounded-2xl border-2 transition-all
              ${selected
                ? 'border-brand-500 bg-gradient-to-br from-brand-50 to-white shadow-brand'
                : 'border-ash-200 bg-white hover:border-brand-300 hover:shadow-card'}`}
          >
            <div className="flex items-start gap-3">
              <div className="text-3xl">{p.icon}</div>
              <div className="flex-1">
                <div className="font-bold text-ash-900 mb-1">{p.title}</div>
                <div className="text-sm text-ash-600 leading-relaxed">{p.desc}</div>
              </div>
              {selected && (
                <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function Label({ field }) {
  return (
    <div className="mb-3">
      <div className="font-semibold text-ash-900 mb-1">
        {field.label}
        {field.required && <span className="text-brand-500 ml-1">*</span>}
      </div>
      {field.hint && <div className="text-sm text-ash-500 leading-relaxed">{field.hint}</div>}
    </div>
  );
}

export function FieldRenderer({ field, value, onChange }) {
  switch (field.type) {
    case 'text':
    case 'email':
      return <TextField field={field} value={value} onChange={onChange} />;
    case 'single':
      return <SingleChoice field={field} value={value} onChange={onChange} />;
    case 'multi':
      return <MultiChoice field={field} value={value} onChange={onChange} />;
    case 'allergies':
      return <Allergies field={field} value={value} onChange={onChange} />;
    case 'number-picker':
      return <NumberPicker field={field} value={value} onChange={onChange} />;
    case 'profile-cards':
      return <ProfileCards value={value} onChange={onChange} />;
    default:
      return null;
  }
}
