import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const href = (path: string) => {
    const sep = path.includes("?") ? "&" : "?";
    return `${path}${sep}table=${searchParams.get("table") || ""}&store=${searchParams.get("store") || ""}`;
  };

  return (
    <div className="text-center py-24 space-y-6">
      <div className="text-6xl">🤔</div>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          404
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Halaman yang kamu cari tidak ditemukan.
        </p>
      </div>
      <button
        onClick={() => navigate(href("/"))}
        className="bg-primary text-white px-8 py-3 rounded-2xl font-bold tap-scale shadow-lg shadow-primary/20"
      >
        Kembali ke Menu
      </button>
    </div>
  );
};

export default NotFoundPage;
