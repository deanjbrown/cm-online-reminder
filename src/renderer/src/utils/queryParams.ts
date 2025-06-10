export function getAPIUserId(): string | null {
  const isDev = import.meta.env.MODE === "development";
  const isBrowserRouter = import.meta.env.VITE_ROUTER_TYPE === "browser";

  if (isDev && isBrowserRouter) {
    // Development + BrowserRouter
    const queryParams = new URLSearchParams(window.location.search);
    return queryParams.get("id");
  } else {
    // Production + HashRouter
    const hash = window.location.hash; // e.g. "#/vehicles?id=123"
    const queryStart = hash.indexOf("?");
    const queryParams = new URLSearchParams(
      queryStart !== -1 ? hash.slice(queryStart + 1) : ""
    );
    return queryParams.get("id");
  }
}