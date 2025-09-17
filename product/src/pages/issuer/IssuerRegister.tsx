import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Key, Shield, Lock } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

const IssuerRegister: React.FC = () => {
  const [name, setName] = useState('');
  const [isGeneratingKeys, setIsGeneratingKeys] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      return;
    }

    setIsGeneratingKeys(true);
    
    // Simulate key generation process for better UX
    setTimeout(() => {
      login(name);
      setIsGeneratingKeys(false);
      navigate('/issuer/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="md:flex">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 py-8 px-6 md:w-56 flex flex-col justify-center items-center md:justify-start">
            <Shield className="h-12 w-12 text-white mb-4" />
            <h2 className="text-lg text-white font-bold text-center">
              Issuer Registration
            </h2>
            <p className="mt-2 text-blue-100 text-sm text-center hidden md:block">
              Create your issuer account to start anchoring documents on the blockchain
            </p>
          </div>
          <div className="p-8 w-full">
            <div className="text-center md:text-left mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Create Issuer Account</h1>
              <p className="mt-2 text-gray-600">
                Register as a document issuer to start using TrustChain Vault
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Issuer Name
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="organization"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Organization or issuer name"
                  />
                </div>
              </div>

              <div className="bg-blue-50 rounded-md p-4 border border-blue-100">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Key className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Key Pair Generation</h3>
                    <p className="mt-1 text-sm text-blue-700">
                      A cryptographic key pair will be generated for you when you register. 
                      This key pair is used to sign and verify your documents.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isGeneratingKeys}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    isGeneratingKeys 
                      ? 'bg-blue-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  }`}
                >
                  {isGeneratingKeys ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating Secure Keys...
                    </>
                  ) : (
                    'Register as Issuer'
                  )}
                </button>
              </div>
            </form>

            {isGeneratingKeys && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mt-6 p-4 bg-gray-50 rounded-md border border-gray-200"
              >
                <h3 className="text-sm font-medium text-gray-700 flex items-center">
                  <Lock className="h-4 w-4 mr-2 text-blue-500" />
                  Generating Secure Credentials
                </h3>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 1 }}
                      className="h-1 bg-blue-500 rounded"
                    ></motion.div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Creating cryptographic key pair for secure document signing...
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssuerRegister;