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
  // In a real implementation, we would first decrypt the encryptedKey using the
  // recipient's private key. For this demo, we'll just use it directly.
  const symmetricKey = encryptedKey;
  
  // Decrypt the message using the symmetric key
  const bytes = CryptoJS.AES.decrypt(encryptedContent, symmetricKey);
  const originalMessage = bytes.toString(CryptoJS.enc.Utf8);
  
  return originalMessage;
}

/**
 * Generates a cryptographically secure ID 
 * @returns A random ID string
 */
export function generateSecureId(): string {
  return CryptoJS.lib.WordArray.random(16).toString();
}
