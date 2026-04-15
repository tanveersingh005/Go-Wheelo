import { useEffect, useRef } from "react";
import gsap from "gsap";

export const CustomCursor = () => {
  const cursorRef = useRef(null);

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const ctx = gsap.context(() => {
      // 🚀 Align the TIP of the arrow with the mouse coordinate instead of the center
      gsap.set(cursorRef.current, { xPercent: -5, yPercent: -5 });
      // 🔥 Use quickTo (SUPER FAST & SMOOTH)
      const moveCursorX = gsap.quickTo(cursorRef.current, "x", { duration: 0.05, ease: "none" });
      const moveCursorY = gsap.quickTo(cursorRef.current, "y", { duration: 0.05, ease: "none" });

      const onMouseMove = (e) => {
        if (!cursorRef.current) return;
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        window.dispatchEvent(
          new CustomEvent("cursorMove", {
            detail: { x: mouseX, y: mouseY },
          })
        );

        moveCursorX(mouseX);
        moveCursorY(mouseY);
        gsap.to(cursorRef.current, { opacity: 1, duration: 0.2 });
      };

      const onMouseLeave = () => {
        if (!cursorRef.current) return;
        gsap.to(cursorRef.current, { opacity: 0, scale: 0.5, duration: 0.3 });
      };

      const onMouseEnter = () => {
        if (!cursorRef.current) return;
        gsap.to(cursorRef.current, { opacity: 1, scale: 1, duration: 0.2 });
      };

      const onHover = () => {
        if (!cursorRef.current) return;
        gsap.to(cursorRef.current, { scale: 1.5, duration: 0.2 });
      };

      const onLeave = () => {
        if (!cursorRef.current) return;
        gsap.to(cursorRef.current, { scale: 1, duration: 0.2 });
      };

      const onClick = () => {
        if (!cursorRef.current) return;
        gsap.to(cursorRef.current, { scale: 0.8, duration: 0.1, yoyo: true, repeat: 1 });
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseleave", onMouseLeave);
      window.addEventListener("mouseenter", onMouseEnter);
      window.addEventListener("mousedown", onClick);

      const interactiveElements = document.querySelectorAll("button, a, input, .hover-target");
      interactiveElements.forEach((el) => {
        el.addEventListener("mouseenter", onHover);
        el.addEventListener("mouseleave", onLeave);
      });

      return () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseleave", onMouseLeave);
        window.removeEventListener("mouseenter", onMouseEnter);
        window.removeEventListener("mousedown", onClick);
        interactiveElements.forEach((el) => {
          el.removeEventListener("mouseenter", onHover);
          el.removeEventListener("mouseleave", onLeave);
        });
      };
    });

    return () => ctx.revert();
  }, []);

  // Disable cursor on mobile
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

    return (
        <div
            ref={cursorRef}
            className="fixed top-0 left-0 pointer-events-none z-[9999] opacity-0"
            style={{ 
                width: '32px', 
                height: '32px',
                filter: 'drop-shadow(0 0 10px rgba(162, 233, 255, 0.9))'
            }}
        >
            <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full transform -rotate-[22deg]"
            >
                <path 
                    d="M4.5 2L19.5 12L4.5 22V2Z" 
                    fill="url(#cursorGradient)" 
                    stroke="rgba(255,255,255,0.9)" 
                    strokeWidth="1.2"
                    strokeLinejoin="round"
                />
                <defs>
                    <linearGradient id="cursorGradient" x1="4.5" y1="12" x2="19.5" y2="12" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#a2e9ff" />
                        <stop offset="1" stopColor="#3b82f6" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
};

export default CustomCursor;