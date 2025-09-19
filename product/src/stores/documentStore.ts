import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import CryptoJS from 'crypto-js';
import { MerkleTree } from 'merkletreejs';
import { useAuthStore } from './authStore';
import { encodeBase64, decodeBase64, stringToUint8Array } from '../utils/encoding';

export interface Document {
  id: string;
  name: string;
  hash: string;
  issuerId: string;
  issuerName: string;
  issuerPublicKey: string;
  timestamp: number;
  signature: string;
  merkleRoot?: string;
  merkleProof?: string[];
  transactionId?: string;
  expiryTimestamp?: number;
  invalidationTimestamp?: number | null;
  status: 'valid' | 'invalid' | 'expired';
}

interface DocumentsState {
  documents: Document[];
  issuedDocuments: Document[];
  addDocument: (doc: Omit<Document, 'id' | 'hash' | 'signature' | 'status'>) => Document;
  getDocument: (id: string) => Document | undefined;
  invalidateDocument: (id: string) => void;
  verifyDocument: (hash: string, signature: string, issuerPublicKey: string) => boolean;
  issueBatch: (documents: Omit<Document, 'id' | 'hash' | 'signature' | 'status' | 'merkleRoot' | 'merkleProof' | 'transactionId'>[]) => Document[];
}

// Helper function to generate a Merkle Tree from document hashes
const generateMerkleTree = (docs: Document[]) => {
  const leaves = docs.map(doc => CryptoJS.SHA256(doc.hash).toString());
  const tree = new MerkleTree(leaves, CryptoJS.SHA256);
  return { tree, root: tree.getRoot().toString('hex') };
};

export const useDocumentStore = create<DocumentsState>()(
  persist(
    (set, get) => ({
      documents: [],
      issuedDocuments: [],

      addDocument: (docData) => {
        const authStore = useAuthStore.getState();
        const id = `doc_${Date.now().toString(36)}`;
        
        // Create hash from document data
        const hash = CryptoJS.SHA256(JSON.stringify({
          name: docData.name,
          issuerId: docData.issuerId,
          issuerName: docData.issuerName,
          timestamp: docData.timestamp,
          expiryTimestamp: docData.expiryTimestamp,
          invalidationTimestamp: docData.invalidationTimestamp
        })).toString();
        
        // Sign the hash
        const signature = authStore.privateKey 
          ? encodeBase64(authStore.sign(stringToUint8Array(hash)) || new Uint8Array())
          : '';
        
        const doc: Document = {
          id,
          hash,
          signature,
          status: 'valid',
          ...docData
        };
        
        set(state => ({
          documents: [...state.documents, doc],
          issuedDocuments: authStore.issuerId === doc.issuerId 
            ? [...state.issuedDocuments, doc] 
            : state.issuedDocuments
        }));
        
        return doc;
      },

      getDocument: (id) => {
        return get().documents.find(doc => doc.id === id);
      },

      invalidateDocument: (id) => {
        set(state => ({
          documents: state.documents.map(doc => 
            doc.id === id 
              ? { ...doc, status: 'invalid', invalidationTimestamp: Date.now() } 
              : doc
          ),
          issuedDocuments: state.issuedDocuments.map(doc => 
            doc.id === id 
              ? { ...doc, status: 'invalid', invalidationTimestamp: Date.now() } 
              : doc
          )
        }));
      },

      verifyDocument: (hash, signature, issuerPublicKey) => {
        try {
          const publicKeyBytes = decodeBase64(issuerPublicKey);
          const signatureBytes = decodeBase64(signature);
          const messageBytes = stringToUint8Array(hash);
          
          return useAuthStore.getState().verify(messageBytes, signatureBytes);
        } catch (error) {
          console.error('Verification failed', error);
          return false;
        }
      },

      issueBatch: (documents) => {
        const authStore = useAuthStore.getState();
        
        // Create individual documents
        const newDocs = documents.map(doc => {
          const id = `doc_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 9)}`;
          
          // Create hash from document data
          const hash = CryptoJS.SHA256(JSON.stringify({
            name: doc.name,
            issuerId: doc.issuerId,
            issuerName: doc.issuerName,
            timestamp: doc.timestamp,
            expiryTimestamp: doc.expiryTimestamp,
          })).toString();
          
          // Sign the hash
          const signature = authStore.privateKey 
            ? encodeBase64(authStore.sign(stringToUint8Array(hash)) || new Uint8Array())
            : '';
          
          return {
            id,
            hash,
            signature,
            status: 'valid' as const,
            ...doc
          };
        });
        
        // Generate Merkle tree and proofs
        const { tree, root } = generateMerkleTree(newDocs);
        
        // Add Merkle root and proofs to documents
        const docsWithMerkle = newDocs.map(doc => {
          const leaf = CryptoJS.SHA256(doc.hash).toString();
          const proof = tree.getProof(leaf).map(p => p.data.toString('hex'));
          
          return {
            ...doc,
            merkleRoot: root,
            merkleProof: proof,
            transactionId: `tx_${Date.now().toString(36)}`
          };
        });
        
        // Update state
        set(state => ({
          documents: [...state.documents, ...docsWithMerkle],
          issuedDocuments: authStore.issuerId === docsWithMerkle[0]?.issuerId 
            ? [...state.issuedDocuments, ...docsWithMerkle] 
            : state.issuedDocuments
        }));
        
        return docsWithMerkle;
      }
    }),
    {
      name: 'document-storage',
    }
  )
);