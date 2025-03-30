const baseConfig = {
  darkMode: ["class"],
  content: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}", "*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

module.exports = {
  darkMode: baseConfig.darkMode,
  content: ["./src/**/*.{js,jsx,ts,tsx}", "*.{js,ts,jsx,tsx,mdx}", ...baseConfig.content],
  theme: {
    extend: {
      ...baseConfig.theme.extend,
      colors: {
        ...baseConfig.theme.extend.colors,
        semoblack: "#0F1319",
        semored: "#E6323E",
        semogray: "#1E2331",
        gaming: {
          50: "#f0f2ff",
          100: "#dde0ff",
          200: "#c2c7ff",
          300: "#9da3ff",
          400: "#7674ff",
          500: "#624df8",
          600: "#5332ed",
          700: "#4625d2",
          800: "#3a20ab",
          900: "#321e86",
          950: "#1e1150",
        },
        neon: {
          red: "#FF2D55",
          blue: "#35EDFB",
          pink: "#FF36AB",
          green: "#00FF85",
          yellow: "#FFD60A",
        },
        dark: {
          100: "#1A1E26",
          200: "#161A21",
          300: "#10141B",
          400: "#0C0E14",
          500: "#080A0E",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gaming-grid": "url('/grid-pattern.png')",
        "hexagon-pattern": "url('/hexagon-pattern.png')",
      },
      boxShadow: {
        "neon-red": "0 0 5px #FF2D55, 0 0 20px rgba(255, 45, 85, 0.4)",
        "neon-blue": "0 0 5px #35EDFB, 0 0 20px rgba(53, 237, 251, 0.4)",
        "inner-glow": "inset 0 0 15px rgba(255, 255, 255, 0.15)",
      },
      fontFamily: {
        gaming: ["Audiowide", "Rajdhani", "sans-serif"],
        esports: ["Industry", "Rajdhani", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 6s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(255, 45, 85, 0.5)" },
          "100%": { boxShadow: "0 0 20px rgba(255, 45, 85, 0.8), 0 0 30px rgba(255, 45, 85, 0.6)" },
        },
      },
    },
  },
  plugins: [...baseConfig.plugins],
}

