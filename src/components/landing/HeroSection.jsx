import { Link } from 'react-router-dom'

export default function HeroSection() {
  return (
    <section id="inicio" className="relative pt-48 pb-32 px-8 overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary-container/10 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary-container/10 rounded-full blur-[120px] -z-10"></div>
      <div className="max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-highest border border-white/5 mb-8">
          <span className="w-2 h-2 rounded-full bg-primary-container shadow-[0_0_10px_#00D4FF]"></span>
          <span className="text-xs font-label uppercase tracking-widest text-primary">✦ Generación con IA</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-headline leading-[1.1] tracking-tight mb-8">
          Convertí cualquier producto en <span className="text-gradient">contenido que atrae clientes</span>
        </h1>
        <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto mb-12">
          Automatizá tu marketing inmobiliario con inteligencia artificial. Crea materiales de venta premium en segundos, sin complicaciones.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
          <Link to="/register" className="px-8 py-4 bg-primary-container text-on-primary-fixed-variant rounded-full font-label uppercase tracking-widest text-sm font-bold shadow-lg shadow-cyan-500/20 hover:scale-95 transition-transform">
            Empezar gratis
          </Link>
          <a href="#como-funciona" className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-full font-label uppercase tracking-widest text-sm border border-white/10 transition-all">
            Ver cómo funciona
          </a>
        </div>
        <div className="flex flex-col items-center gap-4">
          <div className="flex -space-x-3">
            {['A','M','C','S'].map((l, i) => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-surface bg-surface-container-high flex items-center justify-center text-xs font-bold text-primary">{l}</div>
            ))}
          </div>
          <p className="text-sm text-slate-500 font-label uppercase tracking-widest">Más de 500 negocios ya confían en nosotros</p>
          <div className="flex gap-1 text-yellow-400 text-sm">★★★★★ <span className="text-slate-400 ml-1">4.9/5</span></div>
        </div>
      </div>
      <div className="mt-24 relative max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 px-4">
        {[
          { label: 'PDF Brochure', rotate: '-rotate-3', labelColor: 'text-primary', aspect: 'aspect-[3/4]' },
          { label: 'Instagram Post', rotate: 'translate-y-8', labelColor: 'text-secondary', aspect: 'aspect-square' },
          { label: 'Reel / Video IA', rotate: '-translate-y-4', labelColor: 'text-primary', aspect: 'aspect-[9/16]' },
          { label: 'Carrusel', rotate: 'rotate-6', labelColor: 'text-secondary', aspect: 'aspect-square' },
        ].map((item, i) => (
          <div key={i} className={`bg-surface-container glow-border rounded-xl p-4 transform ${item.rotate} hover:rotate-0 hover:translate-y-0 transition-transform duration-500 backdrop-blur-xl bg-opacity-40`}>
            <div className={`w-full ${item.aspect} rounded-lg bg-surface-container-high mb-3 flex items-center justify-center`}>
              <span className="material-symbols-outlined text-primary/30 text-5xl">image</span>
            </div>
            <p className={`text-xs font-label uppercase tracking-widest ${item.labelColor}`}>{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
