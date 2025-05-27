import { PROTOCOL_PREFIXES, REGEX } from "./constants.js";
import { type ParseOptions, type ParsedImageURL, Protocol } from "./types.js";
import { isValidDataUri, isValidIPFSHash, isValidTxid, isValidVout } from "./validators.js";

/**
 * Parses a blockchain image URL into its components
 */
export function parseImageURL(url: string, options: ParseOptions = {}): ParsedImageURL {
  const { strict = false, allowNativeTxid = true } = options;

  // Handle empty or invalid input
  if (!url || typeof url !== "string") {
    return {
      protocol: Protocol.Unknown,
      original: url || "",
      isValid: false,
      error: "Invalid input",
    };
  }

  const trimmedUrl = url.trim();

  // Check for data URI
  if (trimmedUrl.startsWith("data:")) {
    return parseDataUri(trimmedUrl);
  }

  // Check for HTTP(S) URLs
  if (trimmedUrl.startsWith("http://") || trimmedUrl.startsWith("https://")) {
    return {
      protocol: Protocol.HTTP,
      original: trimmedUrl,
      isValid: true,
    };
  }

  // Check for protocol URLs
  const protocolMatch = trimmedUrl.match(REGEX.protocolUrl);
  if (protocolMatch) {
    const [, protocolName, content] = protocolMatch;

    switch (protocolName.toLowerCase()) {
      case "b":
        return parseBitcoinUrl(trimmedUrl, content);
      case "ord":
        return parseOrdinalsUrl(trimmedUrl, content);
      case "bitfs":
        return parseBitFSUrl(trimmedUrl, content);
      case "ipfs":
        return parseIPFSUrl(trimmedUrl, content);
      default:
        return {
          protocol: Protocol.Unknown,
          original: trimmedUrl,
          isValid: false,
          error: `Unknown protocol: ${protocolName}`,
        };
    }
  }

  // Check for native txid or txid_vout format (with optional / prefix)
  if (allowNativeTxid) {
    return parseNativeFormat(trimmedUrl);
  }

  return {
    protocol: Protocol.Unknown,
    original: trimmedUrl,
    isValid: false,
    error: "Unrecognized format",
  };
}

/**
 * Parses a data URI
 */
function parseDataUri(uri: string): ParsedImageURL {
  const match = uri.match(REGEX.dataUri);
  if (!match) {
    return {
      protocol: Protocol.DataURI,
      original: uri,
      isValid: false,
      error: "Invalid data URI format",
    };
  }

  const [, mimeType, , data] = match;
  return {
    protocol: Protocol.DataURI,
    original: uri,
    mimeType,
    data,
    isValid: true,
  };
}

/**
 * Parses b:// URLs
 */
function parseBitcoinUrl(original: string, content: string): ParsedImageURL {
  // Handle b://txid or b://txid_vout
  const parts = content.split("_");
  const txid = parts[0];
  const vout = parts[1];

  if (!isValidTxid(txid)) {
    return {
      protocol: Protocol.Bitcoin,
      original,
      isValid: false,
      error: "Invalid transaction ID",
    };
  }

  const result: ParsedImageURL = {
    protocol: Protocol.Bitcoin,
    original,
    txid,
    isValid: true,
  };

  if (vout !== undefined) {
    if (!isValidVout(vout)) {
      return {
        ...result,
        isValid: false,
        error: "Invalid output index",
      };
    }
    result.vout = Number.parseInt(vout, 10);
  }

  return result;
}

/**
 * Parses ord:// URLs
 */
function parseOrdinalsUrl(original: string, content: string): ParsedImageURL {
  // Handle ord://txid or ord://txid_vout or ord://txid.vout
  let txid: string;
  let vout: string | undefined;

  if (content.includes("_")) {
    [txid, vout] = content.split("_");
  } else if (content.includes(".")) {
    [txid, vout] = content.split(".");
  } else {
    txid = content;
  }

  if (!isValidTxid(txid)) {
    return {
      protocol: Protocol.Ordinals,
      original,
      isValid: false,
      error: "Invalid transaction ID",
    };
  }

  const result: ParsedImageURL = {
    protocol: Protocol.Ordinals,
    original,
    txid,
    isValid: true,
  };

  if (vout !== undefined) {
    if (!isValidVout(vout)) {
      return {
        ...result,
        isValid: false,
        error: "Invalid output index",
      };
    }
    result.vout = Number.parseInt(vout, 10);
  }

  return result;
}

