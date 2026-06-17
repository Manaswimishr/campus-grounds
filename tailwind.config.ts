import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        board: {
          DEFAULT: "#212E29",
          soft: "#2B3B34",
          line: "#3A4B43",
        },
        chalk: {
          DEFAULT: "#F6F1E4",
          dim: "#DCD6C4",
        },
        espresso: {
          DEFAULT: "#3A2A1E",
          soft: "#5B4434",
        },
        crema: {
          DEFAULT: "#E7AE52",
          bright: "#F4C679",
          deep: "#C98F36",
        },
        stamp: {
          DEFAULT: "#BD4B2C",
          soft: "#D97350",
        },
        paper: "#FFFDF8",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "chalk-grain":
          "radial-gradient(circle at 1px 1px, rgba(246,241,228,0.045) 1px, transparent 0)",
      },
      borderRadius: {
        chip: "999px",
      },
      boxShadow: {
        ticket: "0 18px 40px -18px rgba(33,46,41,0.45)",
        lift: "0 1px 0 rgba(255,255,255,0.4) inset, 0 10px 24px -12px rgba(58,42,30,0.25)",
      },
      keyframes: {
        ticketCycle: {
          "0%, 100%": { transform: "translateY(0)" },
        },
        riseIn: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        steam: {
          "0%": { transform: "translateY(0) scaleX(1)", opacity: "0.55" },
          "50%": { transform: "translateY(-10px) scaleX(1.15)", opacity: "0.9" },
          "100%": { transform: "translateY(-22px) scaleX(0.9)", opacity: "0" },
        },
        marquee: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-50%)" },
        },
        pulseDot: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
      },
      animation: {
        "rise-in": "riseIn 0.6s cubic-bezier(0.16,1,0.3,1) both",
        steam: "steam 2.6s ease-in-out infinite",
        marquee: "marquee 14s linear infinite",
        "pulse-dot": "pulseDot 1.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
