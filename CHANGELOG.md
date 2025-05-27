# Changelog

## [0.0.2] - 2024-12-19

### Fixed
- Fixed React submodule exports not accessible in Next.js 15
- Converted bundled ESM files to use proper `export` statements instead of `module.exports`
- Added `.js` extensions to all internal imports for proper ESM compatibility
- Updated build process to generate TypeScript-compiled ESM files instead of bundled files

### Technical Details
- The issue was caused by Bun's bundler generating `module.exports` patterns even for ESM format
- Fixed by using TypeScript compiler for ESM generation and Bun bundler only for CommonJS
- All React hooks (`useBlockchainImage`, `useBlockchainImages`, `useLazyBlockchainImage`) and components (`BlockchainImage`) now properly export as ESM

## [0.0.1] - 2024-12-19

### Added
- Initial release of bitcoin-image library
- Support for multiple blockchain image protocols (b://, ord://, bitfs://, ipfs://)
- React hooks and components for blockchain image handling
- TypeScript support with full type definitions
- Caching and fallback mechanisms