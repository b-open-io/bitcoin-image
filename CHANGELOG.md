# Changelog

## [0.1.1] - 2024-12-19

### Changed
- Upgraded React peer dependency from `>=16.8.0` to `>=19.0.0`
- Updated `@types/react` from `^18.3.22` to `^19.1.5` (latest React 19 types)
- Updated repository URLs to `github.com/b-open-io/bitcoin-image`
- **Replaced tsup with Bun's built-in bundler** for faster builds and fewer dependencies
- **Added Biome for linting and formatting** with optimized configuration
- Improved TypeScript compatibility with React 19's new type system
- Enhanced `useRef` typing for better React 19 compatibility

### Technical Details
- All React hooks and components are now fully compatible with React 19
- No breaking changes to the public API
- All existing examples and tests continue to work without modification
- Build and linting pass successfully with React 19 types
- Removed tsup dependency, now using Bun's native bundler for ESM/CJS builds
- Added Biome for fast linting and formatting with sensible defaults
- Faster build times and smaller dependency footprint

## [0.1.0] - Initial Release

### Added
- Support for Bitcoin Files (b://), Ordinals (ord://), BitFS (bitfs://), IPFS, and data URIs
- Zero-dependency TypeScript library with full type safety
- React hooks and components for seamless integration
- Smart caching with configurable TTL
- Custom protocol handler support
- Comprehensive test suite with real-world examples
- Performance optimizations with sub-microsecond parsing 