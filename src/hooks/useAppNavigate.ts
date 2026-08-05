import { useNavigate, useSearchParams } from "react-router-dom";

export function useAppNavigate() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const table = searchParams.get("table") || "";
  const store = searchParams.get("store") || "";

  const appNavigate = (
    to: string,
    options?: Parameters<typeof navigate>[1],
  ) => {
    if (to.startsWith("http") || to.startsWith("//")) {
      window.location.href = to;
      return;
    }

    const separator = to.includes("?") ? "&" : "?";
    const url = `${to}${separator}table=${encodeURIComponent(table)}&store=${encodeURIComponent(store)}`;
    navigate(url, options);
  };

  const appHref = (to: string) => {
    const separator = to.includes("?") ? "&" : "?";
    return `${to}${separator}table=${encodeURIComponent(table)}&store=${encodeURIComponent(store)}`;
  };

  return { appNavigate, appHref };
}
