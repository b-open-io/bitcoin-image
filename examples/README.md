# Image Protocols Examples

This directory contains various examples demonstrating how to use the bitcoin-image library.

## Examples Overview

### 1. **index.html** - Kitchen Sink Demo
A comprehensive browser-based demo showing all features:
- Test any URL interactively
- Predefined examples with real transaction IDs
- BSocial post simulation
- Custom handler demonstration
- Visual preview of images

**Run it:**
```bash
npm run example:html
# Then open http://localhost:8080/index.html
```

### 2. **node-example.js** - Node.js Examples
Comprehensive Node.js examples covering:
- Parsing different URL formats
- Converting to display URLs
- Batch processing
- Custom handlers
- Validation
- Cache performance
- BSocial post processing
- Error handling

**Run it:**
```bash
npm run example:node
```

### 3. **cli.js** - Command Line Tool
A practical CLI tool for working with blockchain image URLs:

```bash
# Convert a single URL
node examples/cli.js b://cbacb16c3a03729165542f20404827f1ee91bc1f9783089c41c59524ebf75a22

# Parse and show details
node examples/cli.js --parse ord://a54d3af24a03bcc28f6b3f2dd0ad249ee042b2f4b95810ae5184ab617a74b8b9_0

# Batch process multiple URLs
node examples/cli.js --batch "b://txid1" "ord://txid2_0" "bitfs://txid3.out.0.3"

# Download an image
node examples/cli.js --download b://txid output.jpg
```

### 4. **react-example.tsx** - React Component Examples
React components and hooks for blockchain images:
- `useBlockchainImage` custom hook
- `BlockchainImage` component
- `BSocialPost` component
- `NFTGallery` component
- Complete app example

### 5. **nextjs-example.tsx** - Next.js Integration
Next.js specific implementation with:
- Custom image loader
- Server-side URL resolution
- Image optimization
- TypeScript support
- API route example

## Real Transaction Examples

The examples use real transaction IDs from the BSV blockchain:

### Token Icons
- **1SAT Token**: `ord://b974de563db7ca7a42f421bb8a55c61680417404c661deb7a052773eb24344e3_0`
- **GEMS Token**: `ord://9418af73d138af02465b22dddd7913660dae9219cd260c4db83cda7c84713896_0`
- **GM Token**: `ord://350ddacd88b98c0ac4590fbc88f1f92ac164cb91187759afcd73f889eea8bef7_0`

### NFT Examples
- **Rare Sirloins #2149**: `b://cbacb16c3a03729165542f20404827f1ee91bc1f9783089c41c59524ebf75a22`
- **Pixel Fox Collection**: `1611d956f397caa80b56bc148b4bce87b54f39b234aeca4668b4d5a7785eb9fa_0`

### BSocial Image
- **JPEG from BSocial post**: `bitfs://868e663652556fa133878539b6c65093e36bef1a6497e511bdf0655b2ce1c935.out.0.3`

## Common Patterns

### 1. Basic Usage
```javascript
import { ImageProtocols } from 'bitcoin-image';

const imageProtocols = new ImageProtocols();
const displayUrl = await imageProtocols.getDisplayUrl('b://txid');
```

### 2. With Custom Gateway
```javascript
const imageProtocols = new ImageProtocols({
  handlers: {
    b: (parsed) => `https://mygateway.com/${parsed.txid}_${parsed.vout || 0}`
  }
});
```

### 3. React Integration
```jsx
function NFTImage({ url }) {
  const { displayUrl, loading, error } = useBlockchainImage(url);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <img src={displayUrl} alt="NFT" />;
}
```

### 4. Validation
```javascript
const validation = imageProtocols.validate('b://invalid-txid');
if (!validation.isValid) {
  console.error(validation.error);
}
```

## Testing URLs

You can test the library with these working URLs:

```javascript
const testUrls = [
  // Bitcoin Files
  'b://cbacb16c3a03729165542f20404827f1ee91bc1f9783089c41c59524ebf75a22',
  'b://6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910_0',
  
  // Ordinals
  'ord://a54d3af24a03bcc28f6b3f2dd0ad249ee042b2f4b95810ae5184ab617a74b8b9_0',
  'ord://9418af73d138af02465b22dddd7913660dae9219cd260c4db83cda7c84713896_0',
  
  // BitFS
  'bitfs://868e663652556fa133878539b6c65093e36bef1a6497e511bdf0655b2ce1c935.out.0.3',
  
  // Native formats
  '1611d956f397caa80b56bc148b4bce87b54f39b234aeca4668b4d5a7785eb9fa_0',
  '/e6d40ba206340aa94ed40fe1a8adcd722c08c9438b2c1dd16b4527d561e848a2_0',
  
  // Data URI
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgZmlsbD0iIzAwN2JmZiIvPjwvc3ZnPg==',
];
```