#!/usr/bin/env node

import { ImageProtocols } from '../dist/index.js';
import { createReadStream, createWriteStream } from 'fs';
import { get } from 'https';
import { resolve } from 'path';

// Initialize the library
const imageProtocols = new ImageProtocols();

// Get command line arguments
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log(`
Image Protocols CLI - Convert blockchain image URLs to display URLs

Usage:
  node cli.js <url>                    Convert a single URL
  node cli.js --parse <url>            Parse URL and show details
  node cli.js --batch <url1> <url2>    Process multiple URLs
  node cli.js --download <url> <file>  Download image to file

Examples:
  node cli.js b://cbacb16c3a03729165542f20404827f1ee91bc1f9783089c41c59524ebf75a22
  node cli.js --parse ord://a54d3af24a03bcc28f6b3f2dd0ad249ee042b2f4b95810ae5184ab617a74b8b9_0
  node cli.js --batch "b://txid1" "ord://txid2" "bitfs://txid3.out.0.3"
  node cli.js --download b://txid output.jpg

Supported Protocols:
  b://       Bitcoin Files Protocol
  ord://     Ordinals Protocol
  bitfs://   BitFS Protocol
  ipfs://    IPFS Protocol
  data:      Data URIs
  http(s)://  Standard URLs
  txid_vout  Native format
`);
  process.exit(0);
}

async function convertUrl(url) {
  try {
    const displayUrl = await imageProtocols.getDisplayUrl(url);
    console.log(displayUrl);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

async function parseUrl(url) {
  try {
    const parsed = imageProtocols.parse(url);
    console.log('Parsed URL Details:');
    console.log(JSON.stringify(parsed, null, 2));
    
    if (parsed.isValid) {
      const displayUrl = await imageProtocols.getDisplayUrl(url);
      console.log('\nDisplay URL:', displayUrl);
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

async function batchProcess(urls) {
  try {
    console.log(`Processing ${urls.length} URLs...\n`);
    const results = await imageProtocols.getDisplayUrls(urls);
    
    results.forEach((displayUrl, originalUrl) => {
      console.log(`${originalUrl}\n  → ${displayUrl}\n`);
    });
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

async function downloadImage(url, outputFile) {
  try {
    const displayUrl = await imageProtocols.getDisplayUrl(url);
    console.log(`Downloading from: ${displayUrl}`);
    
    // Parse URL to determine if it's HTTPS
    const urlObj = new URL(displayUrl);
    if (urlObj.protocol !== 'https:') {
      console.error('Only HTTPS URLs are supported for download');
      process.exit(1);
    }
    
    // Download the file
    const file = createWriteStream(outputFile);
    
    get(displayUrl, (response) => {
      if (response.statusCode !== 200) {
        console.error(`Failed to download: HTTP ${response.statusCode}`);
        process.exit(1);
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded to: ${outputFile}`);
      });
    }).on('error', (err) => {
      console.error('Download error:', err.message);
      process.exit(1);
    });
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Process command line arguments
const command = args[0];

switch (command) {
  case '--parse':
    if (args.length < 2) {
      console.error('Please provide a URL to parse');
      process.exit(1);
    }
    parseUrl(args[1]);
    break;
    
  case '--batch':
    if (args.length < 2) {
      console.error('Please provide URLs to process');
      process.exit(1);
    }
    batchProcess(args.slice(1));
    break;
    
  case '--download':
    if (args.length < 3) {
      console.error('Please provide a URL and output filename');
      process.exit(1);
    }
    downloadImage(args[1], args[2]);
    break;
    
  default:
    // Single URL conversion
    convertUrl(args[0]);
}