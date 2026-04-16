import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, Smartphone, RotateCcw } from 'lucide-react';
import Iridescence from '../components/ui/Iridescence';
import Logo from '../components/Logo';

/* ============================================
   DEVICE ONBOARDING PAGE
   Step 1: Choose PC or Mobile
   Step 2 (mobile only): Rotate to landscape
   ============================================ */

const IRIDESCENCE_COLOR = [0.0, 0.6, 0.8];

export default function DeviceOnboardingPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [step, setStep] = useState('select'); // 'select' | 'rotate' | 'intro'
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 400);
    return () => clearTimeout(timer);
  }, []);

  // Listen for orientation changes when on rotate step
  useEffect(() => {
    if (step !== 'rotate') return;

    const checkOrientation = () => {
      const landscape = window.innerWidth > window.innerHeight;
      setIsLandscape(landscape);

      // Auto-navigate to intro when user rotates to landscape
      if (landscape) {
        setTimeout(() => {
          setStep('intro');
        }, 5000); // Wait 5 seconds before showing intro video
      }
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', () => {
      // Small delay for orientationchange to settle
      setTimeout(checkOrientation, 100);
    });

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, [step, navigate]);

  const handleSelect = useCallback((device) => {
    setSelected(device);

    setTimeout(() => {
      localStorage.setItem('leadbook_device', device);

      if (device === 'pc') {
        // PC: play intro video
        setStep('intro');
      } else {
        // Mobile: show rotate screen first
        setStep('rotate');
      }
    }, 400);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isTransitioning ? 0 : 1 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: '#000',
      }}
    >
      {/* ─── Iridescence Background ─── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.35,
        zIndex: 0,
      }}>
        <Iridescence
          color={IRIDESCENCE_COLOR}
          speed={0.6}
          amplitude={0.15}
          mouseReact={true}
        />
      </div>

      {/* ─── Dark overlay ─── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 50% 40%, transparent 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.85) 100%)',
        zIndex: 1,
      }} />

      {/* ─── Grain texture ─── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
        opacity: 0.5,
        zIndex: 2,
        pointerEvents: 'none',
      }} />

      {/* ─── Main Content ─── */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}>
        <AnimatePresence mode="wait">
          {/* ═══════════ STEP 1: Device Selection ═══════════ */}
          {showContent && step === 'select' && (
            <motion.div
              key="select"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >


              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  fontFamily: '"Syne", sans-serif',
                  fontSize: 'clamp(28px, 5vw, 48px)',
                  fontWeight: 800,
                  color: '#fff',
                  textAlign: 'center',
                  lineHeight: 1.1,
                  letterSpacing: '-0.03em',
                  marginBottom: '12px',
                  maxWidth: '600px',
                }}
              >
                ¿Desde dónde nos{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #00D4FF, #A78BFA)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  visitás?
                </span>
              </motion.h1>

              {/* Subtext */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: '16px',
                  color: '#94A3B8',
                  textAlign: 'center',
                  maxWidth: '420px',
                  lineHeight: 1.6,
                  marginBottom: '48px',
                }}
              >
                Optimizamos tu experiencia según tu dispositivo.
              </motion.p>

              {/* Device Cards */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  display: 'flex',
                  gap: '32px',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                }}
              >
                <DeviceCard
                  icon={<Monitor size={52} strokeWidth={1.4} />}
                  title="Computadora"
                  description="Desktop o Laptop"
                  selected={selected === 'pc'}
                  onSelect={() => handleSelect('pc')}
                />
                <DeviceCard
                  icon={<Smartphone size={52} strokeWidth={1.4} />}
                  title="Celular"
                  description="Smartphone o Tablet"
                  selected={selected === 'mobile'}
                  onSelect={() => handleSelect('mobile')}
                />
              </motion.div>
            </motion.div>
          )}

          {/* ═══════════ STEP 2: Rotate Phone ═══════════ */}
          {step === 'rotate' && (
            <motion.div
              key="rotate"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '32px',
                textAlign: 'center',
                padding: '24px',
              }}
            >
              {/* Animated phone rotation icon */}
              <motion.div
                style={{
                  width: '120px',
                  height: '120px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                {/* Pulsing ring */}
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.08, 0.3],
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    border: '2px solid rgba(0,212,255,0.3)',
                  }}
                />

                {/* Phone icon that rotates */}
                <motion.div
                  animate={{ rotate: [0, -90, -90, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    times: [0, 0.35, 0.7, 1],
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Smartphone
                    size={56}
                    strokeWidth={1.3}
                    color="#00D4FF"
                  />
                </motion.div>
              </motion.div>

              {/* Rotate arrow hint */}
              <motion.div
                animate={{ rotate: [0, -20, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ color: '#64748B' }}
              >
                <RotateCcw size={28} strokeWidth={1.5} />
              </motion.div>

              {/* Text */}
              <div>
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  style={{
                    fontFamily: '"Syne", sans-serif',
                    fontSize: 'clamp(24px, 6vw, 36px)',
                    fontWeight: 800,
                    color: '#fff',
                    lineHeight: 1.2,
                    marginBottom: '12px',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Girá tu celular
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.6 }}
                  style={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: '15px',
                    color: '#94A3B8',
                    lineHeight: 1.6,
                    maxWidth: '300px',
                  }}
                >
                  Para una mejor experiencia, usá tu celular en{' '}
                  <span style={{ color: '#00D4FF', fontWeight: 600 }}>modo horizontal</span>.
                </motion.p>
              </div>

              {/* Landscape status indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 24px',
                  borderRadius: '9999px',
                  background: isLandscape
                    ? 'rgba(16,185,129,0.1)'
                    : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${isLandscape ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.08)'}`,
                  transition: 'all 0.3s ease',
                }}
              >
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: isLandscape ? '#10B981' : '#475569',
                  boxShadow: isLandscape ? '0 0 12px rgba(16,185,129,0.5)' : 'none',
                  transition: 'all 0.3s ease',
                }} />
                <span style={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: isLandscape ? '#10B981' : '#64748B',
                  transition: 'color 0.3s ease',
                }}>
                  {isLandscape ? '¡Perfecto! Entrando...' : 'Esperando rotación...'}
                </span>
              </motion.div>
            </motion.div>
          )}

          {/* ═══════════ STEP 3: Intro Video (Mobile) ═══════════ */}
          {step === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 50,
                background: '#000',
              }}
            >
              <video
                src="/intro-full.mp4"
                autoPlay
                muted
                playsInline
                onEnded={() => {
                  setIsTransitioning(true);
                  setTimeout(() => navigate('/landing'), 600);
                }}
                style={{
                  width: '100vw',
                  height: '100vh',
                  objectFit: 'cover',
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ─── Large Device Selection Card ─── */
function DeviceCard({ icon, title, description, selected, onSelect }) {
  return (
    <motion.div
      onClick={onSelect}
      whileHover={{ scale: 1.03, y: -6 }}
      whileTap={{ scale: 0.97 }}
      animate={selected ? { scale: 1.02 } : { scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      style={{
        width: '280px',
        minHeight: '300px',
        padding: '48px 32px 40px',
        borderRadius: '28px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        position: 'relative',
        overflow: 'hidden',
        background: selected
          ? 'rgba(0, 212, 255, 0.05)'
          : 'rgba(255, 255, 255, 0.025)',
        border: selected
          ? '1.5px solid rgba(0, 212, 255, 0.35)'
          : '1px solid rgba(255, 255, 255, 0.07)',
        boxShadow: selected
          ? '0 0 60px rgba(0, 212, 255, 0.1), 0 20px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)'
          : '0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        transition: 'background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
      }}
    >
      {selected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          style={{
            position: 'absolute',
            top: '-40%',
            left: '-30%',
            width: '160%',
            height: '100%',
            background: 'radial-gradient(ellipse at 50% 90%, rgba(0,212,255,0.12), transparent 65%)',
            pointerEvents: 'none',
          }}
        />
      )}

      {selected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            position: 'absolute',
            bottom: 0,
            left: '10%',
            width: '80%',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.5), transparent)',
            pointerEvents: 'none',
          }}
        />
      )}

      <motion.div
        animate={{
          borderColor: selected ? 'rgba(0,212,255,0.25)' : 'rgba(255,255,255,0.06)',
        }}
        style={{
          width: '96px',
          height: '96px',
          borderRadius: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: selected
            ? 'linear-gradient(145deg, rgba(0,212,255,0.12), rgba(124,58,237,0.06))'
            : 'rgba(255,255,255,0.03)',
          border: '1px solid',
          color: selected ? '#00D4FF' : '#64748B',
          transition: 'background 0.3s ease, color 0.3s ease',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {icon}
      </motion.div>

      <span style={{
        fontFamily: '"Syne", sans-serif',
        fontSize: '22px',
        fontWeight: 700,
        color: selected ? '#fff' : '#CBD5E1',
        transition: 'color 0.3s ease',
        position: 'relative',
        zIndex: 1,
      }}>
        {title}
      </span>

      <span style={{
        fontFamily: '"DM Sans", sans-serif',
        fontSize: '14px',
        color: selected ? '#94A3B8' : '#475569',
        transition: 'color 0.3s ease',
        position: 'relative',
        zIndex: 1,
      }}>
        {description}
      </span>

      <motion.div
        initial={false}
        animate={{
          scale: selected ? 1 : 0,
          opacity: selected ? 1 : 0,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #00D4FF, #00BBDD)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(0,212,255,0.5)',
          zIndex: 2,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
          <path d="M2 6L5 9L10 3" stroke="#070B14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>
    </motion.div>
  );
}
