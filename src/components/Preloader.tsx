import { useEffect, useState } from "react";

const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  const [hiding, setHiding] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHiding(true);
      setTimeout(onComplete, 600);
    }, 2200);
    return () => clearTimeout(timer);
  }, [onComplete]);

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
        transition: "transform 0.6s cubic-bezier(0.77, 0, 0.175, 1)",
        transform: hiding ? "translateY(-100%)" : "translateY(0)",
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
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, hsl(199,89%,48%,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", textAlign: "center" }}>
        {/* Ghost text */}
        <div
          style={{
            fontSize: "clamp(3rem, 12vw, 9rem)",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            color: "rgba(255,255,255,0.08)",
            fontFamily: "'Inter', sans-serif",
            textTransform: "uppercase",
            lineHeight: 1,
            position: "relative",
          }}
        >
          Swapnil
          {/* Colored fill overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              color: "hsl(199, 89%, 48%)",
              clipPath: "inset(0 100% 0 0)",
              animation: "preloaderWipe 1.5s cubic-bezier(0.77, 0, 0.175, 1) 0.3s forwards",
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
            color: "rgba(255,255,255,0.3)",
            fontSize: "0.85rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            animation: "fadeIn 0.5s ease 0.8s both",
          }}
        >
          Web Developer & AI Engineer
        </div>

        {/* Loading bar */}
        <div
          style={{
            marginTop: "2rem",
            width: "200px",
            height: "2px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "9999px",
            overflow: "hidden",
            margin: "2rem auto 0",
          }}
        >
          <div
            style={{
              height: "100%",
              background: "linear-gradient(90deg, hsl(199,89%,48%), hsl(199,89%,70%))",
              borderRadius: "9999px",
              animation: "skillFill 2s ease forwards",
              width: "0%",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Preloader;
