import { motion } from 'framer-motion'
import SplitText from '../ui/SplitText'

const steps = [
  { n: '01', title: 'Cargás tu propiedad',   desc: 'Subí fotos, descripción básica y precio. Nuestra plataforma procesa los datos instantáneamente.' },
  { n: '02', title: 'IA genera el contenido', desc: 'La magia ocurre. Generamos múltiples piezas de diseño con estética editorial de alto nivel.' },
  { n: '03', title: 'Lo publicás',            desc: 'Descargá los materiales o compartilos directamente en Instagram, Facebook y WhatsApp.' },
]

const stepsContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const stepVariant = {
  hidden:  { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function HowItWorksSection() {
  return (
    <section id="como-funciona" className="py-32 px-8 h-full flex flex-col justify-center">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
          <div className="max-w-xl">
            <SplitText
              text="Proceso"
              tag="span"
              className="text-xs font-label uppercase tracking-widest text-primary mb-4 block"
              splitType="chars"
              delay={80}
              from={{ opacity: 0, y: 10 }}
              to={{ opacity: 1, y: 0 }}
            />
            <SplitText
              text="Tres pasos para dominar el mercado"
              tag="h2"
              className="text-4xl md:text-5xl font-headline tracking-tight"
              splitType="words"
              delay={60}
              startDelay={0.2}
              from={{ opacity: 0, y: 30 }}
              to={{ opacity: 1, y: 0 }}
            />
          </div>
          <SplitText
            text="Simplificamos la complejidad del marketing digital para que te enfoques en cerrar tratos."
            tag="p"
            className="text-slate-400 max-w-sm"
            splitType="words"
            delay={40}
            startDelay={0.4}
            from={{ opacity: 0, y: 16 }}
            to={{ opacity: 1, y: 0 }}
          />
        </div>

        <motion.div
          variants={stepsContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="relative grid grid-cols-1 md:grid-cols-3 gap-12"
        >
          {steps.map((s, i) => (
            <motion.div key={i} variants={stepVariant} className="relative z-10">
              <div className="text-6xl font-headline text-white/5 mb-6">{s.n}</div>
              <h3 className="text-2xl font-headline mb-4 text-white">{s.title}</h3>
              <p className="text-slate-400">{s.desc}</p>
              {i > 0 && (
                <div className="hidden md:block absolute top-12 -left-1/4 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
