import { useEffect, useState } from "react";

const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  const [hiding, setHiding] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => {
      setHiding(true);
    }, 1200);

    const t2 = setTimeout(() => {
      onComplete();
    }, 1700);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "transform 0.5s cubic-bezier(0.77, 0, 0.175, 1), opacity 0.5s ease",
        transform: hiding ? "translateY(-100%)" : "translateY(0)",
        opacity: hiding ? 0 : 1,
        pointerEvents: hiding ? "none" : "auto",
      }}
    >
      {/* Grid background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* Glow blob */}
      <div
        style={{
          position: "absolute",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, hsl(199,89%,48%,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", textAlign: "center" }}>
        {/* Brand name */}
        <div
          style={{
            fontSize: "clamp(3rem, 10vw, 7rem)",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            color: "rgba(255,255,255,0.1)",
            fontFamily: "'Inter', sans-serif",
            textTransform: "uppercase",
            lineHeight: 1,
            position: "relative",
          }}
        >
          Swapnil
          <div
            style={{
              position: "absolute",
              inset: 0,
              color: "hsl(199, 89%, 48%)",
              clipPath: "inset(0 100% 0 0)",
              animation: "preloaderWipe 1.2s cubic-bezier(0.77, 0, 0.175, 1) 0.1s forwards",
              fontWeight: 900,
            }}
          >
            Swapnil
          </div>
        </div>

        {/* Subtitle */}
        <div
          style={{
            marginTop: "1rem",
            color: "rgba(255,255,255,0.4)",
            fontSize: "0.8rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
          }}
        >
          Web Developer & AI Engineer
        </div>
      </div>
    </div>
  );
};

export default Preloader;
