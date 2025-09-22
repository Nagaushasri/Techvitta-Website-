import React, { useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Upload, 
  Search, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Clock,
  Key,
  Calendar,
  Shield
} from 'lucide-react';
import { useDocumentStore } from '../../stores/documentStore';
import CryptoJS from 'crypto-js';
import { decodeBase64, stringToUint8Array } from '../../utils/encoding';

const VerifyDocument: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { documents, verifyDocument } = useDocumentStore();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [documentHash, setDocumentHash] = useState(searchParams.get('hash') || '');
  const [signature, setSignature] = useState(searchParams.get('signature') || '');
  const [issuerPublicKey, setIssuerPublicKey] = useState(searchParams.get('issuerPublicKey') || '');
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    isValid: boolean;
    issuer?: string;
    timestamp?: number;
    merkleRoot?: string;
    transactionId?: string;
    documentName?: string;
    expiryTimestamp?: number;
    invalidationTimestamp?: number | null;
    status?: 'valid' | 'invalid' | 'expired';
  } | null>(null);
  
  const [showManualFields, setShowManualFields] = useState(
    documentHash !== '' || signature !== '' || issuerPublicKey !== ''
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => {
      if (files.length > 0) {
        handleFileUpload(files[0]);
      }
    },
    multiple: false,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/json': ['.json'],
      'text/plain': ['.txt']
    }
  });

  const handleFileUpload = (file: File) => {
    // In a real implementation, this would parse the file to extract verification data
    // Here we'll simulate reading a JSON file with verification data
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        if (e.target?.result) {
          // Try to parse as JSON - in a real app, this would extract embedded metadata
          const fileContent = e.target.result.toString();
          try {
            const jsonData = JSON.parse(fileContent);
            if (jsonData.hash && jsonData.signature && jsonData.issuerPublicKey) {
              setDocumentHash(jsonData.hash);
              setSignature(jsonData.signature);
              setIssuerPublicKey(jsonData.issuerPublicKey);
              setShowManualFields(true);
            }
          } catch (error) {
            // If not JSON, use the file itself to generate a hash for demonstration
            const hash = CryptoJS.SHA256(fileContent).toString();
            setDocumentHash(hash);
            setShowManualFields(true);
            
            // Check if we have this hash in our document store
            const matchedDoc = documents.find(doc => doc.hash === hash);
            if (matchedDoc) {
              setSignature(matchedDoc.signature);
              setIssuerPublicKey(matchedDoc.issuerPublicKey);
            }
          }
        }
      } catch (error) {
        console.error('Error processing file:', error);
      }
    };
    reader.readAsText(file);
  };

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!documentHash || !signature || !issuerPublicKey) {
      return;
    }
    
    setIsVerifying(true);
    
    // Simulate verification process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Find document in our store (in a real app, this would verify against the blockchain)
    const matchedDoc = documents.find(doc => doc.hash === documentHash);
    
    // Verify signature using the verification function
    const isSignatureValid = verifyDocument(documentHash, signature, issuerPublicKey);
    
    if (matchedDoc && isSignatureValid) {
      setVerificationResult({
        isValid: true,
        issuer: matchedDoc.issuerName,
        timestamp: matchedDoc.timestamp,
        merkleRoot: matchedDoc.merkleRoot,
        transactionId: matchedDoc.transactionId,
        documentName: matchedDoc.name,
        expiryTimestamp: matchedDoc.expiryTimestamp,
        invalidationTimestamp: matchedDoc.invalidationTimestamp,
        status: matchedDoc.status
      });
    } else {
      setVerificationResult({
        isValid: false
      });
    }
    
    setIsVerifying(false);
  };

  // If we have URL params, verify automatically
  React.useEffect(() => {
    if (documentHash && signature && issuerPublicKey) {
      handleVerify();
    }
  }, []);

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getVerificationStatusBadge = () => {
    if (!verificationResult) return null;
    
    if (!verificationResult.isValid) {
      return (
        <div className="flex items-center text-red-800 bg-red-100 px-4 py-3 rounded-lg">
          <XCircle className="h-6 w-6 mr-2" />
          <span className="font-medium">Invalid Document</span>
        </div>
      );
    }
    
    if (verificationResult.status === 'invalid') {
      return (
        <div className="flex items-center text-red-800 bg-red-100 px-4 py-3 rounded-lg">
          <AlertTriangle className="h-6 w-6 mr-2" />
          <span className="font-medium">Document Has Been Invalidated</span>
        </div>
      );
    }
    
    if (verificationResult.status === 'expired' || 
        (verificationResult.expiryTimestamp && verificationResult.expiryTimestamp < Date.now())) {
      return (
        <div className="flex items-center text-yellow-800 bg-yellow-100 px-4 py-3 rounded-lg">
          <Clock className="h-6 w-6 mr-2" />
          <span className="font-medium">Document Has Expired</span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center text-green-800 bg-green-100 px-4 py-3 rounded-lg">
        <CheckCircle className="h-6 w-6 mr-2" />
        <span className="font-medium">Valid Document</span>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Verify Document</h1>
          <p className="mt-2 text-gray-600">
            Verify the authenticity of a document using its blockchain fingerprint
          </p>
        </div>

        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Document Verification
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Upload a document or enter its verification details manually
            </p>
          </div>

          <div className="px-4 py-5 sm:p-6">
            {!verificationResult && !isVerifying && (
              <>
                <div 
                  {...getRootProps()} 
                  className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${
                    isDragActive ? 'border-blue-300 bg-blue-50' : 'border-gray-300'
                  } border-dashed rounded-md cursor-pointer hover:bg-gray-50 transition-colors duration-200`}
                >
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                      >
                        <span>Upload a document</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          ref={fileInputRef}
                          {...getInputProps()}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, DOC, DOCX, JSON, or TXT
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center">
                  <div className="flex-grow border-t border-gray-200"></div>
                  <button
                    type="button"
                    onClick={() => setShowManualFields(!showManualFields)}
                    className="mx-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                  >
                    {showManualFields ? 'Hide manual entry' : 'Or enter details manually'}
                  </button>
                  <div className="flex-grow border-t border-gray-200"></div>
                </div>

                {showManualFields && (
                  <form onSubmit={handleVerify} className="mt-4 space-y-4">
                    <div>
                      <label htmlFor="documentHash" className="block text-sm font-medium text-gray-700">
                        Document Hash
                      </label>
                      <input
                        type="text"
                        id="documentHash"
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        value={documentHash}
                        onChange={(e) => setDocumentHash(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="signature" className="block text-sm font-medium text-gray-700">
                        Signature
                      </label>
                      <input
                        type="text"
                        id="signature"
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        value={signature}
                        onChange={(e) => setSignature(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="issuerPublicKey" className="block text-sm font-medium text-gray-700">
                        Issuer's Public Key
                      </label>
                      <input
                        type="text"
                        id="issuerPublicKey"
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        value={issuerPublicKey}
                        onChange={(e) => setIssuerPublicKey(e.target.value)}
                        required
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <Search className="w-4 h-4 mr-2" />
                        Verify Document
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}

            {isVerifying && (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4">
                  <svg className="animate-spin h-16 w-16 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Verifying Document</h3>
                <p className="text-gray-500">
                  Checking document authenticity on the blockchain...
                </p>
              </div>
            )}

            {verificationResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-6">
                  {getVerificationStatusBadge()}
                </div>

                <div className="border-t border-b border-gray-200 py-4 mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Document Information</h3>
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                    {verificationResult.documentName && (
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">Document Name</dt>
                        <dd className="mt-1 text-sm text-gray-900">{verificationResult.documentName}</dd>
                      </div>
                    )}
                    
                    {verificationResult.issuer && (
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Issuer</dt>
                        <dd className="mt-1 text-sm text-gray-900 flex items-center">
                          <Shield className="h-4 w-4 text-blue-500 mr-1" />
                          {verificationResult.issuer}
                        </dd>
                      </div>
                    )}
                    
                    {verificationResult.timestamp && (
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Issuance Date</dt>
                        <dd className="mt-1 text-sm text-gray-900">{formatDate(verificationResult.timestamp)}</dd>
                      </div>
                    )}
                    
                    {verificationResult.transactionId && (
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">Transaction ID</dt>
                        <dd className="mt-1 text-sm text-gray-900 font-mono">{verificationResult.transactionId}</dd>
                      </div>
                    )}
                    
                    {verificationResult.expiryTimestamp && (
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Expiry Date</dt>
                        <dd className="mt-1 text-sm text-gray-900">{formatDate(verificationResult.expiryTimestamp)}</dd>
                      </div>
                    )}
                    
                    {verificationResult.invalidationTimestamp && (
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Invalidation Date</dt>
                        <dd className="mt-1 text-sm text-gray-900">{formatDate(verificationResult.invalidationTimestamp)}</dd>
                      </div>
                    )}
                    
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">Document Hash</dt>
                      <dd className="mt-1 text-sm text-gray-900 font-mono break-all bg-gray-50 p-2 rounded">{documentHash}</dd>
                    </div>
                  </dl>
                </div>

                <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Key className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">
                        Cryptographic Verification
                      </h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>
                          {verificationResult.isValid 
                            ? "The document's digital signature has been verified using the issuer's public key. The document has not been tampered with."
                            : "The document could not be verified. It may have been tampered with or the verification details are incorrect."
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setVerificationResult(null);
                      setDocumentHash('');
                      setSignature('');
                      setIssuerPublicKey('');
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Verify Another Document
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyDocument;