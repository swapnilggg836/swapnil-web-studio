import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Home, AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: "#050505" }}>
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid pointer-events-none" style={{ opacity: 0.4 }} />

      {/* Glow blob */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "500px", height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, hsl(199,89%,48%,0.1) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="relative z-10 text-center max-w-md px-6">
        <div
          className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
          style={{
            background: "hsl(199,89%,48%,0.15)",
            border: "1px solid hsl(199,89%,48%,0.3)",
          }}
        >
          <AlertTriangle size={32} style={{ color: "hsl(199,89%,60%)" }} />
        </div>

        <h1 className="font-black text-6xl text-white mb-2 tracking-tight">404</h1>
        <h2 className="text-xl font-semibold text-white/80 mb-3">Page Not Found</h2>
        <p className="text-white/40 text-sm mb-8 leading-relaxed">
          The page you are looking for doesn't exist or has been moved.
        </p>

        <button
          onClick={() => navigate("/")}
          className="btn-pill btn-pill-primary inline-flex items-center gap-2"
        >
          <Home size={16} />
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
