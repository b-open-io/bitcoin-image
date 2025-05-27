import { ImageProtocols, createImageProtocols, getDisplayUrl, parse } from "./dist/index.js";
// Test ESM imports
import {
  BlockchainImage,
  useBlockchainImage,
  useBlockchainImages,
  useLazyBlockchainImage,
} from "./dist/react.js";

console.log("✅ All imports successful!");
console.log("React exports:", {
  useBlockchainImage,
  useBlockchainImages,
  useLazyBlockchainImage,
  BlockchainImage,
});
console.log("Main exports:", { ImageProtocols, createImageProtocols, parse, getDisplayUrl });

// Test basic functionality
const protocols = new ImageProtocols();
const parsed = protocols.parse(
  "b://abc123def456789012345678901234567890123456789012345678901234567890_0",
);
console.log("Parse test:", parsed);
