import { useNavigate } from "react-router-dom";
import { XCircle, ArrowLeft } from "lucide-react";

export default function PagoFallidoPage() {
  const navigate = useNavigate();
  return (
    <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg-base)'}}>
      <div className="fade-in" style={{textAlign:'center', padding:40, background:'var(--bg-card)', borderRadius:24, border:'1px solid var(--border-subtle)', maxWidth:400, width:'100%', boxShadow:'0 8px 32px rgba(0,0,0,0.4)'}}>
        <div style={{marginBottom:24, display:'flex', justifyContent:'center'}}>
          <XCircle size={64} color="var(--error)" />
        </div>
        <h1 style={{fontFamily:'Syne', color:'var(--text-primary)', marginBottom:8, fontSize:28}}>Pago no procesado</h1>
        <p style={{color:'var(--text-secondary)', marginBottom:32, lineHeight:1.5}}>Hubo un problema al procesar tu pago. Puede ser por falta de fondos, tarjeta vencida o un error en la conexión.</p>
        
        <div style={{display:'flex', flexDirection:'column', gap:12}}>
          <button 
            onClick={() => navigate('/onboarding')} 
            className="btn btn-primary"
            style={{ width:'100%', padding:'12px', fontWeight:700 }}
          >
            Volver a intentar
          </button>
          
          <button 
            onClick={() => navigate('/dashboard')} 
            className="btn btn-ghost"
            style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}
          >
            <ArrowLeft size={16} /> Continuar con plan Free
          </button>
        </div>
      </div>
    </div>
  );
}
