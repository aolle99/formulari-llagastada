'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Send, AlertCircle, CheckCircle2, Flame } from 'lucide-react';
import { STEPS, visibleSteps } from '@/lib/schema';
import { FieldRenderer } from './Fields';
import ProgressBar from './ProgressBar';

export default function Wizard() {
  const [state, setState] = useState({});
  const [stepIndex, setStepIndex] = useState(0);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [errorMessage, setErrorMessage] = useState('');

  const profile = state.profile;

  // Llista dinàmica de passos visibles
  const steps = useMemo(() => {
    if (!profile && stepIndex === 0) return [STEPS[0]]; // només el primer abans d'escollir perfil
    return visibleSteps(profile, state);
  }, [profile, state, stepIndex]);

  const current = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;
  const isFirst = stepIndex === 0;

  const setValue = (key, val) => {
    setState((prev) => ({ ...prev, [key]: val }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const validateCurrent = () => {
    const errs = {};
    (current.fields || []).forEach((f) => {
      // Validacions condicionals
      if (f.showIf && !f.showIf({ ...state, profile })) return;
      if (f.required) {
        const v = state[f.id];
        if (v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0)) {
          errs[f.id] = 'Aquest camp és obligatori';
        }
      }
      // E-mail bàsic
      if (f.type === 'email' && state[f.id]) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state[f.id])) {
          errs[f.id] = 'Format d\'email no vàlid';
        }
      }
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => {
    if (!validateCurrent()) return;
    if (isLast) {
      submit();
    } else {
      setStepIndex((i) => i + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prev = () => {
    if (isFirst) return;
    setStepIndex((i) => Math.max(0, i - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submit = async () => {
    setStatus('submitting');
    setErrorMessage('');
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...state, _ts: new Date().toISOString() }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Error desconegut');
      setStatus('success');
    } catch (e) {
      setStatus('error');
      setErrorMessage(e.message || 'No s\'ha pogut enviar el formulari');
    }
  };

  if (status === 'success') return <SuccessScreen onAddAnother={resetForAnother(setState, setStepIndex, setStatus, state)} />;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <ProgressBar current={Math.min(stepIndex + 1, steps.length)} total={steps.length} />

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.25 }}
          className="mt-6"
        >
          <div className="card p-6 sm:p-8">
            <StepHeader step={current} />

            <div className="space-y-7 mt-2">
              {current.fields.map((f) => {
                if (f.showIf && !f.showIf({ ...state, profile })) return null;
                return (
                  <div key={f.id}>
                    <FieldRenderer
                      field={f}
                      value={state[f.id]}
                      onChange={setValue}
                    />
                    {errors[f.id] && (
                      <div className="mt-2 flex items-center gap-1.5 text-sm text-red-600">
                        <AlertCircle className="w-4 h-4" /> {errors[f.id]}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              onClick={prev}
              disabled={isFirst}
              className="btn-ghost disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" /> Anterior
            </button>

            <button
              type="button"
              onClick={next}
              disabled={status === 'submitting'}
              className="btn-primary"
            >
              {status === 'submitting' ? (
                <>
                  <Flame className="w-4 h-4 animate-pulse" />
                  Enviant...
                </>
              ) : isLast ? (
                <>
                  <Send className="w-4 h-4" /> Enviar inscripció
                </>
              ) : (
                <>
                  Següent <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {status === 'error' && (
            <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold mb-0.5">No s'ha pogut enviar el formulari</div>
                  <div className="text-red-700">{errorMessage}</div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function StepHeader({ step }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="text-3xl">{step.icon}</div>
        <div>
          <h2 className="text-2xl font-bold text-ash-900 leading-tight">{step.title}</h2>
          {step.date && (
            <div className="chip mt-1.5">📅 {step.date}</div>
          )}
        </div>
      </div>
      {step.subtitle && (
        <p className="text-ash-600 leading-relaxed">{step.subtitle}</p>
      )}
    </div>
  );
}

function SuccessScreen({ onAddAnother }) {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="card p-8 sm:p-10 text-center"
      >
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-brand">
          <CheckCircle2 className="w-12 h-12 text-white" strokeWidth={2} />
        </div>
        <h2 className="text-3xl font-bold text-ash-900 mb-3">Inscripció rebuda! 🔥</h2>
        <p className="text-ash-600 text-lg mb-8 leading-relaxed">
          Gràcies per apuntar-te a La Llagastada.<br />
          Ens veiem cremant pel poble.
        </p>
        <div className="space-y-2 text-sm text-ash-500 mb-8">
          <p>Si tens un altre infant a Polls Folls, pots afegir-lo ara mateix.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={onAddAnother} className="btn-secondary">
            ➕ Apuntar un altre infant
          </button>
          <button onClick={() => window.location.reload()} className="btn-primary">
            Tornar a començar
          </button>
        </div>
        <p className="mt-8 text-xs text-ash-400 italic">Salut i foc 🔥</p>
      </motion.div>
    </div>
  );
}

function resetForAnother(setState, setStepIndex, setStatus, prevState) {
  return () => {
    // Mantenim tutor 1, tutor 2, intoleràncies dels tutors per facilitar el segon infant
    const preserved = {
      profile: 'infant',
      tutor1_name: prevState.tutor1_name,
      tutor1_alergies: prevState.tutor1_alergies,
      tutor2_name: prevState.tutor2_name,
      tutor2_alergies: prevState.tutor2_alergies,
      primer_familia: 'no', // ja contestat abans
    };
    setState(preserved);
    setStepIndex(0);
    setStatus('idle');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
}
