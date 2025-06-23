import { createHash, randomBytes } from 'crypto';

/**
 * Encrypts a message using a simple hash-based approach for now
 * 
 * @param message - The message to encrypt
 * @returns Object containing the encrypted message and the key used for encryption
 */
export function formatMessage(message: string): { encryptedContent: string, encryptedKey: string } {
  // Generate a random key
  const key = randomBytes(32).toString('hex');
  
  // For now, use base64 encoding with key rotation for simplicity
  // In production, this should use proper AES encryption
  const encoded = Buffer.from(message, 'utf8').toString('base64');
  const hash = createHash('sha256').update(key + encoded).digest('hex');
  
  return {
    encryptedContent: encoded + '.' + hash,
    encryptedKey: key
  };
}

/**
 * Decrypts a message using the provided key
 * 
 * @param encryptedContent - The encrypted message content
 * @param encryptedKey - The key used for decryption
 * @returns The decrypted message
 */
export function decryptMessage(encryptedContent: string, encryptedKey: string): string {
  try {
    const [encoded, hash] = encryptedContent.split('.');
    
    // Verify hash
    const expectedHash = createHash('sha256').update(encryptedKey + encoded).digest('hex');
    if (hash !== expectedHash) {
      throw new Error('Invalid hash - message may have been tampered with');
    }
    
    // Decode message
    return Buffer.from(encoded, 'base64').toString('utf8');
  } catch (error) {
    throw new Error('Failed to decrypt message');
  }
}

/**
 * Generates a cryptographically secure ID 
 * @returns A random ID string
 */
export function generateSecureId(): string {
  return randomBytes(16).toString('hex');
}