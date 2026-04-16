import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { FormProvider } from './context/FormContext';

// Layouts
import AppLayout from './layouts/AppLayout';

// Páginas públicas
import LandingPage   from './pages/LandingPage';
import LoginPage     from './pages/LoginPage';
import RegisterPage  from './pages/RegisterPage';
import PreciosPage   from './pages/PreciosPage';
import DeviceOnboardingPage from './pages/DeviceOnboardingPage';

// Páginas protegidas
import DashboardPage  from './pages/DashboardPage';
import NuevoPage      from './pages/NuevoPage';
import HistorialPage  from './pages/HistorialPage';
import ResultadosPage from './pages/ResultadosPage';
import CuentaPage     from './pages/CuentaPage';
import OnboardingPage from './pages/OnboardingPage';
import AdminPage      from './pages/AdminPage';
import SelectPlanPage from './pages/SelectPlanPage';
import RecuperarPasswordPage from './pages/RecuperarPasswordPage';
import PagoExitosoPage from './pages/PagoExitosoPage';
import PagoFallidoPage from './pages/PagoFallidoPage';

// Componente de ruta protegida
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return null

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Solo redirigir a select-plan si:
  // 1. No tiene plan seleccionado
  // 2. NO está ya en /select-plan (evitar loop)
  // 3. NO está yendo al dashboard después de pagar
  const planSeleccionado = user?.plan_seleccionado || 
    (localStorage.getItem('subzero_user') && 
     JSON.parse(localStorage.getItem('subzero_user')).plan_seleccionado)

  const estaEnSelectPlan = location.pathname === '/select-plan'
  const vieneDeMP = location.search.includes('pago=')

  if (!planSeleccionado && !estaEnSelectPlan && !vieneDeMP) {
    return <Navigate to="/select-plan" replace />
  }

  // TAREA 1: Verificación de Onboarding
  const needsOnboarding = localStorage.getItem('leadbook_needs_onboarding') === 'true'
  const estaEnOnboarding = location.pathname === '/onboarding'

  if (planSeleccionado && needsOnboarding && !estaEnOnboarding) {
    return <Navigate to="/onboarding" replace />
  }

  return children
}

// Componente de ruta protegida para admin
function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'var(--bg-base)' }}><div className="animate-spin" style={{ width:32, height:32, border:'2px solid var(--border-default)', borderTop:'2px solid var(--accent)', borderRadius:'50%' }} /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!user.is_staff) return <Navigate to="/dashboard" replace />;
  return children;
}

// Componente de ruta pública (redirige al dashboard si ya está logueado)
function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

// Components
import RotationWrapper from './components/layout/RotationWrapper';

export default function App() {
  return (
    <BrowserRouter>
      <RotationWrapper>
        <Routes>
          {/* Públicas */}
          <Route path="/" element={<DeviceOnboardingPage />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/precios" element={<PreciosPage />} />
          <Route path="/login"   element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
          <Route path="/recuperar-password" element={<PublicRoute><RecuperarPasswordPage /></PublicRoute>} />

          {/* Pago */}
          <Route path="/pago-exitoso" element={<ProtectedRoute><PagoExitosoPage /></ProtectedRoute>} />
          <Route path="/pago-fallido" element={<ProtectedRoute><PagoFallidoPage /></ProtectedRoute>} />
          <Route path="/pago-pendiente" element={<ProtectedRoute><PagoExitosoPage /></ProtectedRoute>} />

          {/* Selección de Plan (Protegida) */}
          <Route path="/select-plan" element={<ProtectedRoute><SelectPlanPage /></ProtectedRoute>} />

          {/* Onboarding (protegida pero sin AppLayout) */}
          <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />

          {/* Protegidas con AppLayout */}
          <Route element={<ProtectedRoute><FormProvider><AppLayout /></FormProvider></ProtectedRoute>}>
            <Route path="/dashboard"   element={<DashboardPage />} />
            <Route path="/nuevo"       element={<NuevoPage />} />
            <Route path="/historial"   element={<HistorialPage />} />
            <Route path="/resultados"  element={<ResultadosPage />} />
            <Route path="/cuenta"      element={<CuentaPage />} />
          </Route>

          <Route element={<AdminRoute><AppLayout /></AdminRoute>}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </RotationWrapper>
    </BrowserRouter>
  );
}
