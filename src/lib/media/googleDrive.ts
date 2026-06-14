// ============================================================
// NEXORA V3.3 — Google Drive Image URL Helpers
// Supports public Drive links pasted by the admin.
// ============================================================

const DRIVE_FILE_PATTERNS = [
  /drive\.google\.com\/file\/d\/([^/]+)/i,
  /drive\.google\.com\/open\?id=([^&]+)/i,
  /drive\.google\.com\/uc\?(?:export=[^&]+&)?id=([^&]+)/i,
  /lh3\.googleusercontent\.com\/d\/([^/?]+)/i,
];

export function isGoogleDriveUrl(url: string): boolean {
  return /(^https?:\/\/)?(drive\.google\.com|lh3\.googleusercontent\.com)/i.test(url.trim());
}

export function extractDriveFileId(url: string): string | null {
  const value = url.trim();
  for (const pattern of DRIVE_FILE_PATTERNS) {
    const match = value.match(pattern);
    if (match?.[1]) return decodeURIComponent(match[1]);
  }
  const idParam = new URLSearchParams(value.split('?')[1] || '').get('id');
  return idParam || null;
}

export function toGoogleDriveDirectUrl(url: string): string {
  const id = extractDriveFileId(url);
  if (!id) throw new Error('Invalid Google Drive image link. Make sure the file is public and copied from Google Drive.');
  return `https://lh3.googleusercontent.com/d/${id}`;
}

export function normalizeImageUrl(url: string): string {
  const value = url.trim();
  if (!value) return '';
  if (isGoogleDriveUrl(value)) return toGoogleDriveDirectUrl(value);
  if (/^https?:\/\//i.test(value) || value.startsWith('/')) return value;
  throw new Error('Image must be a public Google Drive link, an https URL, or a local /assets path.');
}
