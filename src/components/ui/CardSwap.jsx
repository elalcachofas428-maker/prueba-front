import React, { Children, cloneElement, forwardRef, isValidElement, useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import './CardSwap.css';

export const Card = forwardRef(({ customClass, children, title, icon, isActive, ...rest }, ref) => (
  <div 
    ref={ref} 
    {...rest} 
    className={`card ${customClass ?? ''} ${rest.className ?? ''} ${isActive ? 'is-active' : ''}`.trim()}
  >
    <div className="card-title-bar">
      <span className="card-title">
        {icon && <span className="card-title-icon">{icon}</span>}
        {title}
      </span>
    </div>
    <div className="card-content">
      {children}
    </div>
  </div>
));
Card.displayName = 'Card';

// Calculadora de posiciones (Slots)
// El centro de la pantalla es x:0, y:0 (usaremos top:50%, left:50%, xPercent:-50, yPercent:-50)
const makeSlot = (i, total) => {
  const ww = window.innerWidth;
  const wh = window.innerHeight;

  if (i === 0) {
    // POSICIÓN FULLSCREEN (ACTIVA) - Centrada perfectamente
    return {
      x: 0,
      y: 0,
      scale: 1,
      zIndex: 100,
      borderRadius: 0,
      opacity: 1,
    };
  } else {
    // POSICIÓN MAZO (ESQUINA INFERIOR DERECHA)
    const deckScale = 0.28; 
    const visualW = ww * deckScale;
    const visualH = wh * deckScale;

    // Distancia desde el centro (50%, 50%) hasta la esquina inferior derecha
    const x = (ww / 2) - (visualW / 2) - 40;
    const y = (wh / 2) - (visualH / 2) - 40;

    const offsetIndex = i - 1;
    const staggerX = offsetIndex * 30; 
    const staggerY = offsetIndex * 45; 

    return {
      x: x + staggerX,
      y: y - staggerY,
      scale: deckScale - (offsetIndex * 0.015), 
      zIndex: 100 - i,
      borderRadius: 40, 
      opacity: 0, // Inactivos ocultos por defecto
    };
  }
};

const placeNow = (el, slot) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    xPercent: -50,
    yPercent: -50,
    scale: slot.scale,
    zIndex: slot.zIndex,
    borderRadius: slot.borderRadius,
    opacity: slot.opacity,
    transformOrigin: 'center center',
    force3D: true
  });

