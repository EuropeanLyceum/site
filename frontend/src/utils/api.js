/**
 * Get the API base URL from environment variable
 * If NEXT_PUBLIC_API_URL is not set, use relative URLs (same origin)
 * This allows the frontend to work with nginx reverse proxy
 */
export function getApiUrl() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
  // If empty, return empty string for relative URLs
  // If set, ensure it doesn't end with a slash
  return apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
}

/**
 * Build a full API endpoint URL
 * @param {string} endpoint - API endpoint path (e.g., '/api/news')
 * @returns {string} Full URL or relative URL
 */
export function apiUrl(endpoint) {
  const baseUrl = getApiUrl();
  // Ensure endpoint starts with /
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return baseUrl ? `${baseUrl}${path}` : path;
}

/**
 * Build a full URL for static assets (images, uploads)
 * @param {string} path - Asset path (e.g., '/uploads/image.jpg')
 * @returns {string} Full URL or relative URL
 */
export function assetUrl(path) {
  if (!path) return '';
  // If path already starts with http, return as is
  if (path.startsWith('http')) return path;
  
  const baseUrl = getApiUrl();
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return baseUrl ? `${baseUrl}${normalizedPath}` : normalizedPath;
}

