import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

// A production build must never embed localhost. CI sets VITE_API_BASE_URL to
// the real deployment domain; if it's missing or points at localhost the
// build fails here instead of silently shipping a bundle that talks to a
// developer's machine (P6-04 fail-safe).
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")

  if (mode === "production") {
    // loadEnv only reads .env files; CI / Vercel pass the value via process
    // env, so check both sources.
    const apiBaseUrl = env.VITE_API_BASE_URL || process.env.VITE_API_BASE_URL
    if (!apiBaseUrl) {
      throw new Error(
        "VITE_API_BASE_URL is required for production builds. Set it in CI / Vercel " +
          "environment variables (e.g. VITE_API_BASE_URL=https://api-bisa-nota.vercel.app)."
      )
    }
    if (/localhost|127\.0\.0\.1/.test(apiBaseUrl)) {
      throw new Error(
        "VITE_API_BASE_URL must point to a real deployment for production builds " +
          `(got: ${apiBaseUrl}). Production bundles must not target localhost.`
      )
    }
  }

  return {
    plugins: [react(), tailwindcss()],
  }
})