const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Tambahkan basePath ke path aset di /public, mis. "/images/x.webp". */
export function asset(path: string): string {
  if (/^(https?:)?\/\//.test(path)) return path;
  return `${BASE_PATH}${path.startsWith("/") ? path : `/${path}`}`;
}
