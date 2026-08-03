import { useState, useEffect } from "react";

const Preloader = () => {
  const [phase, setPhase] = useState<"terminal" | "name" | "done">("terminal");
  const [termText, setTermText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const termString = "> Loading swapnil...";

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => setShowCursor(c => !c), 500);
    return () => clearInterval(interval);
  }, []);

  // Type the terminal string
  useEffect(() => {
    if (phase !== "terminal") return;
    if (termText.length < termString.length) {
      const t = setTimeout(() => setTermText(termString.slice(0, termText.length + 1)), 55);
      return () => clearTimeout(t);
    } else {
      // After typing is done, switch to name reveal
      const t = setTimeout(() => setPhase("name"), 400);
      return () => clearTimeout(t);
    }
  }, [termText, phase, termString]);

  // After name reveal, dismiss
  useEffect(() => {
    if (phase !== "name") return;
    const t = setTimeout(() => setPhase("done"), 2000);
    return () => clearTimeout(t);
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div
      className="preloader flex-col gap-6"
      style={{
        opacity: phase === "name" ? 1 : 1,
        animation: phase === "name" ? "preloaderSlideUp 0.6s ease 1.5s forwards" : "none",
      }}
    >
      {/* Terminal line */}
      <div
        className="font-mono text-sm md:text-base"
        style={{
          color: "hsl(199,89%,48%)",
          opacity: phase === "terminal" ? 1 : 0,
          transition: "opacity 0.3s ease",
          height: "1.5rem",
        }}
      >
        {termText}
        <span style={{ opacity: showCursor ? 1 : 0 }}>█</span>
      </div>

      {/* Name reveal */}
      {phase === "name" && (
        <div className="text-center">
          <div className="preloader-text">
            swapnil
            <span className="preloader-text-fill">swapnil</span>
          </div>
          <div className="preloader-progress mt-4 mx-auto">
            <div className="preloader-progress-fill" />
          </div>
          <p
            className="mt-3 text-xs tracking-widest uppercase"
            style={{ color: "rgba(255,255,255,0.2)", letterSpacing: "0.2em" }}
          >
            portfolio
          </p>
        </div>
      )}
    </div>
  );
};

export default Preloader;
