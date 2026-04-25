import { defineConfig, presetMini } from "unocss";

// url de los colores
// https://www.tints.dev/palette/v1:cHJpbWFyeXwxRjk0RDF8NTAwfHB8MHwwfDB8MTAwfGF-Y2hhcmNvYWx8MzY0NTRGfDgwMHxwfDB8MHwwfDEwMHxhfmRhbmdlcnxEMTFGMkN8NjAwfHB8MHwwfDB8MTAwfGF-d2FybmluZ3xFQkE3MTN8MzAwfHB8MHwwfDB8MTAwfG1-c3VjY2Vzc3wxOEIwNDV8NDAwfHB8MHwwfDB8MTAwfG0

export default defineConfig({
  presets: [
    presetMini()
  ],
  rules: [["rounded-cu", { "border-radius": "8px" }]],
  theme: {
    colors: {
      primary: {
        50: "oklch(0.966 0.016 250.83)",
        100: "oklch(0.93 0.033 250.98)",
        200: "oklch(0.852 0.074 246.29)",
        300: "oklch(0.78 0.117 242.66)",
        400: "oklch(0.702 0.147 238.27)",
        500: "oklch(0.634 0.133 238.39)",
        600: "oklch(0.531 0.11 237.85)",
        700: "oklch(0.438 0.091 238.05)",
        800: "oklch(0.335 0.069 237.99)",
        900: "oklch(0.239 0.05 237.95)",
        950: "oklch(0.186 0.039 237.79)",
        DEFAULT: "oklch(0.634 0.133 238.39)",
      },
      charcoal: {
        50: "oklch(0.965 0.007 247.87)",
        100: "oklch(0.922 0.016 239.08)",
        200: "oklch(0.843 0.034 239.9)",
        300: "oklch(0.764 0.052 237.54)",
        400: "oklch(0.686 0.046 237.96)",
        500: "oklch(0.609 0.041 237.53)",
        600: "oklch(0.532 0.036 236.93)",
        700: "oklch(0.456 0.03 236.04)",
        800: "oklch(0.381 0.026 237.53)",
        900: "oklch(0.258 0.017 237.5)",
        950: "oklch(0.196 0.014 243.65)",
        DEFAULT: "oklch(0.381 0.026 237.53)",
      },
      danger: {
        50: "oklch(0.96 0.018 17.57)",
        100: "oklch(0.926 0.034 15.62)",
        200: "oklch(0.852 0.072 16.55)",
        300: "oklch(0.782 0.115 18.7)",
        400: "oklch(0.701 0.172 20.49)",
        500: "oklch(0.633 0.232 24.41)",
        600: "oklch(0.554 0.209 24.77)",
        700: "oklch(0.452 0.17 24.78)",
        800: "oklch(0.353 0.133 24.86)",
        900: "oklch(0.244 0.092 24.93)",
        950: "oklch(0.196 0.074 24.26)",
        DEFAULT: "oklch(0.554 0.209 24.77)",
      },
      warning: {
        50: "oklch(0.966 0.022 63.22)",
        100: "oklch(0.925 0.053 67.08)",
        200: "oklch(0.849 0.127 74.95)",
        300: "oklch(0.774 0.158 78.6)",
        400: "oklch(0.686 0.14 78.91)",
        500: "oklch(0.591 0.12 78.26)",
        600: "oklch(0.505 0.103 78.47)",
        700: "oklch(0.407 0.083 78.11)",
        800: "oklch(0.321 0.065 77.83)",
        900: "oklch(0.226 0.045 79.3)",
        950: "oklch(0.179 0.037 79.01)",
        DEFAULT: "oklch(0.774 0.158 78.6)",
      },
      success: {
        50: "oklch(0.958 0.069 148.72)",
        100: "oklch(0.903 0.173 147.9)",
        200: "oklch(0.83 0.237 147.23)",
        300: "oklch(0.753 0.215 147.21)",
        400: "oklch(0.662 0.189 147.14)",
        500: "oklch(0.577 0.165 147.16)",
        600: "oklch(0.486 0.138 147.29)",
        700: "oklch(0.403 0.115 147.26)",
        800: "oklch(0.311 0.089 147.04)",
        900: "oklch(0.228 0.065 147.29)",
        950: "oklch(0.171 0.049 145.88)",
        DEFAULT: "oklch(0.662 0.189 147.14)",
      },
    },
  },
  content: {
    pipeline: {
      include: [
        /\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/,
        "src/**/*.{vue,ts,js}",
      ],
    },
  },
});
