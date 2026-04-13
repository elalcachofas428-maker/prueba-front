import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function CopyButton({ text, label = "Copiar" }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  return (
    <button
      className="btn btn-secondary btn-sm"
      style={copied ? { borderColor: 'var(--success)', color: 'var(--success)' } : {}}
      onClick={handleCopy}
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
      {copied ? '¡Copiado!' : label}
    </button>
  );
}
