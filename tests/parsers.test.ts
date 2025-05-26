import { describe, expect, test } from "bun:test";
import { parseImageURL } from "../src/parsers";
import { Protocol } from "../src/types";

describe("parseImageURL", () => {
  describe("Bitcoin Protocol (b://)", () => {
    test("parses b://txid format", () => {
      const result = parseImageURL(
        "b://6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910",
      );
      expect(result.protocol).toBe(Protocol.Bitcoin);
      expect(result.txid).toBe("6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910");
      expect(result.vout).toBeUndefined();
      expect(result.isValid).toBe(true);
    });

    test("parses b://txid_vout format", () => {
      const result = parseImageURL(
        "b://6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910_3",
      );
      expect(result.protocol).toBe(Protocol.Bitcoin);
      expect(result.txid).toBe("6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910");
      expect(result.vout).toBe(3);
      expect(result.isValid).toBe(true);
    });

    test("handles invalid txid", () => {
      const result = parseImageURL("b://invalid");
      expect(result.protocol).toBe(Protocol.Bitcoin);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Invalid transaction ID");
    });
  });

  describe("Ordinals Protocol (ord://)", () => {
    test("parses ord://txid format", () => {
      const result = parseImageURL(
        "ord://6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910",
      );
      expect(result.protocol).toBe(Protocol.Ordinals);
      expect(result.txid).toBe("6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910");
      expect(result.isValid).toBe(true);
    });

    test("parses ord://txid_vout format", () => {
      const result = parseImageURL(
        "ord://6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910_2",
      );
      expect(result.protocol).toBe(Protocol.Ordinals);
      expect(result.vout).toBe(2);
      expect(result.isValid).toBe(true);
    });

    test("parses ord://txid.vout format", () => {
      const result = parseImageURL(
        "ord://6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910.1",
      );
      expect(result.protocol).toBe(Protocol.Ordinals);
      expect(result.vout).toBe(1);
      expect(result.isValid).toBe(true);
    });
  });

  describe("BitFS Protocol (bitfs://)", () => {
    test("parses bitfs://txid format", () => {
      const result = parseImageURL(
        "bitfs://6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910",
      );
      expect(result.protocol).toBe(Protocol.BitFS);
      expect(result.txid).toBe("6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910");
      expect(result.isValid).toBe(true);
    });

    test("parses bitfs://txid.out.vout format", () => {
      const result = parseImageURL(
        "bitfs://6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910.out.3",
      );
      expect(result.protocol).toBe(Protocol.BitFS);
      expect(result.txid).toBe("6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910");
      expect(result.vout).toBe(3);
      expect(result.isValid).toBe(true);
    });
  });

  describe("IPFS Protocol", () => {
    test("parses ipfs:// with v0 CID", () => {
      const result = parseImageURL("ipfs://QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB");
      expect(result.protocol).toBe(Protocol.IPFS);
      expect(result.hash).toBe("QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB");
      expect(result.isValid).toBe(true);
    });

    test("handles invalid IPFS hash", () => {
      const result = parseImageURL("ipfs://invalid");
      expect(result.protocol).toBe(Protocol.IPFS);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Invalid IPFS hash");
    });
  });

  describe("Data URI", () => {
    test("parses base64 data URI", () => {
      const dataUri = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA";
      const result = parseImageURL(dataUri);
      expect(result.protocol).toBe(Protocol.DataURI);
      expect(result.mimeType).toBe("image/png");
      expect(result.data).toBe("iVBORw0KGgoAAAANSUhEUgAAAAUA");
      expect(result.isValid).toBe(true);
    });

    test("parses non-base64 data URI", () => {
      const dataUri = "data:text/plain,Hello%20World";
      const result = parseImageURL(dataUri);
      expect(result.protocol).toBe(Protocol.DataURI);
      expect(result.mimeType).toBe("text/plain");
      expect(result.data).toBe("Hello%20World");
      expect(result.isValid).toBe(true);
    });
  });

  describe("HTTP(S) URLs", () => {
    test("parses HTTP URL", () => {
      const result = parseImageURL("http://example.com/image.png");
      expect(result.protocol).toBe(Protocol.HTTP);
      expect(result.isValid).toBe(true);
    });

    test("parses HTTPS URL", () => {
      const result = parseImageURL("https://example.com/image.png");
      expect(result.protocol).toBe(Protocol.HTTP);
      expect(result.isValid).toBe(true);
    });
  });

  describe("Native format", () => {
    test("parses native txid", () => {
      const result = parseImageURL(
        "6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910",
      );
      expect(result.protocol).toBe(Protocol.Native);
      expect(result.txid).toBe("6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910");
      expect(result.isValid).toBe(true);
    });

    test("parses native txid_vout", () => {
      const result = parseImageURL(
        "6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910_2",
      );
      expect(result.protocol).toBe(Protocol.Native);
      expect(result.txid).toBe("6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910");
      expect(result.vout).toBe(2);
      expect(result.isValid).toBe(true);
    });

    test("parses /txid format", () => {
      const result = parseImageURL(
        "/6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910",
      );
      expect(result.protocol).toBe(Protocol.Native);
      expect(result.txid).toBe("6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910");
      expect(result.isValid).toBe(true);
    });

    test("parses dot notation txid.vout format", () => {
      const result = parseImageURL(
        "6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910.3",
      );
      expect(result.protocol).toBe(Protocol.Native);
      expect(result.txid).toBe("6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910");
      expect(result.vout).toBe(3);
      expect(result.isValid).toBe(true);
    });

    test("parses Bitcoin-style output notation txido0", () => {
      const result = parseImageURL(
        "6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910o1",
      );
      expect(result.protocol).toBe(Protocol.Native);
      expect(result.txid).toBe("6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910");
      expect(result.vout).toBe(1);
      expect(result.isValid).toBe(true);
    });

    test("parses Bitcoin-style input notation txidi0", () => {
      const result = parseImageURL(
        "6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910i2",
      );
      expect(result.protocol).toBe(Protocol.Native);
      expect(result.txid).toBe("6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910");
      expect(result.vout).toBe(2);
      expect(result.isValid).toBe(true);
    });

    test("parses /content/ prefix with various formats", () => {
      const testCases = [
        "/content/6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910",
        "/content/6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910_1",
        "/content/6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910.2",
      ];

      for (const url of testCases) {
        const result = parseImageURL(url);
        expect(result.protocol).toBe(Protocol.Native);
        expect(result.txid).toBe(
          "6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910",
        );
        expect(result.isValid).toBe(true);
      }
    });

    test("does not parse raw format when disabled", () => {
      const result = parseImageURL(
        "6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910",
        { allowNativeTxid: false },
      );
      expect(result.protocol).toBe(Protocol.Unknown);
      expect(result.isValid).toBe(false);
    });
  });

  describe("Edge cases", () => {
    test("handles empty string", () => {
      const result = parseImageURL("");
      expect(result.protocol).toBe(Protocol.Unknown);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Invalid input");
    });

    test("handles null/undefined", () => {
      const result = parseImageURL(null as any);
      expect(result.protocol).toBe(Protocol.Unknown);
      expect(result.isValid).toBe(false);
    });

    test("handles whitespace", () => {
      const result = parseImageURL(
        "  b://6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910  ",
      );
      expect(result.protocol).toBe(Protocol.Bitcoin);
      expect(result.isValid).toBe(true);
    });
  });
});
