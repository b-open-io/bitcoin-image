import { REGEX } from "./constants.js";

/**
 * Validates a Bitcoin transaction ID
 */
export function isValidTxid(txid: string): boolean {
  return REGEX.txid.test(txid);
}

/**
 * Validates a transaction output index
 */
export function isValidVout(vout: string | number): boolean {
  if (typeof vout === "number") {
    return vout >= 0 && Number.isInteger(vout);
  }
  return REGEX.vout.test(vout) && Number.parseInt(vout, 10) >= 0;
}

/**
 * Validates a Bitcoin address
 */
export function isValidAddress(address: string): boolean {
  return REGEX.address.test(address);
}

/**
 * Validates a data URI
 */
export function isValidDataUri(uri: string): boolean {
  return REGEX.dataUri.test(uri);
}

/**
 * Checks if a string is a valid protocol URL
 */
export function isProtocolUrl(url: string): boolean {
  return REGEX.protocolUrl.test(url);
}

/**
 * Validates an IPFS hash (basic validation)
 */
export function isValidIPFSHash(hash: string): boolean {
  // Basic check for IPFS v0 (base58) or v1 (base32) CIDs
  return (
    (hash.startsWith("Qm") && hash.length === 46) || // v0
    (hash.startsWith("baf") && hash.length >= 59) // v1
  );
}
