import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Send, CheckCircle, MapPin, Mail, Phone, MessageCircle } from "lucide-react";

const FloatInput = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  required,
  rows,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  rows?: number;
}) => {
  const [focused, setFocused] = useState(false);
  const isUp = focused || value.length > 0;

  const baseStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: `1px solid ${focused ? "hsl(199,89%,48%,0.55)" : "rgba(255,255,255,0.08)"}`,
    borderRadius: "0.75rem",
    paddingTop: "1.6rem",
    paddingBottom: "0.625rem",
    paddingLeft: "1rem",
    paddingRight: "1rem",
    color: "#fff",
    fontSize: "0.95rem",
    outline: "none",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
    fontFamily: "'Inter', sans-serif",
    boxShadow: focused ? "0 0 0 3px hsl(199,89%,48%,0.1)" : "none",
    resize: rows ? "none" as const : undefined,
  };

  return (
    <div className="float-label-wrap">
      {rows ? (
        <textarea
          id={id}
          rows={rows}
          value={value}
          onChange={e => onChange(e.target.value)}
          required={required}
          placeholder=" "
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={baseStyle}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          required={required}
          placeholder=" "
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={baseStyle}
        />
      )}
      <label
        htmlFor={id}
        style={{
          position: "absolute",
          left: "1rem",
          top: isUp ? "0.35rem" : "1rem",
          fontSize: isUp ? "0.7rem" : "0.875rem",
          color: isUp ? "hsl(199,89%,60%)" : "rgba(255,255,255,0.35)",
          pointerEvents: "none",
          transition: "all 0.2s cubic-bezier(.16,1,.3,1)",
          fontWeight: isUp ? 600 : 400,
        }}
      >
        {label}
      </label>
    </div>
  );
};

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", message: "", robotCheck: false,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.08 }
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
        body: JSON.stringify({ name: formData.name, email: formData.email, phone: formData.phone, message: formData.message }),
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

  const contactDetails = [
    { icon: Mail, label: "Gmail", value: "swapnilg836@gmail.com", href: "mailto:swapnilg836@gmail.com" },
    { icon: Phone, label: "WhatsApp", value: "+91 8605887561", href: "https://wa.me/918605887561" },
    { icon: MapPin, label: "Location", value: "Yeola, Nashik — 423401, MH", href: null },
    { icon: MessageCircle, label: "Outlook", value: "swapnilg836@outlook.com", href: "mailto:swapnilg836@outlook.com" },
  ];

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative py-28 overflow-hidden"
      style={{ background: "#060606" }}
    >
      <div className="absolute inset-0 bg-grid pointer-events-none" style={{ opacity: 0.35 }} />

      <div
        className="decorative-bg-text pointer-events-none select-none"
        style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
      >
        CONTACT
      </div>

      {/* Glow blobs */}
      <div className="absolute pointer-events-none animate-blob" style={{ top: "-100px", left: "-100px", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, hsl(199,89%,48%,0.07) 0%, transparent 70%)", filter: "blur(60px)" }} />
      <div className="absolute pointer-events-none animate-blob" style={{ bottom: "-100px", right: "-100px", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, hsl(270,70%,60%,0.05) 0%, transparent 70%)", filter: "blur(60px)", animationDelay: "3s" }} />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div
          className="text-center mb-16"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(28px)",
            transition: "all 0.65s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <div className="section-badge justify-center mx-auto w-fit mb-4">Get In Touch</div>
          <h2 className="section-title mb-4">Contact Me</h2>
          <p className="section-subtitle mx-auto text-center">
            Let's discuss your project or just say hello — I'm always open to new opportunities
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-5 gap-8">
          {/* Left — contact info */}
          <div
            className="md:col-span-2 space-y-4"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(-24px)",
              transition: "all 0.7s cubic-bezier(.16,1,.3,1) 0.1s",
            }}
          >
            <div
              className="rounded-2xl p-6 h-full"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderLeft: "2px solid hsl(199,89%,48%,0.35)",
              }}
            >
              <h3
                className="text-white font-bold text-lg mb-6"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Let's Connect
              </h3>
              <div className="space-y-4">
                {contactDetails.map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-3 group">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{
                        background: "hsl(199,89%,48%,0.1)",
                        border: "1px solid hsl(199,89%,48%,0.2)",
                      }}
                    >
                      <Icon size={15} style={{ color: "hsl(199,89%,60%)" }} />
                    </div>
                    <div>
                      <p className="text-white/35 text-xs font-medium mb-0.5">{label}</p>
                      {href ? (
                        <a
                          href={href}
                          className="text-white/70 text-sm hover:text-white transition-colors group-hover:text-gradient-cyan"
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="text-white/65 text-sm">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Available dot */}
              <div
                className="flex items-center gap-2 mt-8 pt-6"
                style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    background: "hsl(142,70%,50%)",
                    boxShadow: "0 0 6px hsl(142,70%,50%)",
                    animation: "glowPulse 1.5s ease-in-out infinite",
                  }}
                />
                <span className="text-white/40 text-sm">Available for opportunities</span>
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div
            className="md:col-span-3"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(24px)",
              transition: "all 0.7s cubic-bezier(.16,1,.3,1) 0.15s",
            }}
          >
            {submitted ? (
              <div
                className="glass-card p-12 text-center flex flex-col items-center justify-center"
                style={{ minHeight: "400px" }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
                  style={{ background: "hsl(199,89%,48%,0.12)", border: "1px solid hsl(199,89%,48%,0.3)" }}
                >
                  <CheckCircle size={32} style={{ color: "hsl(199,89%,55%)" }} />
                </div>
                <h3 className="font-black text-2xl text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Message Sent!</h3>
                <p className="text-white/45 mb-6">Thank you for reaching out. I'll get back to you shortly.</p>
                <button onClick={() => setSubmitted(false)} className="btn-pill btn-pill-outline text-sm">
                  Send Another
                </button>
              </div>
            ) : (
              <div
                className="rounded-2xl p-8 md:p-10"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <FloatInput
                      id="contact-name"
                      label="Your Name"
                      value={formData.name}
                      onChange={v => setFormData(p => ({ ...p, name: v }))}
                      required
                    />
                    <FloatInput
                      id="contact-email"
                      label="Email Address"
                      type="email"
                      value={formData.email}
                      onChange={v => setFormData(p => ({ ...p, email: v }))}
                      required
                    />
                  </div>

                  <FloatInput
                    id="contact-phone"
                    label="Phone Number"
                    type="tel"
                    value={formData.phone}
                    onChange={v => setFormData(p => ({ ...p, phone: v }))}
                  />

                  <FloatInput
                    id="contact-message"
                    label="Your Message"
                    value={formData.message}
                    onChange={v => setFormData(p => ({ ...p, message: v }))}
                    required
                    rows={4}
                  />

                  {/* Robot check */}
                  <div className="flex items-center gap-3">
                    <div
                      className="relative w-5 h-5 rounded cursor-pointer flex-shrink-0"
                      style={{
                        background: formData.robotCheck ? "hsl(199,89%,48%)" : "rgba(255,255,255,0.06)",
                        border: `1px solid ${formData.robotCheck ? "hsl(199,89%,48%)" : "rgba(255,255,255,0.15)"}`,
                        transition: "all 0.2s ease",
                      }}
                      onClick={() => setFormData(p => ({ ...p, robotCheck: !p.robotCheck }))}
                    >
                      {formData.robotCheck && (
                        <svg viewBox="0 0 20 20" fill="none" className="absolute inset-0 p-0.5">
                          <path d="M4 10l4 4 8-8" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <label
                      className="text-white/45 text-sm cursor-pointer select-none"
                      onClick={() => setFormData(p => ({ ...p, robotCheck: !p.robotCheck }))}
                    >
                      I am not a robot 🤖
                    </label>
                  </div>

                  {/* Submit button */}
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
                        <Send size={17} />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
