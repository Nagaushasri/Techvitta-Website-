import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { 
  FileText, 
  Upload, 
  Clock,
  Check,
  AlignLeft,
  Calendar,
  Users,
  Shield
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';
import { useDocumentStore } from '../../stores/documentStore';

const IssueDocument: React.FC = () => {
  const navigate = useNavigate();
  const { issuerId, issuerName, publicKey } = useAuthStore();
  const { addDocument, issueBatch } = useDocumentStore();
  
  const [documentName, setDocumentName] = useState('');
  const [documentDescription, setDocumentDescription] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [acceptedFiles, setAcceptedFiles] = useState<File[]>([]);
  const [issuanceMode, setIssuanceMode] = useState<'single' | 'batch'>('single');
  const [isIssuing, setIsIssuing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => {
      setAcceptedFiles(files);
    },
    multiple: issuanceMode === 'batch',
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (issuanceMode === 'single') {
      handleSingleIssue();
    } else {
      handleBatchIssue();
    }
  };

  const handleSingleIssue = () => {
    if (!documentName) return;
    
    setIsIssuing(true);
    
    // Simulate blockchain anchoring
    setTimeout(() => {
      // Add document to store
      addDocument({
        name: documentName,
        issuerId,
        issuerName,
        timestamp: Date.now(),
        issuerPublicKey: publicKey ? Buffer.from(publicKey).toString('base64') : '',
        expiryTimestamp: expiryDate ? new Date(expiryDate).getTime() : undefined,
        invalidationTimestamp: null
      });
      
      setIsIssuing(false);
      setIsSuccess(true);
      
      // Redirect to dashboard after a brief success message
      setTimeout(() => {
        navigate('/issuer/dashboard');
      }, 2000);
    }, 2000);
  };

  const handleBatchIssue = () => {
    if (acceptedFiles.length === 0) return;
    
    setIsIssuing(true);
    
    // Prepare batch of documents
    const documents = acceptedFiles.map((file, index) => ({
      name: file.name,
      issuerId,
      issuerName,
      timestamp: Date.now(),
      issuerPublicKey: publicKey ? Buffer.from(publicKey).toString('base64') : '',
      expiryTimestamp: expiryDate ? new Date(expiryDate).getTime() : undefined,
      invalidationTimestamp: null
    }));
    
    // Simulate blockchain anchoring for batch issuance
    setTimeout(() => {
      // Add batch to store
      issueBatch(documents);
      
      setIsIssuing(false);
      setIsSuccess(true);
      
      // Redirect to dashboard after a brief success message
      setTimeout(() => {
        navigate('/issuer/dashboard');
      }, 2000);
    }, 3000);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Issue New Document</h1>
          <p className="mt-2 text-gray-600">
            Create a new document anchored securely on the blockchain
          </p>
        </div>

        {isSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-8 rounded-lg shadow-md text-center"
          >
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="mt-3 text-lg font-medium text-gray-900">Document issued successfully!</h2>
            <p className="mt-2 text-gray-500">
              Your document has been anchored to the blockchain and is now available in your dashboard.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => navigate('/issuer/dashboard')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Go to Dashboard
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Document Details
                </h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Issuance Mode:</span>
                  <div className="flex items-center bg-gray-200 rounded-lg p-1 text-sm">
                    <button
                      type="button"
                      onClick={() => setIssuanceMode('single')}
                      className={`px-3 py-1 rounded-md ${
                        issuanceMode === 'single' 
                          ? 'bg-white shadow-sm text-gray-800' 
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      Single
                    </button>
                    <button
                      type="button"
                      onClick={() => setIssuanceMode('batch')}
                      className={`px-3 py-1 rounded-md ${
                        issuanceMode === 'batch' 
                          ? 'bg-white shadow-sm text-gray-800' 
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      Batch
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="px-4 py-5 sm:p-6 space-y-6">
                {issuanceMode === 'single' && (
                  <>
                    <div>
                      <label htmlFor="documentName" className="block text-sm font-medium text-gray-700">
                        Document Name
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <div className="relative flex items-stretch flex-grow">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <AlignLeft className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            id="documentName"
                            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                            placeholder="Enter document name or title"
                            value={documentName}
                            onChange={(e) => setDocumentName(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="documentDescription" className="block text-sm font-medium text-gray-700">
                        Description (Optional)
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="documentDescription"
                          rows={3}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="Enter a description of this document"
                          value={documentDescription}
                          onChange={(e) => setDocumentDescription(e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                )}

                {issuanceMode === 'batch' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Documents
                    </label>
                    
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
                            <span>Upload files</span>
                            <input {...getInputProps()} />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PDF, DOC, DOCX, JPG, PNG up to 10MB each
                        </p>
                      </div>
                    </div>

                    {acceptedFiles.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700">Selected Files ({acceptedFiles.length})</h4>
                        <ul className="mt-2 border border-gray-200 rounded-md divide-y divide-gray-200">
                          {acceptedFiles.map((file, index) => (
                            <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                              <div className="flex items-center">
                                <FileText className="flex-shrink-0 h-5 w-5 text-gray-400 mr-2" />
                                <span className="ml-2 flex-1 w-0 truncate">{file.name}</span>
                              </div>
                              <div className="ml-4 flex-shrink-0">
                                <span className="font-medium text-gray-500">
                                  {(file.size / 1024).toFixed(0)} KB
                                </span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                    Expiry Date (Optional)
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <div className="relative flex items-stretch flex-grow">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        id="expiryDate"
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    After this date, the document will be marked as expired.
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Shield className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">
                        Document Authenticity
                      </h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>
                          This document will be signed with your private key and anchored to the blockchain, ensuring it cannot be tampered with.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate('/issuer/dashboard')}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isIssuing || (issuanceMode === 'single' ? !documentName : acceptedFiles.length === 0)}
                  className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    isIssuing || (issuanceMode === 'single' ? !documentName : acceptedFiles.length === 0)
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isIssuing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Issuing Document...
                    </>
                  ) : (
                    'Issue Document'
                  )}
                </button>
              </div>
            </form>

            {/* Issuing progress indicators */}
            {isIssuing && (
              <div className="px-4 py-5 sm:p-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-4">Issuing Process</h4>
                <div className="space-y-5">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-sm font-medium text-gray-900">Generating document hash</span>
                      </div>
                      <span className="text-xs text-green-500">Completed</span>
                    </div>
                    <div className="h-1.5 bg-green-100 rounded-full overflow-hidden">
                      <div className="h-1.5 bg-green-500 rounded-full w-full"></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-sm font-medium text-gray-900">Signing with issuer key</span>
                      </div>
                      <span className="text-xs text-green-500">Completed</span>
                    </div>
                    <div className="h-1.5 bg-green-100 rounded-full overflow-hidden">
                      <div className="h-1.5 bg-green-500 rounded-full w-full"></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-blue-500 mr-2" />
                        <span className="text-sm font-medium text-gray-900">Anchoring to blockchain</span>
                      </div>
                      <span className="text-xs text-blue-500">In progress</span>
                    </div>
                    <div className="h-1.5 bg-blue-100 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-1.5 bg-blue-500 rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: "70%" }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                      ></motion.div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default IssueDocument;