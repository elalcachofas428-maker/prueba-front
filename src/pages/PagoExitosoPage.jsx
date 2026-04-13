import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function PagoExitosoPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const plan = params.get('plan');

  useEffect(() => {
    // Después de 3 segundos ir al dashboard
    sessionStorage.removeItem('onboarding_step');
    const timer = setTimeout(() => {
      localStorage.removeItem('leadbook_needs_onboarding');
      navigate('/dashboard');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg-base)'}}>
      <div className="fade-in" style={{textAlign:'center', padding:40, background:'var(--bg-card)', borderRadius:24, border:'1px solid var(--border-subtle)', maxWidth:400, width:'100%', boxShadow:'0 8px 32px rgba(0,0,0,0.4)'}}>
        <div style={{fontSize:64, marginBottom:16}}>🎉</div>
        <h1 style={{fontFamily:'Syne', color:'var(--text-primary)', marginBottom:8, fontSize:28}}>¡Pago exitoso!</h1>
        <p style={{color:'var(--text-secondary)', marginBottom:24, lineHeight:1.5}}>
          Tu plan <strong style={{color:'var(--accent)'}}>{plan || 'Premium'}</strong> está activo. Prepárate para despegar.
        </p>
        <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:10}}>
          <div className="animate-spin" style={{width:16, height:16, border:'2px solid var(--border-default)', borderTop:'2px solid var(--accent)', borderRadius:'50%'}} />
          <p style={{color:'var(--text-secondary)', fontSize:13}}>Redirigiendo al dashboard...</p>
        </div>
      </div>
    </div>
  );
}
