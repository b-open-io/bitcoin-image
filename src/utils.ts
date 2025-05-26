/**
 * Utility functions for image protocols
 */

/**
 * Extracts metadata from a blockchain URL
 */
export function extractMetadata(url: string): {
  protocol?: string;
  txid?: string;
  vout?: number;
  chunk?: number;
} {
  const metadata: any = {};

  // Extract protocol
  const protocolMatch = url.match(/^(\w+):\/\//);
  if (protocolMatch) {
    metadata.protocol = protocolMatch[1];
  }

  // Extract txid
  const txidMatch = url.match(/[a-fA-F0-9]{64}/);
  if (txidMatch) {
    metadata.txid = txidMatch[0];
  }

  // Extract vout from various formats
  const voutPatterns = [
    /_(\d+)$/, // txid_vout
    /\.(\d+)$/, // txid.vout
    /o(\d+)$/, // txido<vout>
    /\.out\.(\d+)/, // bitfs://txid.out.vout
  ];

  for (const pattern of voutPatterns) {
    const match = url.match(pattern);
    if (match) {
      metadata.vout = Number.parseInt(match[1], 10);
      break;
    }
  }

  // Extract chunk for bitfs
  const chunkMatch = url.match(/\.out\.(\d+)\.(\d+)/);
  if (chunkMatch) {
    metadata.vout = Number.parseInt(chunkMatch[1], 10);
    metadata.chunk = Number.parseInt(chunkMatch[2], 10);
  }

  return metadata;
}

/**
 * Generates a cache key for a URL
 */
export function getCacheKey(url: string): string {
  // Normalize the URL for consistent caching
  return url.toLowerCase().trim();
}

/**
 * Determines if a URL is likely an image based on common patterns
 */
export function isLikelyImage(url: string): boolean {
  // Check for image file extensions
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico|tiff?)$/i;
  if (imageExtensions.test(url)) {
    return true;
  }

  // Check for data URI image types
  if (url.startsWith("data:image/")) {
    return true;
  }

  // Check for known image hosting services
  const imageHosts = ["ordfs.network", "x.bitfs.network", "replicate.delivery", "cloudinary.com"];

  return imageHosts.some((host) => url.includes(host));
}

/**
 * Generates optimized image URLs for different sizes
 */
export function generateSrcSet(baseUrl: string, sizes: number[] = [320, 640, 1280]): string {
  // For ORDFS URLs, we can't generate different sizes server-side
  // But we can provide the srcset format for future optimization
  if (baseUrl.includes("ordfs.network") || baseUrl.includes("bitfs.network")) {
    return `${baseUrl} 1x`;
  }

  // For regular URLs, assume we can append size parameters
  return sizes.map((size) => `${baseUrl}?w=${size} ${size}w`).join(", ");
}

/**
 * Generates a placeholder/blur hash for an image URL
 * In production, this would generate actual blur hashes
 */
export function generatePlaceholder(url: string): string {
  // For now, return a simple SVG placeholder
  const svg = `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" fill="#e0e0e0"/>
    <text x="50" y="50" text-anchor="middle" fill="#999" font-size="14">Loading...</text>
  </svg>`;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * Validates image URL security
 */
export function validateImageSecurity(url: string): {
  isValid: boolean;
  reason?: string;
} {
  // Check for XSS attempts in data URIs
  if (url.startsWith("data:")) {
    if (url.includes("script") || url.includes("javascript:")) {
      return { isValid: false, reason: "Potential XSS in data URI" };
    }
  }

  // Check for suspicious patterns
  const suspiciousPatterns = [/javascript:/i, /vbscript:/i, /<script/i, /onerror=/i, /onload=/i];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(url)) {
      return { isValid: false, reason: "Suspicious pattern detected" };
    }
  }

  return { isValid: true };
}

/**
 * Batch validates multiple URLs efficiently
 */
export function batchValidate(urls: string[]): Map<string, boolean> {
  const results = new Map<string, boolean>();
  const txidRegex = /[a-fA-F0-9]{64}/;

  for (const url of urls) {
    // Quick validation based on format
    if (url.startsWith("data:") || url.startsWith("http")) {
      results.set(url, true);
    } else if (txidRegex.test(url)) {
      results.set(url, true);
    } else {
      results.set(url, false);
    }
  }

  return results;
}
