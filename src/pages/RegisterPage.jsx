import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAppStore } from '../store/useAppStore';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import Logo from '../components/Logo';
import TerminosModal from '../components/modals/TerminosModal';
import PoliticaModal from '../components/modals/PoliticaModal';
import { sendOTP, verifyOTP, registerApi } from '../services/api';

const validarEmail = (email) => {
  const regex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
  if (!regex.test(email)) {
    return "Ingresá un email válido (sin caracteres especiales como ñ o tildes)";
  }
  return "";
};

function PasswordStrength({ password }) {
  const getStrength = (p) => {
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  };
  const strength = getStrength(password);
  const colors = ['', 'var(--error)', 'var(--warning)', '#EAB308', 'var(--success)'];
  const labels = ['', 'Muy débil', 'Débil', 'Buena', 'Fuerte'];
  if (!password) return null;
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display:'flex', gap:4, marginBottom:6 }}>
        {[1,2,3,4].map(i => (
          <div key={i} style={{
            flex:1, height:3, borderRadius:2,
            background: i <= strength ? colors[strength] : 'var(--border-subtle)',
            transition: 'background 0.3s ease',
          }} />
        ))}
      </div>
      <span style={{ fontFamily:'DM Sans', fontSize:11, color: colors[strength] }}>{labels[strength]}</span>
    </div>
  );
}

