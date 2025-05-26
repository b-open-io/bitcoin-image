import { describe, expect, test } from "bun:test";
import {
  bitcoinHandler,
  bitfsHandler,
  dataUriHandler,
  httpHandler,
  ipfsHandler,
  nativeHandler,
  ordinalsHandler,
} from "../src/handlers";
import { Protocol } from "../src/types";

describe("Protocol Handlers", () => {
  describe("bitcoinHandler", () => {
    test("handles txid with default vout", () => {
      const result = bitcoinHandler({
        protocol: Protocol.Bitcoin,
        original: "b://6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910",
        txid: "6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910",
        isValid: true,
      });
      expect(result).toBe(
        "https://ordfs.network/6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910_0",
      );
    });

    test("handles txid with specific vout", () => {
      const result = bitcoinHandler({
        protocol: Protocol.Bitcoin,
        original: "b://6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910_3",
        txid: "6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910",
        vout: 3,
        isValid: true,
      });
      expect(result).toBe(
        "https://ordfs.network/6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910_3",
      );
    });

    test("throws on missing txid", () => {
      expect(() => {
        bitcoinHandler({
          protocol: Protocol.Bitcoin,
          original: "b://",
          isValid: false,
        });
      }).toThrow("Missing transaction ID");
    });
  });

  describe("ordinalsHandler", () => {
    test("handles txid without vout", () => {
      const result = ordinalsHandler({
        protocol: Protocol.Ordinals,
        original: "ord://6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910",
        txid: "6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910",
        isValid: true,
      });
      expect(result).toBe(
        "https://ordfs.network/6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910",
      );
    });

    test("handles txid with vout", () => {
      const result = ordinalsHandler({
        protocol: Protocol.Ordinals,
        original: "ord://6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910_2",
        txid: "6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910",
        vout: 2,
        isValid: true,
      });
      expect(result).toBe(
        "https://ordfs.network/6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910_2",
      );
    });
  });

  describe("bitfsHandler", () => {
    test("handles txid without vout", () => {
      const result = bitfsHandler({
        protocol: Protocol.BitFS,
        original: "bitfs://6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910",
        txid: "6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910",
        isValid: true,
      });
      expect(result).toBe(
        "https://x.bitfs.network/6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910",
      );
    });

    test("handles txid with vout", () => {
      const result = bitfsHandler({
        protocol: Protocol.BitFS,
        original: "bitfs://6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910.out.3",
        txid: "6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910",
        vout: 3,
        isValid: true,
      });
      expect(result).toBe(
        "https://ordfs.network/6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910_3",
      );
    });
  });

  describe("ipfsHandler", () => {
    test("handles IPFS hash", () => {
      const result = ipfsHandler({
        protocol: Protocol.IPFS,
        original: "ipfs://QmHash",
        hash: "QmHash",
        isValid: true,
      });
      expect(result).toBe("https://ipfs.io/ipfs/QmHash");
    });

    test("throws on missing hash", () => {
      expect(() => {
        ipfsHandler({
          protocol: Protocol.IPFS,
          original: "ipfs://",
          isValid: false,
        });
      }).toThrow("Missing IPFS hash");
    });
  });

  describe("dataUriHandler", () => {
    test("returns original data URI", () => {
      const dataUri = "data:image/png;base64,abc123";
      const result = dataUriHandler({
        protocol: Protocol.DataURI,
        original: dataUri,
        isValid: true,
      });
      expect(result).toBe(dataUri);
    });
  });

  describe("httpHandler", () => {
    test("returns original HTTP URL", () => {
      const url = "https://example.com/image.png";
      const result = httpHandler({
        protocol: Protocol.HTTP,
        original: url,
        isValid: true,
      });
      expect(result).toBe(url);
    });
  });

  describe("nativeHandler", () => {
    test("handles native txid with default vout", () => {
      const result = nativeHandler({
        protocol: Protocol.Native,
        original: "6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910",
        txid: "6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910",
        isValid: true,
      });
      expect(result).toBe(
        "https://ordfs.network/6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910_0",
      );
    });

    test("handles native txid with vout", () => {
      const result = nativeHandler({
        protocol: Protocol.Native,
        original: "6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910_2",
        txid: "6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910",
        vout: 2,
        isValid: true,
      });
      expect(result).toBe(
        "https://ordfs.network/6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910_2",
      );
    });
  });
});
