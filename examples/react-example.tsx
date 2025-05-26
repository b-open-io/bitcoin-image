import React, { useState, useEffect } from 'react';
import { ImageProtocols, ParsedImageURL, Protocol } from 'bitcoin-image';

// Initialize the library
const imageProtocols = new ImageProtocols({
  cacheEnabled: true,
  fallbackImage: 'https://via.placeholder.com/300x300?text=Loading...'
});

// Custom hook for loading blockchain images
function useBlockchainImage(url: string | null | undefined) {
  const [displayUrl, setDisplayUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [parsed, setParsed] = useState<ParsedImageURL | null>(null);

  useEffect(() => {
    if (!url) {
      setDisplayUrl(imageProtocols.config.fallbackImage);
      setLoading(false);
      return;
    }

    const loadImage = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const parsedUrl = imageProtocols.parse(url);
        setParsed(parsedUrl);
        
        const display = await imageProtocols.getDisplayUrl(url);
        setDisplayUrl(display);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load image');
        setDisplayUrl(imageProtocols.config.fallbackImage);
      } finally {
        setLoading(false);
      }
    };

    loadImage();
  }, [url]);

  return { displayUrl, loading, error, parsed };
}

// Component for displaying a blockchain image
interface BlockchainImageProps {
  url: string;
  alt?: string;
  className?: string;
  showInfo?: boolean;
}

