import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFormContext } from '../context/FormContext';
import { ChevronLeft, X } from 'lucide-react';

import Step01 from '../components/steps/Step01';
import Step02 from '../components/steps/Step02';
import Step03 from '../components/steps/Step03';
import Step04 from '../components/steps/Step04';
import Step05 from '../components/steps/Step05';
import Step06 from '../components/steps/Step06';
import Step07 from '../components/steps/Step07';

const STEPS = [
  { number: 1, label: 'Producto' },
  { number: 2, label: 'Precio' },
  { number: 3, label: 'Amenidades' },
  { number: 4, label: 'Video' },
  { number: 5, label: 'Guión' },
  { number: 6, label: 'Fotos' },
  { number: 7, label: 'Contacto' },
];

export default function NuevoPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { formData, updateFormData, resetForm } = useFormContext();
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    // Solo resetear si NO hay borrador guardado
    const draft = localStorage.getItem('subzero_draft');
    const draftStep = localStorage.getItem('subzeroCurrentStep');
    if (!draft && !draftStep) {
      resetForm();
    }
  }, []);

  // Si viene con prefill de plantilla o query param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const plantilla = params.get('plantilla');

    if (plantilla) {
      resetForm();
      const prefills = {
        inmobiliaria: { tipoPropiedad: 'Inmueble', tono: 'acogedor', tipoVideo: 'tour' },
        ecommerce:    { tipoPropiedad: 'Producto', tono: 'comercial', tipoVideo: 'reel' },
        servicios:    { tipoPropiedad: 'Consultoría', tono: 'profesional', tipoVideo: 'tour' },
        reel:         { tipoPropiedad: 'Producto', tono: 'energetico', tipoVideo: 'reel' }
      };
      if (prefills[plantilla]) updateFormData(prefills[plantilla]);
    } else if (location.state?.prefill) {
      resetForm();
      updateFormData(location.state.prefill);
    }

    if (location.state?.fromDraft) {
      const draft = JSON.parse(localStorage.getItem('subzero_draft') || 'null');
      if (draft) {
        updateFormData(draft);
        setCurrentStep(draft._paso || 1);
      }
    }
  }, [location.search, location.state]);

  // Guardar borrador en cada cambio
  useEffect(() => {
    if (currentStep > 1) {
      localStorage.setItem('subzero_draft', JSON.stringify({ ...formData, incompleto: true, _paso: currentStep }));
    }
  }, [formData, currentStep]);

  const goNext = () => {
    if (currentStep < 7) setCurrentStep(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goPrev = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSalir = () => {
    navigate('/dashboard');
  };

  const handleGenerarListado = () => {
    localStorage.removeItem('subzero_draft');
    navigate('/resultados');
  };

  const pct = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  const stepComponents = {
    1: <Step01 onNext={goNext} />,
    2: <Step02 onNext={goNext} onPrev={goPrev} />,
    3: <Step03 onNext={goNext} onPrev={goPrev} />,
    4: <Step04 onNext={goNext} onPrev={goPrev} />,
    5: <Step05 onNext={goNext} onPrev={goPrev} />,
    6: <Step06 onNext={goNext} onPrev={goPrev} />,
    7: <Step07 onPrev={goPrev} onGenerar={handleGenerarListado} />,
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>

      {/* Header del wizard */}
      <div style={{
        position: 'sticky', top: 60, zIndex: 100,
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        {/* Barra de progreso */}
        <div className="wizard-progress-bar">
          <div className="wizard-progress-fill" style={{ width: `${pct}%` }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', padding: '0 40px', height: 56 }}>
          {/* Volver */}
          <button className="btn btn-ghost btn-sm" onClick={currentStep === 1 ? handleSalir : goPrev}
            style={{ gap: 6, color: 'var(--text-secondary)', marginRight: 16 }}>
            <ChevronLeft size={16} />
            {currentStep === 1 ? 'Salir' : 'Volver'}
          </button>

          {/* Steps indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, justifyContent: 'center', overflowX: 'auto' }}>
            {STEPS.map((step, i) => {
              const isActive    = step.number === currentStep;
              const isCompleted = step.number < currentStep;
              return (
                <div key={step.number} style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: isActive ? '4px 12px' : '4px 8px',
                    borderRadius: 'var(--radius-full)',
                    background: isActive ? 'var(--accent-dim)' : 'transparent',
                    border: isActive ? '1px solid var(--border-accent)' : '1px solid transparent',
                    transition: 'all 0.2s ease',
                  }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, fontFamily: 'DM Sans', fontWeight: 600,
                      background: isActive ? 'var(--accent)' : isCompleted ? 'var(--success)' : 'var(--bg-card)',
                      color: isActive ? '#070B14' : isCompleted ? '#070B14' : 'var(--text-tertiary)',
                      border: !isActive && !isCompleted ? '1px solid var(--border-subtle)' : 'none',
                      transition: 'all 0.2s ease',
                    }}>
                      {isCompleted ? '✓' : step.number}
                    </div>
                    {isActive && (
                      <span style={{ fontFamily: 'DM Sans', fontSize: 12, color: 'var(--accent)', fontWeight: 500 }}>
                        {step.label}
                      </span>
                    )}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div style={{ width: 16, height: 1, background: isCompleted ? 'var(--success)' : 'var(--border-subtle)', transition: 'background 0.3s' }} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Salir */}
          <button className="btn-icon" onClick={handleSalir} style={{ marginLeft: 16 }}>
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Contenido del paso */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px 80px' }}>
        <div className="animate-fade-in-up" key={currentStep}>
          {stepComponents[currentStep]}
        </div>
      </div>
    </div>
  );
}
