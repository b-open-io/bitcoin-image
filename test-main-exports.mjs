// Test main ESM imports
import { ImageProtocols, createImageProtocols, getDisplayUrl, parse } from "./dist/index.js";

console.log("✅ Main imports successful!");
console.log("Main exports:", { ImageProtocols, createImageProtocols, parse, getDisplayUrl });

// Test basic functionality
const protocols = new ImageProtocols();
const parsed = protocols.parse(
  "b://abc123def456789012345678901234567890123456789012345678901234567890_0",
);
console.log("Parse test:", parsed);

// Test convenience function
const parsed2 = parse("ord://def456789012345678901234567890123456789012345678901234567890123456_1");
console.log("Convenience parse test:", parsed2);

console.log("✅ All tests passed!");
