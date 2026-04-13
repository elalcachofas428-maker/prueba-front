import { Link, useNavigate } from 'react-router-dom'

export default function NavBar({ user, onLogout }) {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/10 glass-nav shadow-2xl shadow-cyan-900/20">
      <div className="flex justify-between items-center px-8 h-20 max-w-7xl mx-auto">
        <div className="flex items-center gap-8">
          <div className="text-2xl font-extrabold tracking-tighter text-white font-headline">LeadBook</div>
          <div className="hidden md:flex gap-8">
            <a className="text-[#00D4FF] font-bold" href="#inicio">Inicio</a>
            <a className="text-slate-400 hover:text-white transition-colors" href="#funciones">Funciones</a>
            <a className="text-slate-400 hover:text-white transition-colors" href="#como-funciona">Cómo funciona</a>
            <a className="text-slate-400 hover:text-white transition-colors" href="#formatos">Formatos</a>
            <a className="text-slate-400 hover:text-white transition-colors" href="#precios">Precios</a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="hidden md:block text-slate-400 text-sm">{user.email}</span>
              <Link to="/dashboard" className="bg-primary-container text-on-primary-fixed-variant px-6 py-2.5 rounded-full font-label uppercase tracking-widest text-xs hover:scale-95 active:scale-90 transition-transform">Dashboard →</Link>
              <button onClick={onLogout} className="hidden md:block text-slate-400 hover:text-white transition-colors text-sm font-label uppercase tracking-wider">Cerrar sesión</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hidden md:block text-slate-400 hover:text-white transition-colors text-sm font-label uppercase tracking-wider">Iniciar sesión</Link>
              <Link to="/register" className="bg-primary-container text-on-primary-fixed-variant px-6 py-2.5 rounded-full font-label uppercase tracking-widest text-xs hover:scale-95 active:scale-90 transition-transform">Empezar gratis</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
