import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ImageProtocols, ParsedImageURL } from 'bitcoin-image';

// Create a singleton instance
const imageProtocols = new ImageProtocols({
  cacheEnabled: true,
  defaultGateway: 'https://ordfs.network',
});

// Custom Next.js loader for blockchain images
const blockchainImageLoader = ({ src, width, quality }: any) => {
  // If it's already a full URL, return as is
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }
  
  // Parse and convert blockchain URLs synchronously
  // Note: In production, you might want to handle this differently
  const parsed = imageProtocols.parse(src);
  if (!parsed.isValid) {
    return imageProtocols.config.fallbackImage;
  }
  
  // Convert to display URL based on protocol
  switch (parsed.protocol) {
    case 'b':
    case 'ord':
    case 'native':
      return `https://ordfs.network/${parsed.txid}_${parsed.vout || 0}`;
    case 'bitfs':
      return `https://ordfs.network/${parsed.txid}_${parsed.vout || 0}`;
    case 'data':
    case 'http':
      return src;
    default:
      return imageProtocols.config.fallbackImage;
  }
};

// Blockchain Image component using Next.js Image
interface BlockchainImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
}

export function BlockchainImage({ 
  src, 
  alt, 
  width = 300, 
  height = 300,
  className,
  priority = false,
  fill = false
}: BlockchainImageProps) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadImage() {
      try {
        const url = await imageProtocols.getDisplayUrl(src);
        setImageUrl(url);
      } catch (error) {
        console.error('Failed to load image:', error);
        setImageUrl(imageProtocols.config.fallbackImage);
      } finally {
        setLoading(false);
      }
    }
    loadImage();
  }, [src]);

  if (loading) {
    return (
      <div className={`${className} animate-pulse bg-gray-200`} 
           style={{ width: fill ? '100%' : width, height: fill ? '100%' : height }}>
        <div className="flex items-center justify-center h-full">
          <span className="text-gray-400">Loading...</span>
        </div>
      </div>
    );
  }

  if (fill) {
    return (
      <Image
        loader={blockchainImageLoader}
        src={imageUrl}
        alt={alt}
        fill
        className={className}
        priority={priority}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    );
  }

  return (
    <Image
      loader={blockchainImageLoader}
      src={imageUrl}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
    />
  );
}

// Example Next.js page component
export default function BlockchainGalleryPage() {
  const [urls, setUrls] = useState<string[]>([]);
  const [inputUrl, setInputUrl] = useState('');

  // Example NFT collection
  const nftCollection = [
    {
      id: 1,
      name: '1SAT Token Icon',
      url: 'ord://b974de563db7ca7a42f421bb8a55c61680417404c661deb7a052773eb24344e3_0',
      description: 'Official 1SAT token icon'
    },
    {
      id: 2,
      name: 'GEMS Token',
      url: 'ord://9418af73d138af02465b22dddd7913660dae9219cd260c4db83cda7c84713896_0',
      description: 'GEMS token icon - 144M max supply'
    },
    {
      id: 3,
      name: 'GM POW-20',
      url: 'ord://350ddacd88b98c0ac4590fbc88f1f92ac164cb91187759afcd73f889eea8bef7_0',
      description: 'GM token from POW-20 protocol'
    },
    {
      id: 4,
      name: 'Rare Sirloins #2149',
      url: 'b://cbacb16c3a03729165542f20404827f1ee91bc1f9783089c41c59524ebf75a22',
      description: 'Part of the Rare Sirloins collection'
    },
    {
      id: 5,
      name: 'Pixel Fox Collection',
      url: '1611d956f397caa80b56bc148b4bce87b54f39b234aeca4668b4d5a7785eb9fa_0',
      description: 'Pixel Fox NFT collection'
    },
    {
      id: 6,
      name: 'BSocial Image',
      url: 'bitfs://868e663652556fa133878539b6c65093e36bef1a6497e511bdf0655b2ce1c935.out.0.3',
      description: 'Image from a BSocial post'
    }
  ];

  const handleAddUrl = () => {
    if (inputUrl && !urls.includes(inputUrl)) {
      setUrls([...urls, inputUrl]);
      setInputUrl('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Blockchain Image Gallery - Next.js Example
        </h1>

        {/* URL Input Section */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Add Custom Image</h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Enter b://, ord://, bitfs://, or other blockchain image URL"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={handleAddUrl}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Image
            </button>
          </div>
        </div>

        {/* Custom URLs Gallery */}
        {urls.length > 0 && (
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Your Images</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {urls.map((url, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <BlockchainImage
                    src={url}
                    alt={`Custom image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() => setUrls(urls.filter((_, i) => i !== index))}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NFT Collection */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Example NFT Collection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nftCollection.map((nft) => (
              <div key={nft.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="relative aspect-square bg-gray-100">
                  <BlockchainImage
                    src={nft.url}
                    alt={nft.name}
                    fill
                    className="object-contain"
                    priority={nft.id <= 3} // Priority for first 3 images
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{nft.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{nft.description}</p>
                  <div className="mt-2 text-xs text-gray-500 break-all">
                    {nft.url}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Protocol Examples */}
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Supported Protocols</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-semibold text-lg mb-2">Input Formats</h3>
              <ul className="space-y-1 text-gray-600">
                <li><code className="bg-gray-100 px-1">b://txid</code> - Bitcoin Files Protocol</li>
                <li><code className="bg-gray-100 px-1">b://txid_vout</code> - With specific output</li>
                <li><code className="bg-gray-100 px-1">ord://txid</code> - Ordinals Protocol</li>
                <li><code className="bg-gray-100 px-1">ord://txid_vout</code> - Ordinals with output</li>
                <li><code className="bg-gray-100 px-1">bitfs://txid.out.vout</code> - BitFS Protocol</li>
                <li><code className="bg-gray-100 px-1">ipfs://hash</code> - IPFS Protocol</li>
                <li><code className="bg-gray-100 px-1">data:image/...</code> - Data URIs</li>
                <li><code className="bg-gray-100 px-1">txid_vout</code> - Native format</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Features</h3>
              <ul className="space-y-1 text-gray-600">
                <li>✓ Automatic protocol detection</li>
                <li>✓ Transaction ID validation</li>
                <li>✓ Built-in caching</li>
                <li>✓ Fallback image support</li>
                <li>✓ Custom protocol handlers</li>
                <li>✓ TypeScript support</li>
                <li>✓ Next.js Image optimization</li>
                <li>✓ Lazy loading support</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Example API route for server-side URL resolution
// pages/api/resolve-image.ts or app/api/resolve-image/route.ts
export async function resolveImageUrl(url: string) {
  try {
    const displayUrl = await imageProtocols.getDisplayUrl(url);
    return { success: true, url: displayUrl };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      url: imageProtocols.config.fallbackImage 
    };
  }
}