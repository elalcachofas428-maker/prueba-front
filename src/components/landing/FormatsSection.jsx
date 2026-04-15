import { motion } from 'framer-motion'
import SplitText from '../ui/SplitText'

const formats = [
  { icon: 'picture_as_pdf',      label: 'PDF' },
  { icon: 'photo_camera',        label: 'Instagram' },
  { icon: 'history_toggle_off',  label: 'Story' },
  { icon: 'view_carousel',       label: 'Carrusel' },
  { icon: 'mail',                label: 'Email' },
  { icon: 'videocam',            label: 'Video IA' },
]

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const iconVariants = {
  hidden:  { opacity: 0, scale: 0.75 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: 'easeOut' } },
}

export default function FormatsSection() {
  return (
    <section id="formatos" className="py-32 px-8 bg-surface-container-low h-full flex flex-col justify-center">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <SplitText
            text="Formatos Profesionales"
            tag="h2"
            className="text-3xl font-headline mb-4"
            splitType="chars"
            delay={50}
            from={{ opacity: 0, y: 24 }}
            to={{ opacity: 1, y: 0 }}
          />
        </div>

        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-2 md:grid-cols-6 gap-4"
        >
          {formats.map((f, i) => (
            <motion.div
              key={i}
              variants={iconVariants}
              className="bg-surface p-6 rounded-xl border border-white/5 text-center group hover:bg-primary-container transition-colors duration-300"
            >
              <span className="material-symbols-outlined text-primary mb-3 group-hover:text-on-primary block">{f.icon}</span>
              <p className="text-xs font-label uppercase group-hover:text-on-primary">{f.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
