/**
 * Default gateways for different protocols
 */
export const DEFAULT_GATEWAYS = {
  ordfs: 'https://ordfs.network',
  bitfs: 'https://x.bitfs.network',
  ipfs: 'https://ipfs.io/ipfs',
} as const;

/**
 * Regular expressions for validation
 */
export const REGEX = {
  txid: /^[a-fA-F0-9]{64}$/,
  vout: /^\d+$/,
  address: /^[1-9A-HJ-NP-Za-km-z]{25,34}$/,
  dataUri: /^data:([^;]+)(;base64)?,(.*)$/,
  protocolUrl: /^(b|ord|bitfs|ipfs):\/\/(.+)$/,
} as const;

/**
 * Protocol prefixes
 */
export const PROTOCOL_PREFIXES = {
  bitcoin: 'b://',
  ordinals: 'ord://',
  bitfs: 'bitfs://',
  ipfs: 'ipfs://',
  data: 'data:',
} as const;

/**
 * Common MIME types for images
 */
export const IMAGE_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'image/bmp',
  'image/ico',
  'image/tiff',
] as const;

/**
 * Default configuration values
 */
export const DEFAULTS = {
  cacheTTL: 3600, // 1 hour in seconds
  timeout: 30000, // 30 seconds
  fallbackImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHRleHQtYW5jaG9yPSJtaWRkbGUiIHg9IjEwMCIgeT0iMTAwIiBzdHlsZT0iZmlsbDojYWFhO2ZvbnQtd2VpZ2h0OmJvbGQ7Zm9udC1zaXplOjEzcHg7Zm9udC1mYW1pbHk6QXJpYWwsSGVsdmV0aWNhLHNhbnMtc2VyaWY7ZG9taW5hbnQtYmFzZWxpbmU6Y2VudHJhbCI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+',
} as const;