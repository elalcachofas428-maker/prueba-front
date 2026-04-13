const formats = [
  { icon: 'picture_as_pdf', label: 'PDF' },
  { icon: 'photo_camera', label: 'Instagram' },
  { icon: 'history_toggle_off', label: 'Story' },
  { icon: 'view_carousel', label: 'Carrusel' },
  { icon: 'mail', label: 'Email' },
  { icon: 'videocam', label: 'Video IA' },
]

export default function FormatsSection() {
  return (
    <section id="formatos" className="py-32 px-8 bg-surface-container-low">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-headline mb-4">Formatos Profesionales</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {formats.map((f, i) => (
            <div key={i} className="bg-surface p-6 rounded-xl border border-white/5 text-center group hover:bg-primary-container transition-colors duration-300">
              <span className="material-symbols-outlined text-primary mb-3 group-hover:text-on-primary block">{f.icon}</span>
              <p className="text-xs font-label uppercase group-hover:text-on-primary">{f.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
