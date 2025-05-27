import { DEFAULTS } from "./constants.js";
import { createDefaultHandlers } from "./handlers.js";
import { parseImageURL } from "./parsers.js";
import {
  type DisplayOptions,
  type ImageProtocolConfig,
  type ParseOptions,
  type ParsedImageURL,
  type Protocol,
  ProtocolHandlers,
} from "./types.js";
import * as validators from "./validators.js";

export * from "./types.js";
export * from "./constants.js";
export { validators };
export * as utils from "./utils.js";

/**
 * Main class for handling blockchain image protocols
 */
export class ImageProtocols {
  private handlers: Record<Protocol, (parsed: ParsedImageURL) => Promise<string> | string>;
  private config: Required<ImageProtocolConfig>;
  private cache: Map<string, { url: string; timestamp: number }>;

  constructor(config: ImageProtocolConfig = {}) {
    this.config = {
      handlers: config.handlers || {},
      defaultGateway: config.defaultGateway || DEFAULTS.fallbackImage,
      fallbackImage: config.fallbackImage || DEFAULTS.fallbackImage,
      validateTxid: config.validateTxid !== false,
      cacheEnabled: config.cacheEnabled !== false,
      cacheTTL: config.cacheTTL || DEFAULTS.cacheTTL,
    };

    // Merge default handlers with custom handlers
    const defaultHandlers = createDefaultHandlers();
    this.handlers = { ...defaultHandlers };

    // Override with custom handlers
    for (const [protocol, handler] of Object.entries(this.config.handlers)) {
      if (handler) {
        this.handlers[protocol as Protocol] = handler;
      }
    }

    this.cache = new Map();
  }

  /**
   * Parses an image URL
   */
  parse(url: string, options?: ParseOptions): ParsedImageURL {
    return parseImageURL(url, options);
  }

  /**
   * Gets a display URL for an image
   */
  async getDisplayUrl(url: string, options: DisplayOptions = {}): Promise<string> {
    const { fallback = this.config.fallbackImage, timeout = DEFAULTS.timeout } = options;

    try {
      // Check cache first
      if (this.config.cacheEnabled) {
        const cached = this.getFromCache(url);
        if (cached) return cached;
      }

      // Parse the URL
      const parsed = this.parse(url);

      if (!parsed.isValid) {
        console.warn(`Invalid image URL: ${url}`, parsed.error);
        return fallback;
      }

      // Get the handler for this protocol
      const handler = this.handlers[parsed.protocol];
      if (!handler) {
        console.warn(`No handler for protocol: ${parsed.protocol}`);
        return fallback;
      }

      // Execute handler with timeout
      let displayUrl: string;
      if (timeout > 0) {
        displayUrl = await this.withTimeout(handler(parsed), timeout);
      } else {
        displayUrl = await handler(parsed);
      }

      // Cache the result
      if (this.config.cacheEnabled) {
        this.addToCache(url, displayUrl);
      }

      return displayUrl;
    } catch (error) {
      console.error(`Error getting display URL for ${url}:`, error);
      return fallback;
    }
  }

  /**
   * Batch process multiple URLs
   */
  async getDisplayUrls(urls: string[], options: DisplayOptions = {}): Promise<Map<string, string>> {
    const results = new Map<string, string>();

    // Process in parallel with concurrency limit
    const concurrency = 10;
    const chunks = [];

    for (let i = 0; i < urls.length; i += concurrency) {
      chunks.push(urls.slice(i, i + concurrency));
    }

    for (const chunk of chunks) {
      const promises = chunk.map(async (url) => {
        const displayUrl = await this.getDisplayUrl(url, options);
        results.set(url, displayUrl);
      });

      await Promise.all(promises);
    }

    return results;
  }

  /**
   * Validates an image URL
   */
  validate(url: string): { isValid: boolean; error?: string } {
    const parsed = this.parse(url);
    return {
      isValid: parsed.isValid,
      error: parsed.error,
    };
  }

  /**
   * Registers a custom handler for a protocol
   */
  registerHandler(
    protocol: Protocol,
    handler: (parsed: ParsedImageURL) => Promise<string> | string,
  ): void {
    this.handlers[protocol] = handler;
  }

  /**
   * Clears the cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Gets cache statistics
   */
  getCacheStats(): { size: number; hits: number; misses: number } {
    return {
      size: this.cache.size,
      hits: 0, // Would need to track this
      misses: 0, // Would need to track this
    };
  }

  /**
   * Gets the fallback image URL
   */
  getFallbackImage(): string {
    return this.config.fallbackImage;
  }

  private getFromCache(url: string): string | null {
    const cached = this.cache.get(url);
    if (!cached) return null;

    const age = Date.now() - cached.timestamp;
    if (age > this.config.cacheTTL * 1000) {
      this.cache.delete(url);
      return null;
    }

    return cached.url;
  }

  private addToCache(originalUrl: string, displayUrl: string): void {
    this.cache.set(originalUrl, {
      url: displayUrl,
      timestamp: Date.now(),
    });

    // Limit cache size
    if (this.cache.size > 1000) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }
  }

  private async withTimeout<T>(promise: Promise<T> | T, timeoutMs: number): Promise<T> {
    if (!(promise instanceof Promise)) {
      return promise;
    }

    return Promise.race([
      promise,
      new Promise<T>((_, reject) => setTimeout(() => reject(new Error("Timeout")), timeoutMs)),
    ]);
  }
}

/**
 * Convenience function to create an instance
 */
export function createImageProtocols(config?: ImageProtocolConfig): ImageProtocols {
  return new ImageProtocols(config);
}

/**
 * Convenience function for one-off parsing
 */
export function parse(url: string, options?: ParseOptions): ParsedImageURL {
  return parseImageURL(url, options);
}

/**
 * Convenience function for one-off display URL generation
 */
export async function getDisplayUrl(url: string, options?: DisplayOptions): Promise<string> {
  const instance = new ImageProtocols();
  return instance.getDisplayUrl(url, options);
}
