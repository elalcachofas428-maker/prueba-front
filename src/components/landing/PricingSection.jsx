import { Link } from 'react-router-dom'

const plans = [
  {
    name: 'Free', price: '$0', period: '/mes',
    features: ['10 Propiedades / mes', 'Formatos básicos'],
    cta: 'Empezar', ctaLink: '/register', highlight: false,
  },
  {
    name: 'Starter', price: '$34.000', period: '/mes',
    features: ['40 Propiedades / mes', 'Sin marcas de agua', 'Soporte vía email'],
    cta: 'Elegir Starter', ctaLink: '/register', highlight: false,
  },
  {
    name: 'Pro', price: '$70.000', period: '/mes',
    features: ['150 Propiedades / mes', 'Video IA incluido', 'Programación en redes', 'Soporte prioritario'],
    cta: 'Elegir Pro', ctaLink: '/register', highlight: true,
  },
  {
    name: 'Scale', price: '$143.000', period: '/mes',
    features: ['Propiedades ilimitadas', 'API Access', 'Branding personalizado'],
    cta: 'Elegir Scale', ctaLink: '/register', highlight: false,
  },
]

export default function PricingSection() {
  return (
    <section id="precios" className="py-32 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-headline mb-6 tracking-tight">Planes que escalan con vos</h2>
          <p className="text-slate-400">Sin contratos, cancelá cuando quieras.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((p, i) => (
            <div key={i} className={`p-8 rounded-2xl flex flex-col glow-border relative overflow-hidden ${p.highlight ? 'bg-surface-container-high ring-2 ring-primary-container/20 shadow-2xl shadow-cyan-500/10 scale-105 z-10' : 'bg-surface-container'}`}>
              {p.highlight && (
                <div className="absolute top-0 right-0 bg-primary-container text-on-primary-fixed-variant px-3 py-1 text-[10px] font-label uppercase font-bold rounded-bl-xl">Más popular</div>
              )}
              <h4 className={`text-sm font-label uppercase tracking-widest mb-4 ${p.highlight ? 'text-primary' : 'opacity-60'}`}>{p.name}</h4>
              <div className="text-3xl font-headline mb-6">{p.price}<span className="text-lg opacity-40">{p.period}</span></div>
              <ul className="space-y-4 mb-8 flex-grow">
                {p.features.map((f, j) => (
                  <li key={j} className={`flex items-center gap-3 text-sm ${p.highlight ? 'text-slate-200 font-medium' : 'text-slate-400'}`}>
                    <span className="material-symbols-outlined text-primary text-lg">check</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link to={p.ctaLink} className={`w-full py-3 rounded-full text-xs font-label uppercase tracking-widest text-center transition-all ${p.highlight ? 'bg-primary-container text-on-primary-fixed-variant font-bold hover:opacity-90' : 'border border-white/10 hover:bg-white/5'}`}>
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
