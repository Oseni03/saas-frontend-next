import { useState, useEffect } from "react";
import { useTheme } from "@/contexts/theme-control";
import { Sliders, RefreshCw, Layers, Sun, Moon } from "lucide-react";
import { BrandColorPreset } from "@/types";

export const COLOR_PRESETS: BrandColorPreset[] = [
  {
    name: "Indigo Spark",
    hex: "#4f46e5",
    bgHex: "#ffffff",
    fgHex: "#ffffff",
  },
  {
    name: "Monochrome Noir",
    hex: "#000000",
    bgHex: "#ffffff",
    fgHex: "#ffffff",
  },
  { name: "Cobalt Blue", hex: "#1e40af", bgHex: "#ffffff", fgHex: "#ffffff" },
  {
    name: "Emerald Forest",
    hex: "#065f46",
    bgHex: "#ffffff",
    fgHex: "#ffffff",
  },
  {
    name: "Iris Magenta",
    hex: "#701a75",
    bgHex: "#ffffff",
    fgHex: "#ffffff",
  },
  { name: "Rust Clay", hex: "#9a3412", bgHex: "#ffffff", fgHex: "#ffffff" },
  {
    name: "Saffron Gold",
    hex: "#b45309",
    bgHex: "#ffffff",
    fgHex: "#ffffff",
  },
];

export default function ThemeControl() {
  const {
    themeMode,
    toggleTheme,
    primaryColor,
    setPrimaryColor,
    resetPrimaryColor,
    isDark,
  } = useTheme();
  const [customHex, setCustomHex] = useState(primaryColor);
  const [isOpen, setIsOpen] = useState(false);

  // Sync internal text input state with shared context when context updates
  useEffect(() => {
    setCustomHex(primaryColor);
  }, [primaryColor]);

  const handleColorChange = (color: string) => {
    setPrimaryColor(color);
    setCustomHex(color);
  };

  const handleReset = () => {
    resetPrimaryColor();
    setCustomHex("#4f46e5");
  };

  return (
    <div
      id="brand-control-container"
      className="fixed bottom-6 right-6 z-50 font-sans"
    >
      {/* Closed State Toggle Button */}
      {!isOpen ? (
        <button
          id="theme-toggle-open-btn"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-background border border-border text-xs font-mono uppercase tracking-widest text-foreground hover:bg-foreground hover:text-background transition-colors cursor-pointer"
        >
          <Sliders className="w-3 h-3 text-primary animate-pulse" />
          <span>Brand Sandbox</span>
        </button>
      ) : (
        /* Expanded Dynamic Customizer Pane (Strictly wireframed, no box shadows) */
        <div
          id="theme-customizer-panel"
          className="w-72 bg-background border border-border p-4 flex flex-col gap-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="text-xs font-mono uppercase tracking-widest text-foreground font-semibold flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-primary" />
              Primary Variable
            </span>
            <button
              id="theme-toggle-close-btn"
              onClick={() => setIsOpen(false)}
              className="text-foreground hover:text-primary p-0.5 transition-colors cursor-pointer text-xs font-mono font-bold"
            >
              [CLOSE]
            </button>
          </div>

          {/* Canvas Mode Toggle */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono text-foreground/60 uppercase tracking-wider">
              Canvas Theme Mode
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                id="canvas-light-mode-btn"
                onClick={() => themeMode !== "light" && toggleTheme()}
                className={`flex items-center justify-center gap-1.5 py-1.5 border font-mono text-[10px] uppercase transition-all cursor-pointer ${
                  !isDark
                    ? "border-primary bg-primary text-primary-foreground font-semibold"
                    : "border-border text-foreground hover:border-foreground/50"
                }`}
              >
                <Sun className="w-3 h-3" />
                <span>Light Mode</span>
              </button>
              <button
                id="canvas-dark-mode-btn"
                onClick={() => themeMode !== "dark" && toggleTheme()}
                className={`flex items-center justify-center gap-1.5 py-1.5 border font-mono text-[10px] uppercase transition-all cursor-pointer ${
                  isDark
                    ? "border-primary bg-primary text-primary-foreground font-semibold"
                    : "border-border text-foreground hover:border-foreground/50"
                }`}
              >
                <Moon className="w-3 h-3" />
                <span>Dark Mode</span>
              </button>
            </div>
          </div>

          {/* Preset Grid */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono text-foreground/60 uppercase tracking-wider">
              Brand Presets
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {COLOR_PRESETS.map((preset) => {
                const isActive =
                  primaryColor.toLowerCase() === preset.hex.toLowerCase();
                return (
                  <button
                    key={preset.name}
                    id={`preset-${preset.name.replace(/\s+/g, "-").toLowerCase()}`}
                    onClick={() => handleColorChange(preset.hex)}
                    className={`h-8 border flex items-center justify-center p-1 text-[10px] font-mono transition-all cursor-pointer ${
                      isActive
                        ? "border-primary text-foreground font-semibold bg-foreground/5"
                        : "border-border text-foreground/70 hover:border-foreground/40"
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <span
                        className="w-2.5 h-2.5 inline-block border border-border"
                        style={{
                          backgroundColor: preset.hex,
                        }}
                      />
                      <span>{preset.name.split(" ")[1]}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Raw Input */}
          <div className="flex flex-col gap-2 pt-1">
            <span className="text-[10px] font-mono text-foreground/60 uppercase tracking-wider">
              Custom Hex Input
            </span>
            <div className="flex items-center gap-1.5">
              <input
                id="brand-color-picker"
                type="color"
                value={customHex}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-8 h-8 p-0 bg-transparent border border-border cursor-pointer"
              />
              <input
                id="brand-color-text-input"
                type="text"
                maxLength={7}
                value={customHex}
                onChange={(e) => handleColorChange(e.target.value)}
                className="flex-1 h-8 px-2 bg-background border border-border font-mono text-xs text-foreground focus:outline-none focus:border-primary uppercase"
              />
            </div>
          </div>

          {/* Quick Notice about Brand Colors & Reset */}
          <div className="flex items-center justify-between border-t border-border pt-3">
            <button
              id="theme-reset-btn"
              onClick={handleReset}
              className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-widest text-foreground/70 hover:text-foreground cursor-pointer"
            >
              <RefreshCw className="w-2.5 h-2.5" />
              <span>Reset Tone</span>
            </button>
            <span className="text-[9px] font-mono text-foreground/40 uppercase">
              Pure CSS Variable
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
