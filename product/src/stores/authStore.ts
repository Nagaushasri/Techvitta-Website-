import { create } from 'zustand';
import nacl from 'tweetnacl';
import { encodeBase64, decodeBase64 } from '../utils/encoding';

interface AuthState {
  isAuthenticated: boolean;
  issuerName: string;
  issuerId: string;
  publicKey: Uint8Array | null;
  privateKey: Uint8Array | null;
  login: (name: string) => void;
  logout: () => void;
  generateKeyPair: () => void;
  sign: (message: Uint8Array) => Uint8Array | null;
  verify: (message: Uint8Array, signature: Uint8Array) => boolean;
}

const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  issuerName: '',
  issuerId: '',
  publicKey: null,
  privateKey: null,

  login: (name: string) => {
    const id = `issuer_${Date.now().toString(36)}`;
    set({ isAuthenticated: true, issuerName: name, issuerId: id });
    get().generateKeyPair();
    // Store in localStorage for persistence
    localStorage.setItem('issuerName', name);
    localStorage.setItem('issuerId', id);
  },

  logout: () => {
    set({
      isAuthenticated: false,
      issuerName: '',
      issuerId: '',
      publicKey: null,
      privateKey: null,
    });
    // Clear from localStorage
    localStorage.removeItem('issuerName');
    localStorage.removeItem('issuerId');
    localStorage.removeItem('publicKey');
  },

  generateKeyPair: () => {
    const keyPair = nacl.sign.keyPair();
    set({
      publicKey: keyPair.publicKey,
      privateKey: keyPair.secretKey,
    });
    // Store public key for persistence (private key should be handled more securely in production)
    localStorage.setItem('publicKey', encodeBase64(keyPair.publicKey));
    // In a real app, the private key would be stored securely, not in localStorage
    localStorage.setItem('privateKey', encodeBase64(keyPair.secretKey));
  },

  sign: (message: Uint8Array) => {
    const { privateKey } = get();
    if (!privateKey) return null;
    return nacl.sign.detached(message, privateKey);
  },

  verify: (message: Uint8Array, signature: Uint8Array) => {
    const { publicKey } = get();
    if (!publicKey) return false;
    return nacl.sign.detached.verify(message, signature, publicKey);
  },
}));

// Initialize from localStorage if available
if (typeof window !== 'undefined') {
  const issuerName = localStorage.getItem('issuerName');
  const issuerId = localStorage.getItem('issuerId');
  const publicKey = localStorage.getItem('publicKey');
  const privateKey = localStorage.getItem('privateKey');

  if (issuerName && issuerId) {
    useAuthStore.setState({
      isAuthenticated: true,
      issuerName,
      issuerId,
      publicKey: publicKey ? decodeBase64(publicKey) : null,
      privateKey: privateKey ? decodeBase64(privateKey) : null,
    });
  }
}

export { useAuthStore };