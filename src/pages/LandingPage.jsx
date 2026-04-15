import { useState, useCallback, useEffect } from 'react'
import { Home, Zap, Settings, Layers, CreditCard } from 'lucide-react'
import NavBar from '../components/landing/NavBar'
import HeroSection from '../components/landing/HeroSection'
import FeaturesSection from '../components/landing/FeaturesSection'
import HowItWorksSection from '../components/landing/HowItWorksSection'
import FormatsSection from '../components/landing/FormatsSection'
import PricingSection from '../components/landing/PricingSection'
import FooterSection from '../components/landing/FooterSection'
import CardSwap, { Card } from '../components/ui/CardSwap'
import { useAuth } from '../context/AuthContext'

/* Ordered sections with metadata */
const SECTIONS = [
  { id: 'inicio',        label: 'Inicio',          icon: <Home size={16} /> },
  { id: 'funciones',     label: 'Funciones',       icon: <Zap size={16} /> },
  { id: 'como-funciona', label: 'Cómo funciona',   icon: <Settings size={16} /> },
  { id: 'formatos',      label: 'Formatos',        icon: <Layers size={16} /> },
  { id: 'precios',       label: 'Precios',         icon: <CreditCard size={16} /> },
]

export default function LandingPage() {
  const { user, logout } = useAuth()
  const [activeSection, setActiveSection] = useState('inicio')
  const [sceneReady, setSceneReady] = useState(false)

  const handleSceneReady = useCallback(() => {
    setTimeout(() => setSceneReady(true), 300)
  }, [])

  // Fallback: si Spline no carga en 3s, mostrar la página igual
  useEffect(() => {
    const timer = setTimeout(() => setSceneReady(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  const activeIndex = SECTIONS.findIndex(s => s.id === activeSection)

  /* Map section id → content component */
  const sectionContent = {
    'inicio':        <HeroSection isActive={activeSection === 'inicio'} onNavigate={setActiveSection} onSceneReady={handleSceneReady} />,
    'funciones':     <FeaturesSection />,
    'como-funciona': <HowItWorksSection />,
    'formatos':      <FormatsSection />,
    'precios':       <PricingSection />,
  }

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      background: '#000',
      color: 'white',
      position: 'relative',
    }}>
      <CardSwap activeIndex={activeIndex >= 0 ? activeIndex : 0}>
        {SECTIONS.map(({ id, label, icon }) => (
          <Card key={id} title={label} icon={icon}>
            <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
              <NavBar
                user={user}
                onLogout={logout}
                activeSection={id}
                onNavigate={setActiveSection}
              />
              <div style={{ width: '100%', height: '100%' }}>
                {sectionContent[id]}
              </div>
            </div>
          </Card>
        ))}
      </CardSwap>

      {/* El intro overlay ha sido removido temporalmente para asegurar que la página cargue inmediatamente */}
    </div>
  )
}
