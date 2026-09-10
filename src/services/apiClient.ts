import axios from "axios";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// Dev keeps a localhost convenience fallback; production must never silently
// fall back to localhost (the deployed app would call the developer's machine).
// If a production build is somehow shipped without VITE_API_BASE_URL this
// throws loudly at load instead of talking to localhost.
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? "http://localhost:5001" : "");

if (!API_BASE_URL) {
  throw new Error(
    "VITE_API_BASE_URL is required in production. Set it in CI / Vercel environment variables (e.g. VITE_API_BASE_URL=https://api-bisa-nota.vercel.app)."
  );
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status: number = error.response.status;
      const message =
        error.response.data?.message ||
        (status === 401
          ? "Sesi telah berakhir. Silakan muat ulang halaman."
          : status === 403
            ? "Kamu tidak memiliki akses untuk melakukan ini."
            : status === 404
              ? "Data tidak ditemukan."
              : status === 429
                ? "Terlalu banyak permintaan. Tunggu sebentar lalu coba lagi."
                : status >= 500
                  ? "Terjadi kesalahan pada server. Coba lagi nanti."
                  : "Terjadi kesalahan");
      return Promise.reject(new ApiError(message, status));
    }
    if (error.code === "ECONNABORTED") {
      return Promise.reject(
        new ApiError("Koneksi timeout. Periksa jaringan dan coba lagi.", 0),
      );
    }
    return Promise.reject(
      new ApiError(
        error.message || "Tidak dapat terhubung ke server.",
        0,
      ),
    );
  },
);

export default apiClient;
