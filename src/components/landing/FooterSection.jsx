export default function FooterSection() {
  return (
    <footer className="bg-[#0a0e17] py-20 px-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
          <div className="max-w-xs">
            <div className="text-xl font-headline text-white mb-6">LeadBook</div>
            <p className="text-slate-500 text-sm leading-relaxed">Revolucionando el marketing inmobiliario con inteligencia artificial generativa de alto nivel.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
            {[
              { title: 'Producto', links: ['Funciones', 'Formatos', 'Precios'] },
              { title: 'Empresa', links: ['Nosotros', 'Blog', 'Carreras'] },
              { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Status'] },
            ].map((col, i) => (
              <div key={i}>
                <h5 className="text-white text-xs font-label uppercase tracking-widest mb-6">{col.title}</h5>
                <ul className="space-y-4 text-sm text-slate-500">
                  {col.links.map((l, j) => (
                    <li key={j}><a className="hover:text-[#00D4FF] transition-colors" href="#">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-white/5 gap-4">
          <p className="text-xs font-body text-slate-500">© 2025 LeadBook. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
