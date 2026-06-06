import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-8xl font-black mb-4 gradient-text" style={{ fontFamily: 'Outfit, sans-serif' }}>404</p>
           <h1 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>
            Page Not Found
          </h1>
          <p className="mb-8 max-w-sm mx-auto" style={{ color: 'var(--text-secondary)' }}>
            The page you're looking for doesn't exist in the AUST-IPMS system. It may have been moved or is part of a future phase.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/" className="btn-primary" id="notfound-home-btn">
              <Home size={16} /> Back to Home
            </Link>
            <button onClick={() => window.history.back()} className="btn-secondary" id="notfound-back-btn">
              <ArrowLeft size={16} /> Go Back
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
