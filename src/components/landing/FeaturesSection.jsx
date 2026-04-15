import { motion } from 'framer-motion'
import SplitText from '../ui/SplitText'

const features = [
  { icon: 'psychology',    title: 'Generación con IA',       desc: 'Nuestra IA entiende el contexto de tu propiedad para escribir copys que realmente venden.' },
  { icon: 'layers',        title: 'Multi-formato',            desc: 'De un solo clic obtenés PDFs, posts, stories y videos listos para compartir.' },
  { icon: 'auto_awesome',  title: 'Publicación automática',   desc: 'Programá tus redes sociales directamente desde LeadBook sin salir de la app.' },
  { icon: 'bolt',          title: 'Sin experiencia técnica',  desc: 'No necesitás saber de diseño. El sistema hace el trabajo pesado por vos.' },
  { icon: 'timer',         title: 'Listo en segundos',        desc: 'Lo que antes tomaba horas de diseño ahora se resuelve en lo que tardás en tomar un café.' },
  { icon: 'dashboard',     title: 'Para cualquier nicho',     desc: 'Optimizado para inmobiliarias, pero flexible para cualquier tipo de producto físico.' },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const cardVariants = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}

export default function FeaturesSection() {
  return (
    <section id="funciones" className="py-32 px-8 bg-surface-container-lowest h-full flex flex-col justify-center">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <SplitText
            text="Todo lo que necesitás en un solo lugar"
            tag="h2"
            className="text-4xl md:text-5xl font-headline mb-6 tracking-tight"
            splitType="words"
            delay={60}
            from={{ opacity: 0, y: 30 }}
            to={{ opacity: 1, y: 0 }}
          />
          <SplitText
            text="Diseñado para ser veloz, preciso y por sobre todo, profesional."
            tag="p"
            className="text-slate-400 max-w-xl mx-auto"
            splitType="words"
            delay={40}
            startDelay={0.3}
            from={{ opacity: 0, y: 16 }}
            to={{ opacity: 1, y: 0 }}
          />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              className="bg-surface-container p-10 rounded-2xl glow-border hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-primary-container text-4xl mb-6">{f.icon}</span>
              <h3 className="text-xl font-headline mb-4">{f.title}</h3>
              <p className="text-slate-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
