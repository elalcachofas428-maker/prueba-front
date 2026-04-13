const steps = [
  { n: '01', title: 'Cargás tu propiedad', desc: 'Subí fotos, descripción básica y precio. Nuestra plataforma procesa los datos instantáneamente.' },
  { n: '02', title: 'IA genera el contenido', desc: 'La magia ocurre. Generamos múltiples piezas de diseño con estética editorial de alto nivel.' },
  { n: '03', title: 'Lo publicás', desc: 'Descargá los materiales o compartilos directamente en Instagram, Facebook y WhatsApp.' },
]

export default function HowItWorksSection() {
  return (
    <section id="como-funciona" className="py-32 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
          <div className="max-w-xl">
            <span className="text-xs font-label uppercase tracking-widest text-primary mb-4 block">Proceso</span>
            <h2 className="text-4xl md:text-5xl font-headline tracking-tight">Tres pasos para dominar el mercado</h2>
          </div>
          <p className="text-slate-400 max-w-sm">Simplificamos la complejidad del marketing digital para que te enfoques en cerrar tratos.</p>
        </div>
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((s, i) => (
            <div key={i} className="relative z-10">
              <div className="text-6xl font-headline text-white/5 mb-6">{s.n}</div>
              <h3 className="text-2xl font-headline mb-4 text-white">{s.title}</h3>
              <p className="text-slate-400">{s.desc}</p>
              {i > 0 && (
                <div className="hidden md:block absolute top-12 -left-1/4 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
