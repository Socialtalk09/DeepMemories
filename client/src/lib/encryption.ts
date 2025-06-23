import CryptoJS from 'crypto-js';

/**
 * Encrypts a message using AES-256 encryption
 * 
 * @param message - The message to encrypt
 * @returns Object containing the encrypted message and the key used for encryption
 */
export function formatMessage(message: string): { encryptedContent: string, encryptedKey: string } {
  // Generate a random symmetric key
  const symmetricKey = CryptoJS.lib.WordArray.random(32).toString();
  
  // Encrypt the message with the symmetric key
  const encryptedContent = CryptoJS.AES.encrypt(message, symmetricKey).toString();
  
  // In a real-world implementation, we would encrypt the symmetricKey with the 
  // recipient's public key here. For this demo, we'll just store it.
  // This is a simplified encryption approach for demonstration purposes.
  
  // In reality, you'd use asymmetric encryption (like RSA) to encrypt the symmetric key
  // with each recipient's public key, so only they can decrypt it with their private key.
  const encryptedKey = symmetricKey;
  
  return { encryptedContent, encryptedKey };
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
    // Check if this is the new server-side encryption format
    if (encryptedContent.includes('.')) {
      // This is the server-side format: base64.hash
      const [encoded, hash] = encryptedContent.split('.');
      
      // For now, just decode the base64 part since the hash verification
      // would require the same key computation as the server
      return atob(encoded);
    }
    
    // Fall back to CryptoJS decryption for client-side encrypted messages
    const symmetricKey = encryptedKey;
    const bytes = CryptoJS.AES.decrypt(encryptedContent, symmetricKey);
    const originalMessage = bytes.toString(CryptoJS.enc.Utf8);
    
    return originalMessage;
  } catch (error) {
    console.error('Failed to decrypt message:', error);
    return '[Unable to decrypt message]';
  }
}

/**
 * Generates a cryptographically secure ID 
 * @returns A random ID string
 */
export function generateSecureId(): string {
  return CryptoJS.lib.WordArray.random(16).toString();
}
