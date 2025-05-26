import { describe, test, expect } from 'bun:test';
import { ImageProtocols } from '../src/index';

describe('Real World Examples', () => {
  const imageProtocols = new ImageProtocols();

  describe('1SAT Ordinals Examples', () => {
    test('1SAT token icon', async () => {
      const url = 'ord://b974de563db7ca7a42f421bb8a55c61680417404c661deb7a052773eb24344e3_0';
      const parsed = imageProtocols.parse(url);
      
      expect(parsed.isValid).toBe(true);
      expect(parsed.protocol).toBe('ord');
      expect(parsed.txid).toBe('b974de563db7ca7a42f421bb8a55c61680417404c661deb7a052773eb24344e3');
      expect(parsed.vout).toBe(0);
      
      const displayUrl = await imageProtocols.getDisplayUrl(url);
      expect(displayUrl).toBe('https://ordfs.network/b974de563db7ca7a42f421bb8a55c61680417404c661deb7a052773eb24344e3_0');
    });

    test('GEMS token icon', async () => {
      const url = 'ord://9418af73d138af02465b22dddd7913660dae9219cd260c4db83cda7c84713896_0';
      const displayUrl = await imageProtocols.getDisplayUrl(url);
      expect(displayUrl).toBe('https://ordfs.network/9418af73d138af02465b22dddd7913660dae9219cd260c4db83cda7c84713896_0');
    });

    test('GM POW-20 token icon', async () => {
      const url = 'ord://350ddacd88b98c0ac4590fbc88f1f92ac164cb91187759afcd73f889eea8bef7_0';
      const displayUrl = await imageProtocols.getDisplayUrl(url);
      expect(displayUrl).toBe('https://ordfs.network/350ddacd88b98c0ac4590fbc88f1f92ac164cb91187759afcd73f889eea8bef7_0');
    });
  });

  describe('Bitcoin Files Examples', () => {
    test('Rare Sirloins #2149', async () => {
      const url = 'b://cbacb16c3a03729165542f20404827f1ee91bc1f9783089c41c59524ebf75a22';
      const parsed = imageProtocols.parse(url);
      
      expect(parsed.isValid).toBe(true);
      expect(parsed.protocol).toBe('b');
      expect(parsed.txid).toBe('cbacb16c3a03729165542f20404827f1ee91bc1f9783089c41c59524ebf75a22');
      expect(parsed.vout).toBeUndefined();
      
      const displayUrl = await imageProtocols.getDisplayUrl(url);
      expect(displayUrl).toBe('https://ordfs.network/cbacb16c3a03729165542f20404827f1ee91bc1f9783089c41c59524ebf75a22_0');
    });
  });

  describe('BitFS Examples', () => {
    test('BSocial post image', async () => {
      const url = 'bitfs://868e663652556fa133878539b6c65093e36bef1a6497e511bdf0655b2ce1c935.out.0.3';
      const parsed = imageProtocols.parse(url);
      
      expect(parsed.isValid).toBe(true);
      expect(parsed.protocol).toBe('bitfs');
      expect(parsed.txid).toBe('868e663652556fa133878539b6c65093e36bef1a6497e511bdf0655b2ce1c935');
      expect(parsed.vout).toBe(0);
      
      const displayUrl = await imageProtocols.getDisplayUrl(url);
      expect(displayUrl).toBe('https://ordfs.network/868e663652556fa133878539b6c65093e36bef1a6497e511bdf0655b2ce1c935_0');
    });
  });

  describe('Native Format Examples', () => {
    test('Pixel Fox Collection ID', async () => {
      const url = '1611d956f397caa80b56bc148b4bce87b54f39b234aeca4668b4d5a7785eb9fa_0';
      const parsed = imageProtocols.parse(url);
      
      expect(parsed.isValid).toBe(true);
      expect(parsed.protocol).toBe('native');
      expect(parsed.txid).toBe('1611d956f397caa80b56bc148b4bce87b54f39b234aeca4668b4d5a7785eb9fa');
      expect(parsed.vout).toBe(0);
      
      const displayUrl = await imageProtocols.getDisplayUrl(url);
      expect(displayUrl).toBe('https://ordfs.network/1611d956f397caa80b56bc148b4bce87b54f39b234aeca4668b4d5a7785eb9fa_0');
    });

    test('Token with leading slash', async () => {
      const url = '/e6d40ba206340aa94ed40fe1a8adcd722c08c9438b2c1dd16b4527d561e848a2_0';
      const parsed = imageProtocols.parse(url);
      
      expect(parsed.isValid).toBe(true);
      expect(parsed.protocol).toBe('native');
      expect(parsed.txid).toBe('e6d40ba206340aa94ed40fe1a8adcd722c08c9438b2c1dd16b4527d561e848a2');
      expect(parsed.vout).toBe(0);
    });

    test('Content path with txid', async () => {
      const url = '/content/e6d40ba206340aa94ed40fe1a8adcd722c08c9438b2c1dd16b4527d561e848a2';
      const parsed = imageProtocols.parse(url);
      
      expect(parsed.isValid).toBe(true);
      expect(parsed.protocol).toBe('native');
      expect(parsed.txid).toBe('e6d40ba206340aa94ed40fe1a8adcd722c08c9438b2c1dd16b4527d561e848a2');
      expect(parsed.vout).toBeUndefined();
      
      const displayUrl = await imageProtocols.getDisplayUrl(url);
      expect(displayUrl).toBe('https://ordfs.network/e6d40ba206340aa94ed40fe1a8adcd722c08c9438b2c1dd16b4527d561e848a2_0');
    });

    test('Content path with txid_vout', async () => {
      const url = '/content/1611d956f397caa80b56bc148b4bce87b54f39b234aeca4668b4d5a7785eb9fa_2';
      const parsed = imageProtocols.parse(url);
      
      expect(parsed.isValid).toBe(true);
      expect(parsed.protocol).toBe('native');
      expect(parsed.txid).toBe('1611d956f397caa80b56bc148b4bce87b54f39b234aeca4668b4d5a7785eb9fa');
      expect(parsed.vout).toBe(2);
      
      const displayUrl = await imageProtocols.getDisplayUrl(url);
      expect(displayUrl).toBe('https://ordfs.network/1611d956f397caa80b56bc148b4bce87b54f39b234aeca4668b4d5a7785eb9fa_2');
    });

    test('Dot notation format', async () => {
      const url = '1611d956f397caa80b56bc148b4bce87b54f39b234aeca4668b4d5a7785eb9fa.3';
      const parsed = imageProtocols.parse(url);
      
      expect(parsed.isValid).toBe(true);
      expect(parsed.protocol).toBe('native');
      expect(parsed.txid).toBe('1611d956f397caa80b56bc148b4bce87b54f39b234aeca4668b4d5a7785eb9fa');
      expect(parsed.vout).toBe(3);
      
      const displayUrl = await imageProtocols.getDisplayUrl(url);
      expect(displayUrl).toBe('https://ordfs.network/1611d956f397caa80b56bc148b4bce87b54f39b234aeca4668b4d5a7785eb9fa_3');
    });

    test('Bitcoin-style output notation (txido0)', async () => {
      const url = '1611d956f397caa80b56bc148b4bce87b54f39b234aeca4668b4d5a7785eb9fao1';
      const parsed = imageProtocols.parse(url);
      
      expect(parsed.isValid).toBe(true);
      expect(parsed.protocol).toBe('native');
      expect(parsed.txid).toBe('1611d956f397caa80b56bc148b4bce87b54f39b234aeca4668b4d5a7785eb9fa');
      expect(parsed.vout).toBe(1);
      
      const displayUrl = await imageProtocols.getDisplayUrl(url);
      expect(displayUrl).toBe('https://ordfs.network/1611d956f397caa80b56bc148b4bce87b54f39b234aeca4668b4d5a7785eb9fa_1');
    });

    test('Bitcoin-style input notation (txidi0)', async () => {
      const url = '1611d956f397caa80b56bc148b4bce87b54f39b234aeca4668b4d5a7785eb9fai2';
      const parsed = imageProtocols.parse(url);
      
      expect(parsed.isValid).toBe(true);
      expect(parsed.protocol).toBe('native');
      expect(parsed.txid).toBe('1611d956f397caa80b56bc148b4bce87b54f39b234aeca4668b4d5a7785eb9fa');
      expect(parsed.vout).toBe(2);
      
      const displayUrl = await imageProtocols.getDisplayUrl(url);
      expect(displayUrl).toBe('https://ordfs.network/1611d956f397caa80b56bc148b4bce87b54f39b234aeca4668b4d5a7785eb9fa_2');
    });

    test('Slash with dot notation', async () => {
      const url = '/1611d956f397caa80b56bc148b4bce87b54f39b234aeca4668b4d5a7785eb9fa.5';
      const parsed = imageProtocols.parse(url);
      
      expect(parsed.isValid).toBe(true);
      expect(parsed.protocol).toBe('native');
      expect(parsed.txid).toBe('1611d956f397caa80b56bc148b4bce87b54f39b234aeca4668b4d5a7785eb9fa');
      expect(parsed.vout).toBe(5);
    });

    test('Content path with dot notation', async () => {
      const url = '/content/1611d956f397caa80b56bc148b4bce87b54f39b234aeca4668b4d5a7785eb9fa.7';
      const parsed = imageProtocols.parse(url);
      
      expect(parsed.isValid).toBe(true);
      expect(parsed.protocol).toBe('native');
      expect(parsed.txid).toBe('1611d956f397caa80b56bc148b4bce87b54f39b234aeca4668b4d5a7785eb9fa');
      expect(parsed.vout).toBe(7);
    });
  });

  describe('Batch Processing Real Examples', () => {
    test('processes multiple token icons', async () => {
      const tokenIcons = [
        'ord://a54d3af24a03bcc28f6b3f2dd0ad249ee042b2f4b95810ae5184ab617a74b8b9_0', // 1SAT
        'ord://9418af73d138af02465b22dddd7913660dae9219cd260c4db83cda7c84713896_0', // GEMS
        'ord://350ddacd88b98c0ac4590fbc88f1f92ac164cb91187759afcd73f889eea8bef7_0', // GM
      ];

      const results = await imageProtocols.getDisplayUrls(tokenIcons);
      
      expect(results.size).toBe(3);
      tokenIcons.forEach(url => {
        expect(results.has(url)).toBe(true);
        expect(results.get(url)).toContain('https://ordfs.network/');
      });
    });
  });

  describe('Edge Cases from Real Usage', () => {
    test('handles various txid_vout separators', async () => {
      const txid = 'a54d3af24a03bcc28f6b3f2dd0ad249ee042b2f4b95810ae5184ab617a74b8b9';
      
      // Underscore separator
      const url1 = `ord://${txid}_0`;
      const result1 = await imageProtocols.getDisplayUrl(url1);
      expect(result1).toBe(`https://ordfs.network/${txid}_0`);
      
      // Dot separator (ordinals style)
      const url2 = `ord://${txid}.0`;
      const result2 = await imageProtocols.getDisplayUrl(url2);
      expect(result2).toBe(`https://ordfs.network/${txid}_0`);
    });

    test('handles token IDs without explicit protocol', async () => {
      const tokenIds = [
        'a54d3af24a03bcc28f6b3f2dd0ad249ee042b2f4b95810ae5184ab617a74b8b9_0',
        '9418af73d138af02465b22dddd7913660dae9219cd260c4db83cda7c84713896_1',
        'e6d40ba206340aa94ed40fe1a8adcd722c08c9438b2c1dd16b4527d561e848a2_0',
      ];

      for (const id of tokenIds) {
        const parsed = imageProtocols.parse(id);
        expect(parsed.isValid).toBe(true);
        expect(parsed.protocol).toBe('native');
        
        const displayUrl = await imageProtocols.getDisplayUrl(id);
        expect(displayUrl).toContain('https://ordfs.network/');
      }
    });
  });

  describe('Integration with Different Gateways', () => {
    test('custom gateway for token resolution', async () => {
      const customProtocols = new ImageProtocols({
        handlers: {
          ord: (parsed) => {
            // Use a hypothetical token-specific gateway
            return `https://tokens.1satordinals.com/api/icon/${parsed.txid}_${parsed.vout || 0}`;
          }
        }
      });

      const tokenUrl = 'ord://a54d3af24a03bcc28f6b3f2dd0ad249ee042b2f4b95810ae5184ab617a74b8b9_0';
      const displayUrl = await customProtocols.getDisplayUrl(tokenUrl);
      
      expect(displayUrl).toBe('https://tokens.1satordinals.com/api/icon/a54d3af24a03bcc28f6b3f2dd0ad249ee042b2f4b95810ae5184ab617a74b8b9_0');
    });
  });
});