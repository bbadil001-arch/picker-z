/**
 * Client-Side Security & Sanitization Utilities
 * Protects against XSS, script injections, and malformed inputs.
 */

// Strip dangerous script tags, javascript: protocols, and event handlers
export function sanitizeHtml(input: string): string {
  if (!input || typeof input !== 'string') return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/javascript:[^"']*/gi, '')
    .replace(/[<>]/g, '')
    .trim();
}

// Sanitize option labels for the spin wheel
export function sanitizeOptionLabel(label: string): string {
  if (!label || typeof label !== 'string') return '';
  return sanitizeHtml(label).slice(0, 100);
}

// Safe URL decoder with error recovery
export function safeDecodeURI(encoded: string): string {
  try {
    return decodeURIComponent(encoded);
  } catch (e) {
    try {
      return unescape(encoded);
    } catch {
      return encoded;
    }
  }
}
