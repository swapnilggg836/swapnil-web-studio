import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Send, User, Mail, Phone, MessageSquare, CheckCircle } from "lucide-react";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [visible, setVisible] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", message: "", robotCheck: false,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.robotCheck) {
      toast({ title: "Please confirm you're not a robot", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch("https://formspree.io/f/xrbknpod", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
        }),
      });
      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", phone: "", message: "", robotCheck: false });
        toast({ title: "Message sent!", description: "I'll get back to you soon." });
      } else {
        throw new Error("Failed");
      }
    } catch {
      toast({ title: "Error", description: "Failed to send. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const inputStyle = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "0.75rem",
    padding: "0.875rem 1rem",
    color: "#fff",
    fontSize: "0.95rem",
    outline: "none",
    transition: "all 0.2s ease",
    fontFamily: "'Inter', sans-serif",
  } as React.CSSProperties;

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative py-28 overflow-hidden"
      style={{ background: "#060606" }}
    >
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid pointer-events-none" style={{ opacity: 0.4 }} />

      {/* Parallax decorative text */}
      <div
        className="decorative-bg-text pointer-events-none select-none"
        style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
      >
        CONTACT
      </div>

      {/* Glow blobs */}
      <div
        className="absolute pointer-events-none animate-blob"
        style={{
          top: "-100px", left: "-100px",
          width: "500px", height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, hsl(199,89%,48%,0.08) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute pointer-events-none animate-blob"
        style={{
          bottom: "-100px", right: "-100px",
          width: "400px", height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, hsl(270,70%,60%,0.05) 0%, transparent 70%)",
          filter: "blur(60px)",
          animationDelay: "3s",
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div
          className="text-center mb-16"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "all 0.6s ease",
          }}
        >
          <div className="section-badge justify-center mx-auto w-fit mb-4">
            Get In Touch
          </div>
          <h2 className="section-title mb-4">Contact Me</h2>
          <p className="section-subtitle mx-auto text-center">
            Let's discuss your project or just say hello — I'm always open to new opportunities
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {submitted ? (
            /* Success state */
            <div
              className="glass-card p-12 text-center"
              style={{
                opacity: visible ? 1 : 0,
                transition: "opacity 0.5s ease",
              }}
            >
              <CheckCircle size={56} className="mx-auto mb-4" style={{ color: "hsl(199,89%,48%)" }} />
              <h3 className="font-black text-2xl text-white mb-2">Message Sent!</h3>
              <p className="text-white/50 mb-6">Thank you for reaching out. I'll get back to you shortly.</p>
              <button
                onClick={() => setSubmitted(false)}
                className="btn-pill btn-pill-outline text-sm"
              >
                Send Another
              </button>
            </div>
          ) : (
            <div
              className="glass-card p-8 md:p-10"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(30px)",
                transition: "all 0.7s ease 0.1s",
              }}
            >
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-white/60 text-sm font-medium">
                    <User size={14} /> Your Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                    style={inputStyle}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "hsl(199,89%,48%,0.5)"; e.currentTarget.style.boxShadow = "0 0 0 3px hsl(199,89%,48%,0.1)"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }}
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-white/60 text-sm font-medium">
                    <Mail size={14} /> Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                    style={inputStyle}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "hsl(199,89%,48%,0.5)"; e.currentTarget.style.boxShadow = "0 0 0 3px hsl(199,89%,48%,0.1)"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }}
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-white/60 text-sm font-medium">
                    <Phone size={14} /> Phone
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    style={inputStyle}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "hsl(199,89%,48%,0.5)"; e.currentTarget.style.boxShadow = "0 0 0 3px hsl(199,89%,48%,0.1)"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }}
                  />
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-white/60 text-sm font-medium">
                    <MessageSquare size={14} /> Message
                  </label>
                  <textarea
                    id="contact-message"
                    placeholder="Tell me about your project..."
                    rows={4}
                    value={formData.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    required
                    style={{ ...inputStyle, resize: "none" }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "hsl(199,89%,48%,0.5)"; e.currentTarget.style.boxShadow = "0 0 0 3px hsl(199,89%,48%,0.1)"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }}
                  />
                </div>

                {/* Robot check */}
                <div className="flex items-center gap-3">
                  <input
                    id="robot-check"
                    type="checkbox"
                    checked={formData.robotCheck}
                    onChange={(e) => handleChange("robotCheck", e.target.checked)}
                    className="w-4 h-4 rounded cursor-pointer accent-cyan-400"
                    style={{ accentColor: "hsl(199,89%,48%)" }}
                  />
                  <label htmlFor="robot-check" className="text-white/50 text-sm cursor-pointer select-none">
                    I am not a robot 🤖
                  </label>
                </div>

                {/* Submit */}
                <button
                  id="contact-submit-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-pill btn-pill-primary w-full justify-center text-base py-4"
                  style={{ opacity: isSubmitting ? 0.7 : 1 }}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    <>
                      <Send size={18} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Contact;
