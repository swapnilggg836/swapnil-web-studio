import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// Portfolio specific colors
				'hero-start': 'hsl(var(--hero-gradient-start))',
				'hero-end': 'hsl(var(--hero-gradient-end))',
				'section-bg': 'hsl(var(--section-bg))',
				'skill-bar': 'hsl(var(--skill-bar))',
				'glow': 'hsl(var(--glow))',
				'cyan': 'hsl(199, 89%, 48%)',
				'cyan-dim': 'hsl(199, 89%, 20%)',
			},
			backgroundImage: {
				'hero-gradient': 'linear-gradient(135deg, hsl(var(--hero-gradient-start)), hsl(var(--hero-gradient-end)))',
				'section-gradient': 'linear-gradient(180deg, hsl(var(--section-bg)), hsl(var(--background)))',
				'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
			},
			boxShadow: {
				'glow': '0 0 30px hsl(var(--glow) / 0.5), 0 8px 40px rgba(0,0,0,0.5)',
				'glow-sm': '0 0 15px hsl(var(--glow) / 0.3), 0 4px 20px rgba(0,0,0,0.4)',
				'glow-lg': '0 0 60px hsl(var(--glow) / 0.4), 0 20px 60px rgba(0,0,0,0.6)',
				'card-dark': '0 8px 32px rgba(0,0,0,0.6)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
