import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, PlusCircle, X } from 'lucide-react';

const DynamicComboBox = ({ 
  storageKey, 
  value, 
  onChange, 
  defaultOptions = [], 
  placeholder = "Selecciona o escribe...",
  formatAs = "text" // "text" | "number"
}) => {
  const [options, setOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const containerRef = useRef(null);

  // Inicializar opciones sumando default y las guardadas
  useEffect(() => {
    const saved = localStorage.getItem(`subzero_combo_${storageKey}`);
    const userOptions = saved ? JSON.parse(saved) : [];
    
    // Unir sin duplicados
    const merged = [...new Set([...defaultOptions, ...userOptions])];
    setOptions(merged);
  }, [storageKey, defaultOptions]);

  // Sincronizar value externo
  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  // Click outside para cerrar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatValue = (rawText) => {
    if (!rawText) return '';
    if (formatAs === 'number') {
      const numericString = rawText.toString().replace(/\D/g, '');
      if (numericString === '') return '';
      return Number(numericString).toLocaleString('en-US');
    }
    return rawText;
  };

  const handleInputChange = (e) => {
    const text = e.target.value;
    const formatted = formatValue(text);
    
    setInputValue(formatted);
    onChange(formatted);
    if (!isOpen) setIsOpen(true);
  };

  const handleSelectOption = (opt) => {
    const formatted = formatValue(opt);
    setInputValue(formatted);
    onChange(formatted);
    setIsOpen(false);
  };

  const handleSaveCurrentAsOption = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!inputValue || inputValue.trim() === '') return;
    
    const trimmed = inputValue.trim();
    if (!options.includes(trimmed)) {
      const newOptions = [...options, trimmed];
      setOptions(newOptions);
      
      const saved = localStorage.getItem(`subzero_combo_${storageKey}`);
      const userOptions = saved ? JSON.parse(saved) : [];
      localStorage.setItem(`subzero_combo_${storageKey}`, JSON.stringify([...userOptions, trimmed]));
    }
    setIsOpen(false);
  };

  const handleRemoveOption = (e, optToRemove) => {
    e.stopPropagation();
    e.preventDefault();

    const newOptions = options.filter(o => o !== optToRemove);
    setOptions(newOptions);
    
    const saved = localStorage.getItem(`subzero_combo_${storageKey}`);
    if (saved) {
      let userOptions = JSON.parse(saved);
      userOptions = userOptions.filter(o => o !== optToRemove);
      localStorage.setItem(`subzero_combo_${storageKey}`, JSON.stringify(userOptions));
    }
  };

  const isCurrentValueNew = inputValue && inputValue.trim() !== '' && !options.includes(inputValue.trim());
  
  const normalizedInput = formatAs === 'number' ? inputValue.toString().replace(/\D/g, '') : String(inputValue || '').toLowerCase();
  
  const filteredOptions = options.filter(o => {
    const normalizedOption = formatAs === 'number' ? o.toString().replace(/\D/g, '') : String(o).toLowerCase();
    return normalizedOption.includes(normalizedInput);
  });

  return (
    <div style={{ position: 'relative', width: '100%' }} ref={containerRef}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input 
          type="text" 
          className="input-base"
          style={{ paddingRight: '40px' }}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
        />
        <ChevronDown 
          size={16} 
          style={{ 
            position: 'absolute', right: '14px', color: 'var(--text-secondary)', 
            pointerEvents: 'none', transition: 'transform 0.2s ease',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
          }} 
        />
      </div>

      {isOpen && (
        <div className="combo-dropdown animate-fade-in">
          {isCurrentValueNew && (
            <div 
              className="combo-dropdown-item" 
              style={{ color: 'var(--accent)', fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}
              onClick={handleSaveCurrentAsOption}
            >
              <span>"{inputValue}" (Nuevo)</span>
              <span style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', textTransform: 'uppercase' }}>
                 <PlusCircle size={14} /> Guardar
              </span>
            </div>
          )}
          
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt, i) => (
              <div 
                key={i} 
                className={`combo-dropdown-item ${formatValue(opt) === inputValue ? 'active' : ''}`}
                onClick={() => handleSelectOption(opt)}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <span>{formatAs === 'number' ? formatValue(opt) : opt}</span>
                <button
                  type="button"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    padding: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onClick={(e) => handleRemoveOption(e, opt)}
                  title="Eliminar opción"
                >
                  <X size={14} />
                </button>
              </div>
            ))
          ) : (
            !isCurrentValueNew && <div className="combo-dropdown-item" style={{ color: 'var(--text-hints)', fontStyle: 'italic' }}>Sin coincidencias</div>
          )}
        </div>
      )}
    </div>
  );
};

export default DynamicComboBox;
