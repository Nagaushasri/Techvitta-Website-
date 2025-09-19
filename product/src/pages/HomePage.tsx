import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, FileCheck, FileX, Key, Database } from 'lucide-react';

const HomePage: React.FC = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 sm:pt-24">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                TrustChain Vault
              </span>
            </motion.h1>
            <motion.p 
              className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              A platform for decentralized verification of digital documents and transactions using blockchain technology.
            </motion.p>
            <motion.div 
              className="mt-8 flex justify-center space-x-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link 
                to="/verify" 
                className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium shadow-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Verify Documents
              </Link>
              <Link 
                to="/issuer/register" 
                className="px-6 py-3 rounded-lg bg-white text-blue-600 font-medium shadow-lg border border-blue-200 hover:bg-blue-50 transition-colors duration-200"
              >
                Issuer Portal
              </Link>
            </motion.div>
          </div>

          {/* Floating documents illustration */}
          <motion.div 
            className="mt-12 relative h-64 md:h-80"
            initial="hidden"
            animate="visible"
            variants={staggerChildren}
          >
            <motion.div 
              className="absolute left-1/4 top-1/4 transform -translate-x-1/2 -translate-y-1/2 w-20 h-28 md:w-32 md:h-40 bg-white rounded-lg shadow-lg flex items-center justify-center border-2 border-blue-200"
              variants={fadeIn}
              custom={1}
            >
              <FileCheck className="text-blue-500" size={32} />
            </motion.div>
            <motion.div 
              className="absolute left-1/2 top-1/3 transform -translate-x-1/2 -translate-y-1/2 w-20 h-28 md:w-32 md:h-40 bg-white rounded-lg shadow-lg flex items-center justify-center border-2 border-teal-200"
              variants={fadeIn}
              custom={2}
            >
              <Key className="text-teal-500" size={32} />
            </motion.div>
            <motion.div 
              className="absolute right-1/4 top-1/4 transform translate-x-1/2 -translate-y-1/2 w-20 h-28 md:w-32 md:h-40 bg-white rounded-lg shadow-lg flex items-center justify-center border-2 border-purple-200"
              variants={fadeIn}
              custom={3}
            >
              <Shield className="text-purple-500" size={32} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Our blockchain-powered platform ensures tamper-proof document verification
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="bg-blue-50 rounded-xl p-8 border border-blue-100">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-4">
                  <FileCheck size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Document Issuance</h3>
                <p className="text-gray-600">
                  Issuers create and digitally sign documents which are then hashed and stored on the blockchain using Merkle trees for efficiency.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-purple-50 rounded-xl p-8 border border-purple-100">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mb-4">
                  <Database size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Blockchain Anchoring</h3>
                <p className="text-gray-600">
                  Document fingerprints are securely anchored on the Solana blockchain, creating an immutable record of their existence and authenticity.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-teal-50 rounded-xl p-8 border border-teal-100">
                <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 mb-4">
                  <Shield size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Tamper-Proof Verification</h3>
                <p className="text-gray-600">
                  Verifiers can instantly check document authenticity by comparing cryptographic proofs against the blockchain record.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Key Features</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              TrustChain Vault provides powerful tools for secure document management
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Key className="mr-2 text-blue-500" size={20} />
                Multi-Signature Security
              </h3>
              <p className="text-gray-600">
                Advanced cryptographic protections ensure documents can only be issued, verified, or invalidated by authorized parties.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <FileX className="mr-2 text-blue-500" size={20} />
                Document Invalidation
              </h3>
              <p className="text-gray-600">
                Issuers can invalidate documents when necessary, with all changes recorded permanently on the blockchain.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Database className="mr-2 text-blue-500" size={20} />
                Batch Processing
              </h3>
              <p className="text-gray-600">
                Efficient Merkle tree implementation allows for batched document processing, reducing costs and improving throughput.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Shield className="mr-2 text-blue-500" size={20} />
                Tamper-Proof Verification
              </h3>
              <p className="text-gray-600">
                Document authenticity can be verified by anyone without requiring access to the original issuer's systems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white">Ready to get started?</h2>
          <p className="mt-4 text-xl text-blue-100 max-w-3xl mx-auto">
            Join the future of secure document verification today
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <Link 
              to="/issuer/register" 
              className="px-6 py-3 rounded-lg bg-white text-blue-600 font-medium shadow-lg hover:bg-blue-50 transition-colors duration-200"
            >
              Register as Issuer
            </Link>
            <Link 
              to="/verify" 
              className="px-6 py-3 rounded-lg bg-transparent text-white font-medium border border-white hover:bg-white/10 transition-colors duration-200"
            >
              Verify a Document
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;