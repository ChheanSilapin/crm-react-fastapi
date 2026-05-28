const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
const FILES_BASE =
  import.meta.env.VITE_FILES_BASE_URL ||
  (() => {
    try {
      const u = new URL(API_BASE);
      return u.origin;
    } catch {
      return API_BASE.replace(/\/api(?:\/.*)?$/, "").replace(
        /\/v\d+(?:\/.*)?$/,
        ""
      );
    }
  })();

export const getAssetUrl = (path) => {
  if (!path) return "";

  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("blob:")
  ) {
    return path;
  }
  return `${FILES_BASE.replace(/\/+$/, "")}/${String(path).replace(
    /^\/+/,
    ""
  )}`;
};