const CardSwap = ({
  activeIndex,
  children
}) => {
  const easeCurve = 'power3.inOut';
  const childArr = useMemo(() => Children.toArray(children), [children]);
  
  const refs = useMemo(
    () => childArr.map(() => React.createRef()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [childArr.length]
  );

  const order = useRef(Array.from({ length: childArr.length }, (_, i) => i));
  const tlRef = useRef(null);
  const container = useRef(null);
  const prevIndex = useRef(activeIndex ?? 0);
  const isInitialized = useRef(false);

  // Inicializar posiciones 
  useEffect(() => {
    const total = refs.length;
    
    // Organizar el orden inicial con la carta activa primero
    const initial = activeIndex ?? 0;
    const newOrder = [];
    newOrder.push(initial);
    for (let i = 0; i < total; i++) {
      if (i !== initial) newOrder.push(i);
    }
    order.current = newOrder;
    
    // Forzar a todas a su ranura sin animación
    newOrder.forEach((idx, slotPos) => {
      placeNow(refs[idx].current, makeSlot(slotPos, total));
    });
    
    // Snap la tarjeta activa a cobertura perfecta (sin centrado)
    const activeEl = refs[initial].current;
    if (activeEl) {
      gsap.set(activeEl, {
        top: 0,
        left: 0,
        xPercent: 0,
        yPercent: 0,
        x: 0,
        y: 0,
        scale: 1,
        borderRadius: 0,
      });
    }
    
    isInitialized.current = true;
    
    // Listener de responsive
    const handleResize = () => {
      order.current.forEach((idx, slotPos) => {
        if (idx !== activeIndex) {
          placeNow(refs[idx].current, makeSlot(slotPos, total));
        }
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Animar ante cambios en activeIndex (Click en Navbar)
  useEffect(() => {
    if (!isInitialized.current) return;
    if (activeIndex === undefined || activeIndex === null) return;
    if (activeIndex === prevIndex.current) return;

    const total = refs.length;
    const currentFront = order.current[0];

    if (currentFront === activeIndex) {
      prevIndex.current = activeIndex;
      return;
    }

    if (tlRef.current) tlRef.current.kill();

    // Quitar el look de "página" a la actual para que vuelva a ser "tarjeta"
    refs[currentFront].current.classList.remove('is-active');

    // Restaurar posicionamiento centrado para la animación
    const elCurrent = refs[currentFront].current;
    gsap.set(elCurrent, {
      top: '50%',
      left: '50%',
      xPercent: -50,
      yPercent: -50,
      x: 0,
      y: 0,
    });

    // Calcular nuevo orden
    const newOrder = [activeIndex];
    order.current.forEach((idx) => {
      if (idx !== activeIndex) newOrder.push(idx);
    });

    const tl = gsap.timeline();
    tlRef.current = tl;

    const centerScale = 0.45;
    const slotForOldFront = makeSlot(newOrder.indexOf(currentFront), total);
    const elTarget = refs[activeIndex].current;
    const oldTitleBar = elCurrent.querySelector('.card-title-bar');
    const newTitleBar = elTarget.querySelector('.card-title-bar');

    // ═══════════════════════════════════════════════
    // FASE 1: Achicado del apartado actual al centro
    //         La barra de título aparece mientras se achica
    // ═══════════════════════════════════════════════

    // Mostrar barra de título del apartado actual
    tl.to(oldTitleBar, { opacity: 1, duration: 0.3, ease: 'power2.out' }, 0);

    // Achicarse al centro de la pantalla
    tl.to(elCurrent, {
      scale: centerScale,
      borderRadius: 20,
      duration: 0.65,
      ease: 'power3.inOut',
    }, 0);

    // ═══════════════════════════════════════════════
    // FASE 2: Mostrar la baraja de cartas
    // ═══════════════════════════════════════════════

    // Mostrar las demás tarjetas del mazo
    newOrder.forEach((idx) => {
      if (idx !== currentFront) {
        tl.to(refs[idx].current, { opacity: 1, duration: 0.3 }, 0.55);
      }
    });

    // Asegurar que la barra de título del target sea visible
    tl.set(newTitleBar, { opacity: 1 }, 0.55);

    // ═══════════════════════════════════════════════
    // FASE 3: Guardar la tarjeta actual en el mazo
    // ═══════════════════════════════════════════════

    tl.set(elCurrent, { zIndex: slotForOldFront.zIndex }, 0.75);

    tl.to(elCurrent, {
      x: slotForOldFront.x,
      y: slotForOldFront.y,
      scale: slotForOldFront.scale,
      borderRadius: slotForOldFront.borderRadius,
      duration: 0.5,
      ease: 'power2.inOut',
    }, 0.8);

    // Re-acomodar las demás en el mazo
    newOrder.forEach((idx, i) => {
      if (idx === currentFront || idx === activeIndex) return;
      const el = refs[idx].current;
      const slot = makeSlot(i, total);
      tl.to(el, {
        x: slot.x,
        y: slot.y,
        scale: slot.scale,
        borderRadius: slot.borderRadius,
        duration: 0.4,
        ease: easeCurve,
      }, 0.85);
      tl.set(el, { zIndex: slot.zIndex }, 0.85);
    });

    // ═══════════════════════════════════════════════
    // FASE 4: La carta seleccionada sale del mazo al centro
    // ═══════════════════════════════════════════════

    tl.set(elTarget, { zIndex: 999 }, 1.35);

    tl.to(elTarget, {
      x: 0,
      y: 0,
      scale: centerScale,
      borderRadius: 20,
      duration: 0.55,
      ease: 'back.out(1.1)',
    }, 1.4);

    // ═══════════════════════════════════════════════
    // FASE 5: Expandir la nueva carta a pantalla completa
    //         La barra de título desaparece al abrirse
    // ═══════════════════════════════════════════════

    // Ocultar barra de título mientras se expande
    tl.to(newTitleBar, { opacity: 0, duration: 0.3, ease: 'power2.in' }, 2.05);

    // Expandir a fullscreen
    tl.to(elTarget, {
      scale: 1,
      borderRadius: 0,
      duration: 0.65,
      ease: 'power3.inOut',
      onComplete: () => {
        gsap.set(elTarget, { clearProps: 'all' });
        
        // Limpiamos stlyes inline molestos (para que se comporte full viewport)
        elTarget.style.transform = 'none';
        elTarget.style.width = '100vw';
        elTarget.style.height = '100vh';
        elTarget.style.left = '0px';
        elTarget.style.top = '0px';
        elTarget.style.borderRadius = '0px';
        newTitleBar.style.display = 'none';

        // Look de "página normal"
        elTarget.classList.add('is-active');

        // Ocultar las demás tarjetas
        newOrder.forEach((idx) => {
          if (idx !== activeIndex) {
            gsap.to(refs[idx].current, { opacity: 0, duration: 0.3 });
          }
        });
      }
    }, 2.05);

    tl.call(() => {
      order.current = newOrder;
    });

    prevIndex.current = activeIndex;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  const rendered = childArr.map((child, i) =>
    isValidElement(child)
      ? cloneElement(child, {
          key: i,
          ref: refs[i],
          isActive: i === (activeIndex ?? 0),
          style: { width: '100vw', height: '100vh', ...(child.props.style ?? {}) },
        })
      : child
  );

  return (
    <div ref={container} className="card-swap-container">
      {rendered}
    </div>
  );
};

export default CardSwap;
