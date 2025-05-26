#!/usr/bin/env node

import { ImageProtocols, Protocol } from "../dist/index.js";

async function main() {
  console.log("Image Protocols Library - Node.js Example\n");

  // Initialize the library
  const imageProtocols = new ImageProtocols({
    cacheEnabled: true,
    cacheTTL: 300, // 5 minutes
  });

  // Example 1: Parse and display various URL formats
  console.log("=== Example 1: Parsing Different URL Formats ===\n");

  const urls = [
    "b://cbacb16c3a03729165542f20404827f1ee91bc1f9783089c41c59524ebf75a22",
    "ord://a54d3af24a03bcc28f6b3f2dd0ad249ee042b2f4b95810ae5184ab617a74b8b9_0",
    "bitfs://868e663652556fa133878539b6c65093e36bef1a6497e511bdf0655b2ce1c935.out.0.3",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
    "1611d956f397caa80b56bc148b4bce87b54f39b234aeca4668b4d5a7785eb9fa_0",
  ];

  for (const url of urls) {
    const parsed = imageProtocols.parse(url);
    console.log(`URL: ${url}`);
    console.log(`Protocol: ${parsed.protocol}`);
    console.log(`Valid: ${parsed.isValid}`);
    if (parsed.txid) console.log(`TxID: ${parsed.txid}`);
    if (parsed.vout !== undefined) console.log(`Vout: ${parsed.vout}`);
    console.log("---");
  }

  // Example 2: Convert URLs to display URLs
  console.log("\n=== Example 2: Converting to Display URLs ===\n");

  for (const url of urls.slice(0, 3)) {
    const displayUrl = await imageProtocols.getDisplayUrl(url);
    console.log(`Original: ${url}`);
    console.log(`Display:  ${displayUrl}`);
    console.log("---");
  }

  // Example 3: Batch processing
  console.log("\n=== Example 3: Batch Processing ===\n");

  const batchUrls = [
    "b://6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910",
    "ord://b974de563db7ca7a42f421bb8a55c61680417404c661deb7a052773eb24344e3_0",
    "https://1satordinals.com/logo.png",
  ];

  const results = await imageProtocols.getDisplayUrls(batchUrls);
  results.forEach((displayUrl, originalUrl) => {
    console.log(`${originalUrl} → ${displayUrl}`);
  });

  // Example 4: Custom handler
  console.log("\n=== Example 4: Custom Protocol Handler ===\n");

  // Create instance with custom Bitcoin handler
  const customProtocols = new ImageProtocols({
    handlers: {
      [Protocol.Bitcoin]: (parsed) => {
        // Use a different gateway
        return `https://api.whatsonchain.com/v1/bsv/main/tx/${parsed.txid}/out/${parsed.vout || 0}/data`;
      },
    },
  });

  const btcUrl = "b://6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910_2";
  const standardResult = await imageProtocols.getDisplayUrl(btcUrl);
  const customResult = await customProtocols.getDisplayUrl(btcUrl);

  console.log(`Bitcoin URL: ${btcUrl}`);
  console.log(`Standard handler: ${standardResult}`);
  console.log(`Custom handler:   ${customResult}`);

  // Example 5: Validation
  console.log("\n=== Example 5: URL Validation ===\n");

  const testUrls = [
    "b://6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910",
    "b://invalid-txid",
    "ord://abc123_0",
    "bitfs://868e663652556fa133878539b6c65093e36bef1a6497e511bdf0655b2ce1c935.out.0.3",
  ];

  for (const url of testUrls) {
    const validation = imageProtocols.validate(url);
    console.log(`URL: ${url}`);
    console.log(`Valid: ${validation.isValid}`);
    if (validation.error) console.log(`Error: ${validation.error}`);
    console.log("---");
  }

  // Example 6: Cache demonstration
  console.log("\n=== Example 6: Cache Performance ===\n");

  const cacheTestUrl = "b://cbacb16c3a03729165542f20404827f1ee91bc1f9783089c41c59524ebf75a22";

  // First call (cache miss)
  const start1 = Date.now();
  await imageProtocols.getDisplayUrl(cacheTestUrl);
  const time1 = Date.now() - start1;

  // Second call (cache hit)
  const start2 = Date.now();
  await imageProtocols.getDisplayUrl(cacheTestUrl);
  const time2 = Date.now() - start2;

  console.log(`First call (uncached): ${time1}ms`);
  console.log(`Second call (cached): ${time2}ms`);
  console.log(`Cache stats:`, imageProtocols.getCacheStats());

  // Example 7: BSocial post processing
  console.log("\n=== Example 7: Processing BSocial Posts ===\n");

  // Simulate BSocial posts with embedded images
  const bsocialPosts = [
    {
      id: 1,
      author: "Alice",
      content: "Check out my new NFT!",
      image: "ord://a54d3af24a03bcc28f6b3f2dd0ad249ee042b2f4b95810ae5184ab617a74b8b9_0",
    },
    {
      id: 2,
      author: "Bob",
      content: "Just uploaded this to BitFS",
      image: "bitfs://868e663652556fa133878539b6c65093e36bef1a6497e511bdf0655b2ce1c935.out.0.3",
    },
    {
      id: 3,
      author: "Charlie",
      content: "Rare Sirloins collection",
      image: "b://cbacb16c3a03729165542f20404827f1ee91bc1f9783089c41c59524ebf75a22",
    },
  ];

  for (const post of bsocialPosts) {
    const imageUrl = await imageProtocols.getDisplayUrl(post.image);
    console.log(`Post #${post.id} by ${post.author}: "${post.content}"`);
    console.log(`Image: ${imageUrl}`);
    console.log("---");
  }

  // Example 8: Error handling
  console.log("\n=== Example 8: Error Handling ===\n");

  const invalidUrls = ["invalid://protocol", "b://short", null, undefined, ""];

  for (const url of invalidUrls) {
    const result = await imageProtocols.getDisplayUrl(url, {
      fallback: "https://via.placeholder.com/200x200?text=Error",
    });
    console.log(`Input: ${url}`);
    console.log(`Result: ${result}`);
    console.log("---");
  }

  console.log("\nExample completed!");
}

// Run the example
main().catch(console.error);
