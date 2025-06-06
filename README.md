# bitcoin-image

**Transform any blockchain image reference into a working URL** 🖼️

Ever tried to display an image stored on the Bitcoin blockchain? Whether it's an NFT, a meme, or any digital asset, blockchain images come in many different formats - and they're not directly displayable in browsers. This library solves that problem by converting any blockchain image reference into a working HTTP URL that you can use anywhere.

## What is this for?

Blockchain images are stored as transactions on networks like Bitcoin SV, but browsers can't display `b://txid` or `ord://txid_0` directly. You need a gateway service to serve the actual image data. This library:

- **Normalizes** different blockchain image formats into standard URLs
- **Works with any gateway** service like [OrdFS.network](https://ordfs.network), 1Sat Ordinals, or your own
- **Handles fallbacks** gracefully when images fail to load
- **Provides React hooks** for seamless frontend integration
- **Caches results** for better performance

## Visual Examples

Here are some real blockchain images served through OrdFS.network:

### 1SAT Ordinal Token
![1SAT Token](https://ordfs.network/a54d3af24a03bcc28f6b3f2dd0ad249ee042b2f4b95810ae5184ab617a74b8b9_0)

*Original reference: `ord://a54d3af24a03bcc28f6b3f2dd0ad249ee042b2f4b95810ae5184ab617a74b8b9_0`*

### GEMS Token  
![GEMS Token](https://ordfs.network/9418af73d138af02465b22dddd7913660dae9219cd260c4db83cda7c84713896_0)

*Original reference: `ord://9418af73d138af02465b22dddd7913660dae9219cd260c4db83cda7c84713896_0`*

### Bitcoin Files Image
![Bitcoin Files](https://ordfs.network/cbacb16c3a03729165542f20404827f1ee91bc1f9783089c41c59524ebf75a22)

*Original reference: `b://cbacb16c3a03729165542f20404827f1ee91bc1f9783089c41c59524ebf75a22`*

These images are stored permanently on the Bitcoin blockchain and served through gateway services that make them accessible to web browsers.

[![npm version](https://img.shields.io/npm/v/bitcoin-image.svg)](https://www.npmjs.com/package/bitcoin-image)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/bitcoin-image)](https://bundlephobia.com/package/bitcoin-image)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🚀 **Blazing Fast** - Sub-microsecond parsing and URL generation
- 📦 **Zero Dependencies** - No external runtime dependencies
- 🔧 **Fully Typed** - Complete TypeScript support with detailed types
- 🎯 **Framework Agnostic** - Works with any JavaScript framework
- ⚛️ **React Support** - Optional React hooks and components
- 💾 **Smart Caching** - Built-in performance optimization
- 🔌 **Extensible** - Custom protocol handlers support
- 🛡️ **Secure** - Input validation and XSS protection

## Installation

```bash
npm install bitcoin-image
# or
yarn add bitcoin-image
# or
bun add bitcoin-image
```

## Quick Start

```typescript
import { ImageProtocols } from 'bitcoin-image';

const imageProtocols = new ImageProtocols();

// Convert blockchain URL to display URL
const displayUrl = await imageProtocols.getDisplayUrl('b://txid_0');
// Returns: https://ordfs.network/txid_0

// Parse URL to get components
const parsed = imageProtocols.parse('ord://txid_2');
// Returns: { protocol: 'ord', txid: 'txid', vout: 2, isValid: true }

// Native format with leading slash
const parsed2 = imageProtocols.parse('/8a6c89c47fb4f06a...e78ed1f2_0');
// Returns: { protocol: 'native', txid: '8a6c89c4...', vout: 0, isValid: true }

// ORDFS content path format
const parsed3 = imageProtocols.parse('/content/8a6c89c47fb4f06a...e78ed1f2');
// Returns: { protocol: 'native', txid: '8a6c89c4...', isValid: true }

// Bitcoin-style outpoint notation
const parsed4 = imageProtocols.parse('8a6c89c47fb4f06a...e78ed1f2o0');
// Returns: { protocol: 'native', txid: '8a6c89c4...', vout: 0, isValid: true }
```

## Supported Protocols

| Protocol | Format | Example |
|----------|--------|---------|
| **Bitcoin Files** | `b://txid` or `b://txid_vout` | `b://8a6c...1f2_0` |
| **Ordinals** | `ord://txid` or `ord://txid_vout` | `ord://8a6c...1f2_0` |
| **BitFS** | `bitfs://txid.out.vout` | `bitfs://8a6c...1f2.out.0.3` |
| **IPFS** | `ipfs://hash` | `ipfs://QmX...` |
| **Data URI** | `data:mime;base64,...` | `data:image/png;base64,...` |
| **HTTP(S)** | `https://...` | `https://example.com/image.jpg` |
| **Native** | `txid`, `txid_vout`, `txid.vout`, `txido0`, `txidi0`, `/txid`, `/content/txid` | `8a6c...1f2_0` or `8a6c...1f2.0` or `8a6c...1f2o0` |

## API Reference

### Core Methods

#### `parse(url: string, options?: ParseOptions): ParsedImageURL`
Parse any supported URL format into its components.

```typescript
const parsed = imageProtocols.parse('b://txid_0');
// {
//   protocol: 'b',
//   txid: 'txid',
//   vout: 0,
//   isValid: true,
//   original: 'b://txid_0'
// }
```

#### `getDisplayUrl(url: string, options?: DisplayOptions): Promise<string>`
Convert any supported format to a display-ready URL.

```typescript
const displayUrl = await imageProtocols.getDisplayUrl('ord://txid', {
  fallback: '/default.png',
  timeout: 5000
});
```

#### `getDisplayUrls(urls: string[], options?: DisplayOptions): Promise<Map<string, string>>`
Batch convert multiple URLs efficiently.

```typescript
const urls = ['b://txid1', 'ord://txid2'];
const results = await imageProtocols.getDisplayUrls(urls);
// Map { 'b://txid1' => 'https://...', 'ord://txid2' => 'https://...' }
```

#### `validate(url: string): { isValid: boolean; error?: string }`
Validate a URL without converting it.

```typescript
const validation = imageProtocols.validate('b://invalid');
// { isValid: false, error: 'Invalid transaction ID' }
```

### Configuration

```typescript
const imageProtocols = new ImageProtocols({
  // Custom protocol handlers
  handlers: {
    b: (parsed) => `https://mygateway.com/${parsed.txid}_${parsed.vout || 0}`
  },
  
  // Default fallback image
  fallbackImage: '/placeholder.png',
  
  // Enable/disable caching
  cacheEnabled: true,
  cacheTTL: 3600, // seconds
  
  // Validate transaction IDs
  validateTxid: true
});
```

### Custom Handlers

Register custom handlers for any protocol:

```typescript
imageProtocols.registerHandler('custom', (parsed) => {
  return `https://custom-gateway.com/${parsed.txid}`;
});
```

## React Integration

Optional React hooks and components for seamless integration:

```tsx
import { useBlockchainImage, BlockchainImage } from 'bitcoin-image/react';

// Hook usage
function MyComponent({ imageUrl }) {
  const { displayUrl, loading, error } = useBlockchainImage(imageUrl);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <img src={displayUrl} alt="Blockchain image" />;
}

// Component usage
function Gallery({ images }) {
  return (
    <div>
      {images.map(url => (
        <BlockchainImage
          key={url}
          src={url}
          fallback="/placeholder.png"
          lazy
          className="gallery-image"
        />
      ))}
    </div>
  );
}
```

### React Hooks

- `useBlockchainImage(url, options)` - Load a single image
- `useBlockchainImages(urls, options)` - Load multiple images
- `useLazyBlockchainImage(url, options)` - Lazy load with IntersectionObserver

## Performance

Benchmarked on MacBook Pro M1:

- **Parsing**: ~0.2-0.5μs per URL
- **URL Generation**: ~0.1-0.3μs per URL (cached)
- **Cache Performance**: 15x speedup
- **Memory**: < 1KB per instance
- **Bundle Size**: ~10KB minified + gzipped

## Advanced Usage

### Batch Processing
```typescript
const urls = Array.from({ length: 1000 }, (_, i) => `b://txid${i}`);
const results = await imageProtocols.getDisplayUrls(urls);
// Processes efficiently with concurrency control
```

### Validation & Security
```typescript
import { validators, utils } from 'bitcoin-image';

// Validate transaction ID
const isValid = validators.isValidTxid('your-txid');

// Security check
const security = utils.validateImageSecurity(url);
if (!security.isValid) {
  console.error(security.reason);
}
```

### Utility Functions
```typescript
import { utils } from 'bitcoin-image';

// Extract metadata
const metadata = utils.extractMetadata('bitfs://txid.out.0.3');
// { protocol: 'bitfs', txid: 'txid', vout: 0, chunk: 3 }

// Check if URL is likely an image
const isImage = utils.isLikelyImage(url);

// Generate responsive srcset
const srcset = utils.generateSrcSet(displayUrl, [320, 640, 1280]);
```

## Examples

See the [examples](./examples) directory for:
- Command-line tool
- React application
- Next.js integration
- Browser demo
- Node.js scripts

## Browser Support

Works in all modern browsers and Node.js 14+. For older browsers, you may need to polyfill:
- `Promise`
- `Map`
- `URL`

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT © [Open Protocol Labs]

## Acknowledgments

Built for the BSV blockchain ecosystem. Special thanks to the 1Sat Ordinals community.