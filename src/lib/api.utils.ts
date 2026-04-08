/**
 * Standardized API Response structure for safeFetch
 */
export interface SafeResponse<T> {
  data: T | null;
  error: string | null;
  isOffline: boolean;
  status: number | null;
}

/**
 * A robust wrapper around fetch that silences network-level TypeErrors (like "Failed to fetch")
 * which often trigger the Next.js development error overlay.
 */
export async function safeFetch<T>(
  url: string,
  options?: RequestInit,
  fallback?: T
): Promise<T> {
  try {
    const res = await fetch(url, options);
    
    if (!res.ok) {

        const errorData = await res.json().catch(() => ({}));
        console.warn(`[API Error] ${url}: ${errorData.error || errorData.message || res.status}`);
        if (fallback !== undefined) return fallback;
        throw new Error(errorData.error || errorData.message || `HTTP ${res.status}`);
    }

    const data = await res.json();
    return data.data || data; 

  } catch (err) {
    console.warn(`[API Offline] Request to ${url} failed.`, err);
    
    if (fallback !== undefined) {
        return fallback;
    }

    return (Array.isArray(fallback) ? [] : {}) as T;
  }
}
