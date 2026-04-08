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
  options?: RequestInit & { silent?: boolean },
  fallback?: T
): Promise<T> {
  try {
    const res = await fetch(url, options);
    
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        
        // Only log warning if not in silent mode
        if (!options?.silent) {
            console.warn(`[API Error] ${url}: ${errorData.error || errorData.message || res.status}`);
        }
        
        if (fallback !== undefined) return fallback;
        
        // Pass the status code in the error message for easier handling in callers
        const error = new Error(errorData.error || errorData.message || `HTTP ${res.status}`);
        (error as any).status = res.status;
        throw error;
    }

    const data = await res.json();
    return data.data || data; 

  } catch (err: any) {
    // If we've already thrown a specific API error, re-throw it
    if (err.status) throw err;

    if (!options?.silent) {
        console.warn(`[API Network Error] Request to ${url} failed.`, err);
    }
    
    if (fallback !== undefined) {
        return fallback;
    }

    return (Array.isArray(fallback) ? [] : {}) as T;
  }
}
