import { beforeEach, describe, expect, test } from "bun:test";
import { ImageProtocols, createImageProtocols, getDisplayUrl, parse } from "../src/index";
import { Protocol } from "../src/types";

describe("ImageProtocols", () => {
  let imageProtocols: ImageProtocols;

  beforeEach(() => {
    imageProtocols = new ImageProtocols();
  });

  describe("parse", () => {
    test("parses various URL formats", () => {
      const testCases = [
        { input: "b://abc123", expectedProtocol: Protocol.Bitcoin },
        { input: "ord://def456", expectedProtocol: Protocol.Ordinals },
        { input: "bitfs://ghi789", expectedProtocol: Protocol.BitFS },
        { input: "data:image/png;base64,abc", expectedProtocol: Protocol.DataURI },
        { input: "https://example.com/image.png", expectedProtocol: Protocol.HTTP },
      ];

      for (const { input, expectedProtocol } of testCases) {
        const result = imageProtocols.parse(input);
        expect(result.protocol).toBe(expectedProtocol);
      }
    });
  });

  describe("getDisplayUrl", () => {
    test("converts b:// URL to display URL", async () => {
      const url = "b://6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910";
      const displayUrl = await imageProtocols.getDisplayUrl(url);
      expect(displayUrl).toBe(
        "https://ordfs.network/6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910_0",
      );
    });

    test("converts ord:// URL to display URL", async () => {
      const url = "ord://6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910_2";
      const displayUrl = await imageProtocols.getDisplayUrl(url);
      expect(displayUrl).toBe(
        "https://ordfs.network/6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910_2",
      );
    });

    test("returns fallback for invalid URL", async () => {
      const fallback = "https://example.com/fallback.png";
      const displayUrl = await imageProtocols.getDisplayUrl("invalid://url", { fallback });
      expect(displayUrl).toBe(fallback);
    });

    test("preserves data URIs", async () => {
      const dataUri = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA";
      const displayUrl = await imageProtocols.getDisplayUrl(dataUri);
      expect(displayUrl).toBe(dataUri);
    });

    test("preserves HTTP URLs", async () => {
      const httpUrl = "https://example.com/image.png";
      const displayUrl = await imageProtocols.getDisplayUrl(httpUrl);
      expect(displayUrl).toBe(httpUrl);
    });
  });

  describe("batch processing", () => {
    test("processes multiple URLs", async () => {
      const urls = [
        "b://6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910",
        "ord://7de94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f911",
        "https://example.com/image.png",
      ];

      const results = await imageProtocols.getDisplayUrls(urls);

      expect(results.size).toBe(3);
      expect(
        results.get("b://6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910"),
      ).toBe(
        "https://ordfs.network/6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910_0",
      );
      expect(
        results.get("ord://7de94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f911"),
      ).toBe(
        "https://ordfs.network/7de94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f911",
      );
      expect(results.get("https://example.com/image.png")).toBe("https://example.com/image.png");
    });
  });

  describe("custom handlers", () => {
    test("uses custom handler", async () => {
      const customHandler = (parsed: any) => `custom://${parsed.txid}`;

      const protocols = new ImageProtocols({
        handlers: {
          [Protocol.Bitcoin]: customHandler,
        },
      });

      const url = "b://6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910";
      const displayUrl = await protocols.getDisplayUrl(url);
      expect(displayUrl).toBe(
        "custom://6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910",
      );
    });

    test("registers handler dynamically", async () => {
      imageProtocols.registerHandler(Protocol.Bitcoin, (parsed) => `dynamic://${parsed.txid}`);

      const url = "b://6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910";
      const displayUrl = await imageProtocols.getDisplayUrl(url);
      expect(displayUrl).toBe(
        "dynamic://6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910",
      );
    });
  });

  describe("caching", () => {
    test("caches results", async () => {
      const url = "b://6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910";

      // First call
      const result1 = await imageProtocols.getDisplayUrl(url);

      // Second call should use cache
      const result2 = await imageProtocols.getDisplayUrl(url);

      expect(result1).toBe(result2);
    });

    test("clears cache", async () => {
      const url = "b://6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910";

      await imageProtocols.getDisplayUrl(url);
      const stats1 = imageProtocols.getCacheStats();
      expect(stats1.size).toBeGreaterThan(0);

      imageProtocols.clearCache();
      const stats2 = imageProtocols.getCacheStats();
      expect(stats2.size).toBe(0);
    });
  });

  describe("validation", () => {
    test("validates URLs", () => {
      const validUrl = "b://6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910";
      const invalidUrl = "b://invalid";

      expect(imageProtocols.validate(validUrl).isValid).toBe(true);
      expect(imageProtocols.validate(invalidUrl).isValid).toBe(false);
      expect(imageProtocols.validate(invalidUrl).error).toBe("Invalid transaction ID");
    });
  });
});

describe("convenience functions", () => {
  test("createImageProtocols creates instance", () => {
    const instance = createImageProtocols();
    expect(instance).toBeInstanceOf(ImageProtocols);
  });

  test("parse function works standalone", () => {
    const result = parse("b://6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910");
    expect(result.protocol).toBe(Protocol.Bitcoin);
    expect(result.txid).toBe("6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910");
  });

  test("getDisplayUrl function works standalone", async () => {
    const url = "b://6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910";
    const displayUrl = await getDisplayUrl(url);
    expect(displayUrl).toBe(
      "https://ordfs.network/6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910_0",
    );
  });
});
