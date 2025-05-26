/**
 * Supported blockchain image protocols
 */
export enum Protocol {
  Bitcoin = "b", // b://txid or b://txid_vout
  Ordinals = "ord", // ord://txid or ord://txid_vout
  BitFS = "bitfs", // bitfs://txid.out.vout
  IPFS = "ipfs", // ipfs://hash
  DataURI = "data", // data:image/png;base64,...
  HTTP = "http", // http:// or https://
  Native = "native", // Native txid or txid_vout (with optional / prefix)
  Unknown = "unknown",
}

/**
 * Parsed image URL information
 */
export interface ParsedImageURL {
  protocol: Protocol;
  original: string;
  txid?: string;
  vout?: number;
  hash?: string;
  mimeType?: string;
  data?: string;
  isValid: boolean;
  error?: string;
}

/**
 * Handler function for converting protocol URLs to display URLs
 */
export type ProtocolHandler = (parsed: ParsedImageURL) => Promise<string> | string;

/**
 * Configuration for protocol handlers
 */
export interface ProtocolHandlers {
  [Protocol.Bitcoin]?: ProtocolHandler;
  [Protocol.Ordinals]?: ProtocolHandler;
  [Protocol.BitFS]?: ProtocolHandler;
  [Protocol.IPFS]?: ProtocolHandler;
  [Protocol.DataURI]?: ProtocolHandler;
  [Protocol.HTTP]?: ProtocolHandler;
  [Protocol.Native]?: ProtocolHandler;
}

/**
 * Library configuration options
 */
export interface ImageProtocolConfig {
  handlers?: ProtocolHandlers;
  defaultGateway?: string;
  fallbackImage?: string;
  validateTxid?: boolean;
  cacheEnabled?: boolean;
  cacheTTL?: number;
}

/**
 * Options for parsing URLs
 */
export interface ParseOptions {
  strict?: boolean;
  allowNativeTxid?: boolean;
}

/**
 * Options for getting display URLs
 */
export interface DisplayOptions {
  fallback?: string;
  preferredGateway?: string;
  timeout?: number;
}