function BlockchainImage({ url, alt, className, showInfo = false }: BlockchainImageProps) {
  const { displayUrl, loading, error, parsed } = useBlockchainImage(url);

  return (
    <div className="blockchain-image-wrapper">
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          <img 
            src={displayUrl} 
            alt={alt || 'Blockchain image'} 
            className={className}
            onError={(e) => {
              e.currentTarget.src = imageProtocols.config.fallbackImage;
            }}
          />
          {showInfo && parsed && (
            <div className="image-info">
              <div>Protocol: {parsed.protocol}</div>
              {parsed.txid && <div>TxID: {parsed.txid.substring(0, 16)}...</div>}
              {parsed.vout !== undefined && <div>Vout: {parsed.vout}</div>}
              {error && <div className="error">Error: {error}</div>}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// BSocial Post Component
interface BSocialPost {
  id: string;
  author: string;
  content: string;
  image?: string;
  timestamp: Date;
}

function BSocialPostComponent({ post }: { post: BSocialPost }) {
  const { displayUrl, loading } = useBlockchainImage(post.image);

  return (
    <div className="bsocial-post">
      <div className="post-header">
        <strong>{post.author}</strong>
        <span className="timestamp">{post.timestamp.toLocaleString()}</span>
      </div>
      <div className="post-content">{post.content}</div>
      {post.image && (
        <div className="post-image">
          {loading ? (
            <div className="loading">Loading image...</div>
          ) : (
            <img src={displayUrl} alt="Post image" />
          )}
        </div>
      )}
    </div>
  );
}

// NFT Gallery Component
interface NFTItem {
  id: string;
  name: string;
  image: string;
  collection?: string;
}

function NFTGallery({ items }: { items: NFTItem[] }) {
  return (
    <div className="nft-gallery">
      {items.map((item) => (
        <div key={item.id} className="nft-item">
          <BlockchainImage url={item.image} alt={item.name} />
          <div className="nft-info">
            <h3>{item.name}</h3>
            {item.collection && <p>{item.collection}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

// Main App Component
export default function App() {
  const [testUrl, setTestUrl] = useState('');
  const [testResult, setTestResult] = useState<any>(null);

  // Example data
  const exampleNFTs: NFTItem[] = [
    {
      id: '1',
      name: '1SAT Token',
      image: 'ord://a54d3af24a03bcc28f6b3f2dd0ad249ee042b2f4b95810ae5184ab617a74b8b9_0',
      collection: 'Tokens'
    },
    {
      id: '2',
      name: 'GEMS Token',
      image: 'ord://9418af73d138af02465b22dddd7913660dae9219cd260c4db83cda7c84713896_0',
      collection: 'Tokens'
    },
    {
      id: '3',
      name: 'GM Token',
      image: 'ord://350ddacd88b98c0ac4590fbc88f1f92ac164cb91187759afcd73f889eea8bef7_0',
      collection: 'POW-20'
    },
    {
      id: '4',
      name: 'Rare Sirloins #2149',
      image: 'b://cbacb16c3a03729165542f20404827f1ee91bc1f9783089c41c59524ebf75a22',
      collection: 'Rare Sirloins'
    }
  ];

  const examplePosts: BSocialPost[] = [
    {
      id: '1',
      author: 'Alice',
      content: 'Just minted my first ordinal! 🎉',
      image: 'bitfs://868e663652556fa133878539b6c65093e36bef1a6497e511bdf0655b2ce1c935.out.0.3',
      timestamp: new Date()
    },
    {
      id: '2',
      author: 'Bob',
      content: 'Check out the Pixel Fox collection!',
      image: '1611d956f397caa80b56bc148b4bce87b54f39b234aeca4668b4d5a7785eb9fa_0',
      timestamp: new Date(Date.now() - 3600000)
    }
  ];

  const handleTestUrl = async () => {
    if (!testUrl) return;

    try {
      const parsed = imageProtocols.parse(testUrl);
      const displayUrl = await imageProtocols.getDisplayUrl(testUrl);
      
      setTestResult({
        parsed,
        displayUrl,
        error: null
      });
    } catch (error) {
      setTestResult({
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  return (
    <div className="app">
      <h1>Image Protocols React Example</h1>

      {/* URL Tester */}
      <section className="url-tester">
        <h2>Test Any URL</h2>
        <div className="input-group">
          <input
            type="text"
            value={testUrl}
            onChange={(e) => setTestUrl(e.target.value)}
            placeholder="Enter b://, ord://, bitfs://, or other URL"
          />
          <button onClick={handleTestUrl}>Test</button>
        </div>
        
        {testResult && (
          <div className="test-result">
            {testResult.error ? (
              <div className="error">Error: {testResult.error}</div>
            ) : (
              <>
                <h3>Parse Result:</h3>
                <pre>{JSON.stringify(testResult.parsed, null, 2)}</pre>
                <h3>Display URL:</h3>
                <p>{testResult.displayUrl}</p>
                <h3>Preview:</h3>
                <BlockchainImage url={testUrl} showInfo />
              </>
            )}
          </div>
        )}
      </section>

      {/* NFT Gallery */}
      <section>
        <h2>NFT Gallery Example</h2>
        <NFTGallery items={exampleNFTs} />
      </section>

      {/* BSocial Feed */}
      <section>
        <h2>BSocial Feed Example</h2>
        <div className="social-feed">
          {examplePosts.map(post => (
            <BSocialPostComponent key={post.id} post={post} />
          ))}
        </div>
      </section>

      {/* Protocol Examples */}
      <section>
        <h2>Supported Protocols</h2>
        <div className="protocol-examples">
          <div className="example">
            <h3>Bitcoin Files (b://)</h3>
            <BlockchainImage 
              url="b://6ce94f75b88a6c24815d480437f4f06ae895afdab8039ddec10748660c29f910" 
              showInfo 
            />
          </div>
          
          <div className="example">
            <h3>Ordinals (ord://)</h3>
            <BlockchainImage 
              url="ord://b974de563db7ca7a42f421bb8a55c61680417404c661deb7a052773eb24344e3_0" 
              showInfo 
            />
          </div>
          
          <div className="example">
            <h3>Data URI</h3>
            <BlockchainImage 
              url="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgZmlsbD0iIzAwN2JmZiIvPjwvc3ZnPg==" 
              showInfo 
            />
          </div>
        </div>
      </section>
    </div>
  );
}

// CSS (in a separate file or styled-components)
const styles = `
.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

.url-tester {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.input-group {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.input-group input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.input-group button {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.nft-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.nft-item {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.nft-item img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.nft-info {
  padding: 15px;
}

.bsocial-post {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
}

.post-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.post-image {
  margin-top: 10px;
  max-width: 500px;
}

.post-image img {
  width: 100%;
  border-radius: 8px;
}

.blockchain-image-wrapper {
  position: relative;
}

.image-info {
  margin-top: 10px;
  padding: 10px;
  background: #f0f0f0;
  border-radius: 4px;
  font-size: 12px;
}

.loading {
  padding: 20px;
  text-align: center;
  color: #666;
}

.error {
  color: #dc3545;
  padding: 10px;
  background: #f8d7da;
  border-radius: 4px;
}

.protocol-examples {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.example {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
}

pre {
  background: #f4f4f4;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
}
`;