import { DEFAULTS, DEFAULT_GATEWAYS } from "./constants.js";
import type { ParsedImageURL, ProtocolHandler } from "./types.js";
import { Protocol } from "./types.js";

/**
 * Default handler for Bitcoin Files Protocol (b://)
 */
export const bitcoinHandler: ProtocolHandler = (parsed: ParsedImageURL): string => {
  if (!parsed.txid) {
    throw new Error("Missing transaction ID");
  }

  const vout = parsed.vout ?? 0;
  return `${DEFAULT_GATEWAYS.ordfs}/${parsed.txid}_${vout}`;
};

/**
 * Default handler for Ordinals protocol (ord://)
 */
export const ordinalsHandler: ProtocolHandler = (parsed: ParsedImageURL): string => {
  if (!parsed.txid) {
    throw new Error("Missing transaction ID");
  }

  if (parsed.vout !== undefined) {
    return `${DEFAULT_GATEWAYS.ordfs}/${parsed.txid}_${parsed.vout}`;
  }

  return `${DEFAULT_GATEWAYS.ordfs}/${parsed.txid}`;
};

/**
 * Default handler for BitFS protocol (bitfs://)
 */
export const bitfsHandler: ProtocolHandler = (parsed: ParsedImageURL): string => {
  if (!parsed.txid) {
    throw new Error("Missing transaction ID");
  }

  if (parsed.vout !== undefined) {
    return `${DEFAULT_GATEWAYS.ordfs}/${parsed.txid}_${parsed.vout}`;
  }

  return `${DEFAULT_GATEWAYS.bitfs}/${parsed.txid}`;
};

/**
 * Default handler for IPFS protocol (ipfs://)
 */
export const ipfsHandler: ProtocolHandler = (parsed: ParsedImageURL): string => {
  if (!parsed.hash) {
    throw new Error("Missing IPFS hash");
  }

  return `${DEFAULT_GATEWAYS.ipfs}/${parsed.hash}`;
};

/**
 * Default handler for data URIs
 */
export const dataUriHandler: ProtocolHandler = (parsed: ParsedImageURL): string => {
  // Data URIs are already display-ready
  return parsed.original;
};

/**
 * Default handler for HTTP(S) URLs
 */
export const httpHandler: ProtocolHandler = (parsed: ParsedImageURL): string => {
  // HTTP URLs are already display-ready
  return parsed.original;
};

/**
 * Default handler for native txid format
 */
export const nativeHandler: ProtocolHandler = (parsed: ParsedImageURL): string => {
  if (!parsed.txid) {
    throw new Error("Missing transaction ID");
  }

  const vout = parsed.vout ?? 0;
  return `${DEFAULT_GATEWAYS.ordfs}/${parsed.txid}_${vout}`;
};

/**
 * Creates default protocol handlers
 */
export function createDefaultHandlers(): Record<Protocol, ProtocolHandler> {
  return {
    [Protocol.Bitcoin]: bitcoinHandler,
    [Protocol.Ordinals]: ordinalsHandler,
    [Protocol.BitFS]: bitfsHandler,
    [Protocol.IPFS]: ipfsHandler,
    [Protocol.DataURI]: dataUriHandler,
    [Protocol.HTTP]: httpHandler,
    [Protocol.Native]: nativeHandler,
    [Protocol.Unknown]: () => {
      throw new Error("Unknown protocol");
    },
  };
}
