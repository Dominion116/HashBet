import { useEffect, useRef } from "react";
import { COLORS } from "../../constants/colors";

export default function CustomCursor() {
  // Disable custom cursor on mobile/touch devices
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 'ontouchstart' in window;
  if (isMobile) return null;

  const cursorRef = useRef();
  const ringRef = useRef();
  const mx = useRef(0);
  const my = useRef(0);
  const rx = useRef(0);
  const ry = useRef(0);

  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e) => {
      mx.current = e.clientX;
      my.current = e.clientY;
      if (cursorRef.current) {
        cursorRef.current.style.left = mx.current + 'px';
        cursorRef.current.style.top = my.current + 'px';
      }
    };

    const animateRing = () => {
      rx.current += (mx.current - rx.current) * 0.12;
      ry.current += (my.current - ry.current) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = rx.current + 'px';
        ringRef.current.style.top = ry.current + 'px';
      }
      requestAnimationFrame(animateRing);
    };

    document.addEventListener('mousemove', handleMouseMove);
    animateRing();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isMobile]);

  return (
    <>
      <div
        ref={cursorRef}
        style={{
          position: "fixed",
          width: 10,
          height: 10,
          background: COLORS.green,
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9999,
          transform: "translate(-50%, -50%)",
          transition: "transform 0.1s, width 0.2s, height 0.2s, opacity 0.2s",
          boxShadow: `0 0 12px ${COLORS.green}`,
        }}
      />
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          width: 34,
          height: 34,
          border: `1px solid rgba(0,255,135,0.4)`,
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9998,
          transform: "translate(-50%, -50%)",
          transition: "transform 0.18s ease, width 0.25s, height 0.25s",
        }}
      />
      <style>{`
        body:has(a:hover) #cursor, body:has(button:hover) #cursor {
          width: 18px !important;
          height: 18px !important;
        }
        body:has(a:hover) #cursor-ring, body:has(button:hover) #cursor-ring {
          width: 56px !important;
          height: 56px !important;
          opacity: 0.4 !important;
        }
      `}</style>
    </>
  );
}