export default function RegisterPage() {
  const { addToast } = useAppStore();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Form, 2: OTP
  const [form, setForm] = useState({ nombre:'', email:'', password:'', confirmPassword:'' });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [showPass, setShowPass] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [terminosModalOpen, setTerminosModalOpen] = useState(false);
  const [politicaModalOpen, setPoliticaModalOpen] = useState(false);
  
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const otpInputs = useRef([]);

  // Timer para reenvío de OTP
  useEffect(() => {
    let timer;
    if (step === 2 && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  const update = (field, val) => { 
    setForm(prev => ({ ...prev, [field]: val })); 
    setErrors(prev => {
      const newErrors = { ...prev, [field]:'' };
      if (field === 'email' && val.trim()) {
        const error = validarEmail(val);
        if (error) newErrors.email = error;
      }
      return newErrors;
    }); 
  };

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = 'El nombre es requerido';
    if (!form.email.trim()) {
      e.email = 'El email es requerido';
    } else {
      const emailErr = validarEmail(form.email);
      if (emailErr) e.email = emailErr;
    }
    if (form.password.length < 8) e.password = 'Mínimo 8 caracteres';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Las contraseñas no coinciden';
    if (!accepted) e.accepted = 'Debés aceptar los términos';
    return e;
  };

  // PASO 1: Enviar OTP
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    
    setLoading(true);
    try {
      await sendOTP(form.email);
      addToast({ type:'info', title:'Código enviado', message:`Enviamos un código a ${form.email}` });
      setStep(2);
      setCountdown(60);
      setCanResend(false);
    } catch (err) {
      addToast({ type:'error', title:'Error', message: err.message || 'No se pudo enviar el código.' });
    } finally {
      setLoading(false);
    }
  };

  // PASO 2: Verificar OTP y Registrar
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) return;

    setLoading(true);
    try {
      await verifyOTP(form.email, code);
      // Tras verificar, procedemos al registro final que ahora devuelve tokens
      const data = await registerApi(form.email, form.password, form.nombre, '', '');
      
      // Auto-login: guardar tokens
      if (data.access && data.refresh) {
        localStorage.setItem('subzero_access', data.access);
        localStorage.setItem('subzero_refresh', data.refresh);
      }
      
      addToast({ type:'success', title:'¡Cuenta creada!', message:'Bienvenido a LeadBook. Elegí tu plan para comenzar.' });
      localStorage.setItem('leadbook_needs_onboarding', 'true');
      
      // Forzamos recarga hacia /select-plan para que AuthContext hidrate los tokens
      window.location.href = '/select-plan';
    } catch (err) {
      addToast({ type:'error', title:'Error de verificación', message: err.message || 'Código inválido o expirado.' });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    setLoading(true);
    try {
      await sendOTP(form.email);
      addToast({ type:'info', title:'Código reenviado', message:'Revisá tu bandeja de entrada.' });
      setCountdown(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      if (otpInputs.current[0]) otpInputs.current[0].focus();
    } catch (err) {
      addToast({ type:'error', title:'Error', message:'No se pudo reenviar el código.' });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Mover al siguiente input
    if (value && index < 5) {
      otpInputs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1].focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const data = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(data)) return;
    
    const newOtp = [...otp];
    data.split('').forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);
    
    // Enfocar el último input o el siguiente disponible
    const nextIndex = data.length < 6 ? data.length : 5;
    otpInputs.current[nextIndex].focus();
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', overflow: 'hidden', display: 'flex', background: 'var(--bg-base)', zIndex: 9999 }}>
      {/* Botón volver atrás */}
      <button
        onClick={() => step === 2 ? setStep(1) : navigate('/')}
        style={{
          position: 'absolute', top: '24px', left: '24px', background: 'transparent',
          border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', padding: '8px 12px',
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
          color: 'rgba(255,255,255,0.6)', transition: 'all 0.2s ease', zIndex: 100
        }}
        onMouseEnter={(e) => { e.target.style.borderColor = '#00c4d4'; e.target.style.color = '#00c4d4'; e.target.style.transform = 'translateX(-4px)'; }}
        onMouseLeave={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.2)'; e.target.style.color = 'rgba(255,255,255,0.6)'; e.target.style.transform = 'translateX(0)'; }}
      >
        <ArrowLeft size={16} />
        <span style={{ fontSize: '12px' }}>{step === 2 ? 'Corregir datos' : 'Volver'}</span>
      </button>

      {/* Columna izquierda */}
      <div style={{
        flex:1, background:'var(--bg-surface)', borderRight:'1px solid var(--border-subtle)',
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
        padding:60, position:'relative', overflow:'hidden',
      }} className="auth-left">
        <div style={{ position:'absolute', width:500, height:500, borderRadius:'50%', background:'rgba(0,212,255,0.05)', filter:'blur(100px)', top:-100, right:-100 }} />
        <div style={{ position:'absolute', width:350, height:350, borderRadius:'50%', background:'rgba(124,58,237,0.07)', filter:'blur(80px)', bottom:0, left:-50 }} />
        <div style={{ position:'relative', zIndex:1, maxWidth:400 }}>
          <div style={{ marginBottom:48, display: 'flex', alignItems: 'center' }}>
            <Logo size="default" />
            <span style={{ fontFamily:'Syne', fontWeight:800, fontSize:28, color:'var(--accent)', marginLeft: 12 }}>Lead<span style={{ color:'var(--text-primary)' }}>Book</span></span>
          </div>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'6px 14px', background:'var(--accent-dim)', border:'1px solid var(--border-accent)', borderRadius:'var(--radius-full)', marginBottom:24 }}>
            <span style={{ fontFamily:'DM Sans', fontSize:12, color:'var(--accent)' }}>⚡ 14 días gratis incluidos</span>
          </div>
          <h2 style={{ fontFamily:'Syne', fontSize:28, fontWeight:700, marginBottom:12 }}>
            {step === 1 ? 'Empezá a generar marketing hoy' : 'Casi listo para despegar'}
          </h2>
          <p style={{ fontFamily:'DM Sans', fontSize:15, color:'var(--text-secondary)', lineHeight:1.6, marginBottom:32 }}>
            {step === 1 
              ? 'Sin tarjeta de crédito. Sin configuración compleja. Solo resultados.'
              : 'Verificamos tu identidad para mantener la seguridad de tu cuenta.'}
          </p>
          {[
            { n:'✓ Sin tarjeta de crédito', d:'14 días gratis, cancelá cuando quieras' },
            { n:'✓ Setup en 2 minutos', d:'Onboarding guiado paso a paso' },
            { n:'✓ Soporte incluido', d:'Te ayudamos a sacar el máximo provecho' },
          ].map((item,i) => (
            <div key={i} style={{ marginBottom:20 }}>
              <div style={{ fontFamily:'DM Sans', fontSize:14, fontWeight:600, color:'var(--text-primary)', marginBottom:2 }}>{item.n}</div>
              <div style={{ fontFamily:'DM Sans', fontSize:13, color:'var(--text-secondary)' }}>{item.d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Columna derecha — formulario / OTP */}
      <div style={{ flex: 1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'48px 32px', overflow: 'hidden' }}>
        <div style={{ width:'100%', maxWidth:380 }}>
          
          {step === 1 ? (
            /* PASO 1: FORMULARIO */
            <>
              <div style={{ marginBottom:28 }}>
                <h2 style={{ fontFamily:'Syne', fontSize:26, fontWeight:700, marginBottom:6 }}>Creá tu cuenta</h2>
                <p style={{ fontFamily:'DM Sans', fontSize:14, color:'var(--text-secondary)' }}>Empezá gratis, sin compromiso</p>
              </div>

              <form onSubmit={handleSubmitForm} style={{ display:'flex', flexDirection:'column', gap:18 }}>
                <div className="input-wrapper">
                  <label className="input-label">NOMBRE COMPLETO <span className="required">*</span></label>
                  <div style={{ position:'relative' }}>
                    <User size={16} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--text-tertiary)', pointerEvents:'none' }} />
                    <input className={`input ${errors.nombre?'error':''}`} style={{ paddingLeft:38 }}
                      placeholder="Tu nombre" value={form.nombre} onChange={e => update('nombre', e.target.value)} />
                  </div>
                  {errors.nombre && <div className="input-error-msg">{errors.nombre}</div>}
                </div>

                <div className="input-wrapper">
                  <label className="input-label">EMAIL <span className="required">*</span></label>
                  <div style={{ position:'relative' }}>
                    <Mail size={16} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--text-tertiary)', pointerEvents:'none' }} />
                    <input className={`input ${errors.email?'error':''}`} style={{ paddingLeft:38 }}
                      type="email" placeholder="tu@email.com" value={form.email} onChange={e => update('email', e.target.value)} />
                  </div>
                  {errors.email && <div className="input-error-msg">{errors.email}</div>}
                </div>

                <div className="input-wrapper">
                  <label className="input-label">CONTRASEÑA <span className="required">*</span></label>
                  <div style={{ position:'relative' }}>
                    <Lock size={16} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--text-tertiary)', pointerEvents:'none' }} />
                    <input className={`input ${errors.password?'error':''}`} style={{ paddingLeft:38, paddingRight:44 }}
                      type={showPass?'text':'password'} placeholder="Mínimo 8 caracteres"
                      value={form.password} onChange={e => update('password', e.target.value)} />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--text-tertiary)', display:'flex' }}>
                      {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                    </button>
                  </div>
                  <PasswordStrength password={form.password} />
                  {errors.password && <div className="input-error-msg">{errors.password}</div>}
                </div>

                <div className="input-wrapper">
                  <label className="input-label">CONFIRMAR CONTRASEÑA <span className="required">*</span></label>
                  <div style={{ position:'relative' }}>
                    <Lock size={16} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--text-tertiary)', pointerEvents:'none' }} />
                    <input className={`input ${errors.confirmPassword?'error':''}`} style={{ paddingLeft:38, paddingRight:44 }}
                      type={showPass?'text':'password'} placeholder="Repetí la contraseña"
                      value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} />
                  </div>
                  {errors.confirmPassword && <div className="input-error-msg">{errors.confirmPassword}</div>}
                </div>

                <div>
                  <div style={{ display:'flex', alignItems:'flex-start', gap:10 }}>
                    <input 
                      type="checkbox" 
                      id="aceptoTerminos"
                      checked={accepted} 
                      onChange={(e) => setAccepted(e.target.checked)} 
                      style={{ 
                        marginTop: 4, 
                        cursor: 'pointer',
                        accentColor: 'var(--accent)',
                        width: 16,
                        height: 16
                      }}
                    />
                    <span style={{ fontFamily:'DM Sans', fontSize:13, color:'var(--text-secondary)', lineHeight:1.5 }}>
                      Acepto los siguientes{' '}
                      <button type="button" onClick={() => setTerminosModalOpen(true)} style={{ background:'none', border:'none', padding:0, font:'inherit', cursor:'pointer', color:'var(--accent)', textDecoration:'none' }}>Términos de servicio</button>
                      {' '}y la{' '}
                      <button type="button" onClick={() => setPoliticaModalOpen(true)} style={{ background:'none', border:'none', padding:0, font:'inherit', cursor:'pointer', color:'var(--accent)', textDecoration:'none' }}>Política de privacidad</button>
                    </span>
                  </div>
                  {errors.accepted && <div className="input-error-msg" style={{ marginTop:4 }}>{errors.accepted}</div>}
                </div>

                <button type="submit" className={`btn btn-primary ${loading?'btn-loading':''}`}
                  style={{ width:'100%', marginTop:4 }} disabled={loading}>
                  {loading ? <><div className="btn-spinner"/>Enviando código...</> : <>{'Crear cuenta gratis'} <ArrowRight size={18} style={{ marginLeft: 8 }} /></>}
                </button>
              </form>
            </>
          ) : (
            /* PASO 2: VERIFICACIÓN OTP */
            <div className="animate-fade-in-up">
              <div style={{ marginBottom:32, textAlign: 'center' }}>
                <div style={{ 
                  width: 64, height: 64, borderRadius: '50%', background: 'var(--accent-dim)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' 
                }}>
                  <ShieldCheck size={32} color="var(--accent)" />
                </div>
                <h2 style={{ fontFamily:'Syne', fontSize:26, fontWeight:700, marginBottom:8 }}>Verificá tu email</h2>
                <p style={{ fontFamily:'DM Sans', fontSize:14, color:'var(--text-secondary)', lineHeight: 1.6 }}>
                  Enviamos un código de 6 dígitos a <strong>{form.email}</strong>. Ingresalo para continuar.
                </p>
              </div>

              <form onSubmit={handleVerifyOtp}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={el => otpInputs.current[idx] = el}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(idx, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(idx, e)}
                      onPaste={handleOtpPaste}
                      style={{
                        width: 44, height: 52, borderRadius: 8, textAlign: 'center',
                        fontFamily: 'Syne', fontSize: 22, fontWeight: 700,
                        background: 'var(--bg-surface)', color: 'var(--text-primary)',
                        border: digit ? '1.5px solid var(--accent)' : '1.5px solid var(--border-default)',
                        transition: 'all 0.2s ease', outline: 'none'
                      }}
                      onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                      onBlur={e => e.target.style.borderColor = digit ? 'var(--accent)' : 'var(--border-default)'}
                    />
                  ))}
                </div>

                <button 
                  type="submit" 
                  className={`btn btn-primary ${loading?'btn-loading':''}`}
                  style={{ width:'100%', marginBottom: 24 }} 
                  disabled={loading || otp.join('').length < 6}
                >
                  {loading ? <><div className="btn-spinner"/>Verificando...</> : 'Verificar código'}
                </button>

                <div style={{ textAlign: 'center' }}>
                  {countdown > 0 ? (
                    <span style={{ fontFamily:'DM Sans', fontSize:14, color:'var(--text-tertiary)' }}>
                      Reenviar código en {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, '0')}
                    </span>
                  ) : (
                    <button 
                      type="button" 
                      onClick={handleResendOtp}
                      style={{ 
                        background: 'none', border: 'none', color: 'var(--accent)', 
                        fontFamily:'DM Sans', fontSize:14, fontWeight: 600, cursor: 'pointer' 
                      }}
                    >
                      Reenviar código
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          <p style={{ fontFamily:'DM Sans', fontSize:13, color:'var(--text-secondary)', textAlign:'center', marginTop:24 }}>
            ¿Ya tenés cuenta?{' '}
            <Link to="/login" style={{ color:'var(--accent)', textDecoration:'none', fontWeight:500 }}>Iniciá sesión</Link>
          </p>
        </div>
      </div>

      <TerminosModal isOpen={terminosModalOpen} onClose={() => setTerminosModalOpen(false)} />
      <PoliticaModal isOpen={politicaModalOpen} onClose={() => setPoliticaModalOpen(false)} />

      <style>{`@media (max-width: 768px) { .auth-left { display: none !important; } }`}</style>
    </div>
  );
}
