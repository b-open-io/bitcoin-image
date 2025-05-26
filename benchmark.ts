import { ImageProtocols } from "./src/index";

console.log("Image Protocols Library Benchmark\n");

const imageProtocols = new ImageProtocols();
const iterations = 10000;

// Test URLs from real usage
const testUrls = [
  "b://cbacb16c3a03729165542f20404827f1ee91bc1f9783089c41c59524ebf75a22",
  "ord://a54d3af24a03bcc28f6b3f2dd0ad249ee042b2f4b95810ae5184ab617a74b8b9_0",
  "bitfs://868e663652556fa133878539b6c65093e36bef1a6497e511bdf0655b2ce1c935.out.0.3",
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
  "1611d956f397caa80b56bc148b4bce87b54f39b234aeca4668b4d5a7785eb9fa_0",
  "/e6d40ba206340aa94ed40fe1a8adcd722c08c9438b2c1dd16b4527d561e848a2_0",
  "https://1satordinals.com/logo.png",
  "6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910",
];

// Benchmark parsing
console.log("=== Parsing Performance ===");
for (const url of testUrls) {
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    imageProtocols.parse(url);
  }
  const end = performance.now();
  const avgTime = (((end - start) / iterations) * 1000).toFixed(2);
  console.log(`${url.substring(0, 50)}... - ${avgTime}µs/parse`);
}

// Benchmark getDisplayUrl (without network calls)
console.log("\n=== Display URL Generation (cached) ===");
// Pre-warm cache
for (const url of testUrls) {
  await imageProtocols.getDisplayUrl(url);
}

for (const url of testUrls) {
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    await imageProtocols.getDisplayUrl(url);
  }
  const end = performance.now();
  const avgTime = (((end - start) / iterations) * 1000).toFixed(2);
  console.log(`${url.substring(0, 50)}... - ${avgTime}µs/call`);
}

// Benchmark cache performance
console.log("\n=== Cache Performance ===");
const cacheTestUrl = "b://6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910";

// Cold cache
imageProtocols.clearCache();
const coldStart = performance.now();
await imageProtocols.getDisplayUrl(cacheTestUrl);
const coldTime = performance.now() - coldStart;

// Warm cache
const warmStart = performance.now();
await imageProtocols.getDisplayUrl(cacheTestUrl);
const warmTime = performance.now() - warmStart;

console.log(`Cold cache: ${coldTime.toFixed(2)}ms`);
console.log(`Warm cache: ${warmTime.toFixed(2)}ms`);
console.log(`Cache speedup: ${(coldTime / warmTime).toFixed(1)}x`);

// Memory usage
console.log("\n=== Memory Usage ===");
const initialMemory = process.memoryUsage();

// Create many instances
const instances = [];
for (let i = 0; i < 1000; i++) {
  instances.push(new ImageProtocols());
}

const afterMemory = process.memoryUsage();
const memoryIncrease = (afterMemory.heapUsed - initialMemory.heapUsed) / 1024 / 1024;
console.log(`Memory per 1000 instances: ${memoryIncrease.toFixed(2)}MB`);

// Batch processing performance
console.log("\n=== Batch Processing ===");
const batchSizes = [10, 100, 1000];
for (const size of batchSizes) {
  const urls = Array(size).fill(testUrls).flat().slice(0, size);

  const start = performance.now();
  await imageProtocols.getDisplayUrls(urls);
  const end = performance.now();

  console.log(
    `Batch size ${size}: ${(end - start).toFixed(2)}ms (${((end - start) / size).toFixed(2)}ms/url)`,
  );
}
