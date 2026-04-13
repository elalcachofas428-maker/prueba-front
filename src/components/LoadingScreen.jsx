import React, { useEffect, useState } from 'react';
import { useFormContext } from '../context/FormContext';
import { generarListado } from '../services/api';
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';

const LOADING_STEPS = [
  { id: 1, text: 'Generando textos con IA', icon: '✍️' },
  { id: 2, text: 'Creando PDF profesional', icon: '📄' },
  { id: 3, text: 'Diseñando publicaciones Instagram', icon: '📸' },
  { id: 4, text: 'Generando audio del voiceover', icon: '🎙️' },
  { id: 5, text: '¡Listo! Redirigiendo...', icon: '🚀' }
];

const LoadingScreen = () => {
  const { formData, nextStep, prevStep } = useFormContext();
  const [activeStep, setActiveStep] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const processListing = async () => {
       try {
         const promiseAPI = generarListado(formData);
         
         const advanceVisually = async () => {
            await new Promise(resolve => setTimeout(resolve, 1500));
            if (mounted) setActiveStep(2);
            await new Promise(resolve => setTimeout(resolve, 1500));
            if (mounted) setActiveStep(3);
            await new Promise(resolve => setTimeout(resolve, 1500));
            if (mounted) setActiveStep(4);
         };

         // Lanzar animación visual sin await
         advanceVisually();

         // Esperar a que el backend procese
         await promiseAPI;

         if (!mounted) return;
         setActiveStep(5);
         await new Promise(resolve => setTimeout(resolve, 800));
         if (mounted) nextStep();

       } catch (err) {
         console.error("Error al generar listado:", err);
         if (mounted) {
           setError("Tuvimos un problema generando tu listado. Revisá tu conexión e intentá de nuevo.");
         }
       }
    };

    processListing();

    return () => {
      mounted = false;
    };
  }, []);

  if (error) {
    return (
      <div className="animate-fade-in" style={{ 
        display: 'flex', flexDirection: 'column', alignItems: 'center', 
        justifyContent: 'center', minHeight: '600px', width: '100%',
        padding: '2rem', textAlign: 'center'
      }}>
        <div style={{ color: 'var(--error)', marginBottom: '1.5rem' }}>
          <AlertCircle size={48} />
        </div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--error)' }}>Ocurrió un error</h2>
        <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>{error}</p>
        <button className="btn btn-secondary" onClick={prevStep}>
          <span>&larr;</span> Volver al paso anterior
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ 
      display: 'flex', flexDirection: 'column', alignItems: 'center', 
      justifyContent: 'center', minHeight: '600px', width: '100%',
      padding: '2rem'
    }}>
      
      {/* BIG LOGO ANIMADO */}
      <div style={{
          width: '120px', height: '120px', 
          background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.2) 0%, transparent 100%)',
          border: '2px solid var(--accent)',
          borderRadius: '12px',
          boxShadow: '0 0 30px rgba(0,229,255,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '3rem', fontWeight: 900, color: '#fff',
          animation: 'pulseGlow 2s ease-in-out infinite',
          marginBottom: '3rem'
      }}>
        SZ
      </div>

      <div style={{ maxWidth: '400px', width: '100%' }}>
        {LOADING_STEPS.map((step) => {
          const isCompleted = activeStep > step.id;
          const isActive = activeStep === step.id;
          const isPending = activeStep < step.id;

          let color = 'var(--text-light)';
          if (isCompleted) color = 'var(--accent)';
          if (isActive) color = '#fff';

          return (
            <div 
              key={step.id} 
              style={{
                display: 'flex', alignItems: 'center', gap: '1rem', 
                marginBottom: '1.25rem',
                opacity: isPending ? 0.3 : 1,
                transform: isActive ? 'scale(1.05) translateX(10px)' : 'scale(1)',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ fontSize: '1.5rem', width: '30px' }}>
                {step.icon}
              </div>
              <div style={{ 
                color, 
                fontWeight: isActive || isCompleted ? 600 : 400,
                fontSize: '1.125rem'
              }}>
                {step.text}
              </div>
              <div style={{ marginLeft: 'auto', color: isCompleted ? 'var(--accent)' : 'var(--border)' }}>
                {isCompleted ? <CheckCircle2 size={24} /> : (isActive ? <div className="spinner-active" style={{width:'20px', height:'20px', border:'2px solid rgba(255,255,255,0.1)', borderTop:'2px solid #00c4d4', borderRadius:'50%'}}></div> : <Circle size={24} />)}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '4rem', color: 'var(--border)', fontSize: '0.875rem', textAlign: 'center' }}>
        El video se genera en segundo plano después de mostrar resultados.
      </div>
    </div>
  );
};

export default LoadingScreen;
