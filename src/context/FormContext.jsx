import React, { createContext, useContext, useState, useEffect } from 'react';

const FormContext = createContext();

const initialFormData = {
  // Paso 1
  tipoPropiedad: '',
  operacion: '',
  pais: '',
  idioma: '',
  ciudad: '',
  direccion: '',
  
  // Paso 2
  moneda: '$ USD',
  precio: '',
  recamaras: 0,
  banos: 0,
  superficieConstruida: '',
  superficieTerreno: '',
  estacionamientos: 0,
  pisosNiveles: 1,

  // Paso 3
  amenidades: [],
  otrasAmenidades: '',
  notasAdicionales: '',

  // Paso 4
  tipoVideo: '', // 'reel' o 'tour'
  voiceover: false,
  voz: '', // 'femenina' o 'masculina'
  tono: '', // 'profesional', 'lujo', 'energetico'
  contextoAdicional: '',

  // Paso 5 (Se llena tras el fetch a /api/generar-guion)
  escenas: [], // Array de { id, nombre, texto, icono, fotoUrl }

  // Paso 6
  portadaUrl: null, // foto principal
  fotosRecorrido: [], // Array de fotos ordenadas
  formatosExtras: {
    instagramStory: false,
    carruselInstagram: false
  },

  // Paso 7
  agenteNombre: '',
  agenteTelefono: '',
  agenteEmail: '',
  agenciaNombre: ''
};

export const FormProvider = ({ children }) => {
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('subzeroFormData');
    return saved ? JSON.parse(saved) : initialFormData;
  });

  const [currentStep, setCurrentStep] = useState(() => {
    const savedStep = localStorage.getItem('subzeroCurrentStep');
    return savedStep ? parseInt(savedStep, 10) : 1;
  });

  useEffect(() => {
    localStorage.setItem('subzeroFormData', JSON.stringify(formData));
    // Save draft if it's not the initial form
    if (formData.tipoPropiedad || formData.ciudad || formData.precio) {
      localStorage.setItem('subzero_draft', JSON.stringify({ ...formData, incompleto: true }));
    }
  }, [formData]);

  useEffect(() => {
    localStorage.setItem('subzeroCurrentStep', currentStep.toString());
  }, [currentStep]);

  const updateFormData = (data) => {
    setFormData(prev => {
      const updated = typeof data === 'function' ? data(prev) : { ...prev, ...data };
      // Resetear escenas si cambia tipoVideo
      if (typeof data === 'object' && data.tipoVideo && data.tipoVideo !== prev.tipoVideo) {
        updated.escenas = [];
      }
      return updated;
    });
  };

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);
  const goToStep = (step) => setCurrentStep(step);
  
  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentStep(1);
    localStorage.removeItem('subzeroFormData');
    localStorage.removeItem('subzeroCurrentStep');
  };

  return (
    <FormContext.Provider value={{ 
      formData, 
      updateFormData, 
      currentStep, 
      nextStep, 
      prevStep, 
      goToStep,
      resetForm 
    }}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => useContext(FormContext);
