import NavBar from '../components/landing/NavBar'
import HeroSection from '../components/landing/HeroSection'
import FeaturesSection from '../components/landing/FeaturesSection'
import HowItWorksSection from '../components/landing/HowItWorksSection'
import FormatsSection from '../components/landing/FormatsSection'
import PricingSection from '../components/landing/PricingSection'
import FooterSection from '../components/landing/FooterSection'
import { useAuth } from '../context/AuthContext'

export default function LandingPage() {
  const { user, logout } = useAuth()
  
  return (
    <div className="bg-[#070B14] text-on-surface antialiased overflow-x-hidden font-body">
      <NavBar user={user} onLogout={logout} />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <FormatsSection />
        <PricingSection />
      </main>
      <FooterSection />
    </div>
  )
}
