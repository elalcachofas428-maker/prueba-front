import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { recuperarPassword, confirmarRecuperacion } from "../services/api";

export default function RecuperarPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1=email, 2=codigo+nueva pass
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEnviarCodigo = async () => {
    setError(""); setLoading(true);
    try {
      await recuperarPassword(email);
      setStep(2);
    } catch (e) {
      setError(e.message || "Error al enviar el código");
    } finally { setLoading(false); }
  };

  const handleConfirmar = async () => {
    setError(""); setLoading(true);
    try {
      await confirmarRecuperacion(email, codigo, nuevaPassword);
      navigate("/login?recuperado=true");
    } catch (e) {
      setError(e.message || "Código inválido o expirado");
    } finally { setLoading(false); }
  };

  return (
    <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg-base)', padding: 24}}>
      <div style={{background:'var(--bg-card)', border:'1px solid var(--border-subtle)', borderRadius:16, padding:'40px 32px', width:'100%', maxWidth:440, boxShadow: 'var(--shadow-lg)'}}>
        {step === 1 ? (
          <div className="fade-in">
            <h2 style={{fontFamily:'Syne', color:'var(--text-primary)', fontSize: 24, fontWeight: 700, marginBottom:8}}>Recuperar contraseña</h2>
            <p style={{color:'var(--text-secondary)', fontSize:14, marginBottom:32, lineHeight: 1.6}}>Te enviamos un código a tu email para que puedas crear una nueva contraseña.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="input-wrapper">
                <label className="input-label">EMAIL</label>
                <input
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                />
              </div>

              {error && <p style={{color:'var(--error)', fontSize:13, marginTop: -8}}>{error}</p>}
              
              <button 
                onClick={handleEnviarCodigo} 
                className={`btn btn-primary ${loading ? 'btn-loading' : ''}`}
                disabled={loading || !email}
                style={{ width: '100%', padding: 14, marginTop: 8 }}
              >
                {loading ? "Enviando..." : "Enviar código →"}
              </button>
              
              <button 
                onClick={() => navigate('/login')}
                className="btn btn-ghost"
                style={{ width: '100%' }}
              >
                Volver al login
              </button>
            </div>
          </div>
        ) : (
          <div className="fade-in">
            <h2 style={{fontFamily:'Syne', color:'var(--text-primary)', fontSize: 24, fontWeight: 700, marginBottom:8}}>Ingresá el código</h2>
            <p style={{color:'var(--text-secondary)', fontSize:14, marginBottom:32, lineHeight: 1.6}}>Revisá tu email y escribí el código de 6 dígitos junto con tu nueva contraseña.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="input-wrapper">
                <label className="input-label">CÓDIGO DE VERIFICACIÓN</label>
                <input
                  type="text"
                  placeholder="000000"
                  value={codigo}
                  onChange={e => setCodigo(e.target.value)}
                  maxLength={6}
                  className="input"
                  style={{ width: '100%', boxSizing: 'border-box', letterSpacing: 8, textAlign: 'center', fontWeight: 700, fontSize: 18 }}
                />
              </div>

              <div className="input-wrapper">
                <label className="input-label">NUEVA CONTRASEÑA</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={nuevaPassword}
                  onChange={e => setNuevaPassword(e.target.value)}
                  className="input"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                />
              </div>

              {error && <p style={{color:'var(--error)', fontSize:13, marginTop: -8}}>{error}</p>}
              
              <button 
                onClick={handleConfirmar} 
                className={`btn btn-primary ${loading ? 'btn-loading' : ''}`}
                disabled={loading || !codigo || !nuevaPassword}
                style={{ width: '100%', padding: 14, marginTop: 8 }}
              >
                {loading ? "Verificando..." : "Cambiar contraseña →"}
              </button>
              
              <button 
                onClick={() => setStep(1)}
                className="btn btn-ghost"
                style={{ width: '100%' }}
              >
                Volver
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
