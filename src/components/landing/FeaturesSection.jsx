const features = [
  { icon: 'psychology', title: 'Generación con IA', desc: 'Nuestra IA entiende el contexto de tu propiedad para escribir copys que realmente venden.' },
  { icon: 'layers', title: 'Multi-formato', desc: 'De un solo clic obtenés PDFs, posts, stories y videos listos para compartir.' },
  { icon: 'auto_awesome', title: 'Publicación automática', desc: 'Programá tus redes sociales directamente desde LeadBook sin salir de la app.' },
  { icon: 'bolt', title: 'Sin experiencia técnica', desc: 'No necesitás saber de diseño. El sistema hace el trabajo pesado por vos.' },
  { icon: 'timer', title: 'Listo en segundos', desc: 'Lo que antes tomaba horas de diseño ahora se resuelve en lo que tardás en tomar un café.' },
  { icon: 'dashboard', title: 'Para cualquier nicho', desc: 'Optimizado para inmobiliarias, pero flexible para cualquier tipo de producto físico.' },
]

export default function FeaturesSection() {
  return (
    <section id="funciones" className="py-32 px-8 bg-surface-container-lowest">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-headline mb-6 tracking-tight">Todo lo que necesitás en un solo lugar</h2>
          <p className="text-slate-400 max-w-xl mx-auto">Diseñado para ser veloz, preciso y por sobre todo, profesional.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="bg-surface-container p-10 rounded-2xl glow-border hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined text-primary-container text-4xl mb-6">{f.icon}</span>
              <h3 className="text-xl font-headline mb-4">{f.title}</h3>
              <p className="text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