/**
 * Parses bitfs:// URLs
 */
function parseBitFSUrl(original: string, content: string): ParsedImageURL {
  // Handle bitfs://txid.out.vout or bitfs://txid
  const parts = content.split(".");
  const txid = parts[0];

  if (!isValidTxid(txid)) {
    return {
      protocol: Protocol.BitFS,
      original,
      isValid: false,
      error: "Invalid transaction ID",
    };
  }

  const result: ParsedImageURL = {
    protocol: Protocol.BitFS,
    original,
    txid,
    isValid: true,
  };

  // Check for .out.vout pattern (with optional chunk identifier)
  if (parts.length >= 3 && parts[1] === "out") {
    const vout = parts[2];
    if (!isValidVout(vout)) {
      return {
        ...result,
        isValid: false,
        error: "Invalid output index",
      };
    }
    result.vout = Number.parseInt(vout, 10);
  }

  return result;
}

/**
 * Parses ipfs:// URLs
 */
function parseIPFSUrl(original: string, content: string): ParsedImageURL {
  if (!isValidIPFSHash(content)) {
    return {
      protocol: Protocol.IPFS,
      original,
      isValid: false,
      error: "Invalid IPFS hash",
    };
  }

  return {
    protocol: Protocol.IPFS,
    original,
    hash: content,
    isValid: true,
  };
}

/**
 * Parses native txid or outpoint formats (with optional / prefix)
 * Supports:
 * - txid, txid_vout, txid.vout
 * - txido0, txidi0 (Bitcoin-style output/input notation)
 * - /txid, /txid_vout, /txid.vout
 * - /content/txid, /content/txid_vout, /content/txid.vout
 */
function parseNativeFormat(input: string): ParsedImageURL {
  // Remove leading slash if present
  let cleaned = input.startsWith("/") ? input.slice(1) : input;

  // Check for content/ prefix and remove it
  const hasContentPrefix = cleaned.startsWith("content/");
  if (hasContentPrefix) {
    cleaned = cleaned.slice(8); // Remove 'content/'
  }

  // Check for txid_vout format
  if (cleaned.includes("_")) {
    const [txid, vout] = cleaned.split("_");
    if (isValidTxid(txid) && isValidVout(vout)) {
      return {
        protocol: Protocol.Native,
        original: input,
        txid,
        vout: Number.parseInt(vout, 10),
        isValid: true,
      };
    }
  }

  // Check for txid.vout format (dot notation)
  if (cleaned.includes(".")) {
    const [txid, vout] = cleaned.split(".");
    if (isValidTxid(txid) && isValidVout(vout)) {
      return {
        protocol: Protocol.Native,
        original: input,
        txid,
        vout: Number.parseInt(vout, 10),
        isValid: true,
      };
    }
  }

  // Check for Bitcoin-style outpoint formats: txido0, txidi0 (output/input notation)
  const outpointMatch = cleaned.match(/^([a-fA-F0-9]{64})([oi])(\d+)$/);
  if (outpointMatch) {
    const [, txid, type, vout] = outpointMatch;
    if (isValidTxid(txid) && isValidVout(vout)) {
      return {
        protocol: Protocol.Native,
        original: input,
        txid,
        vout: Number.parseInt(vout, 10),
        isValid: true,
      };
    }
  }

  // Check for plain txid
  if (isValidTxid(cleaned)) {
    return {
      protocol: Protocol.Native,
      original: input,
      txid: cleaned,
      isValid: true,
    };
  }

  return {
    protocol: Protocol.Unknown,
    original: input,
    isValid: false,
    error: "Invalid format",
  };
}
