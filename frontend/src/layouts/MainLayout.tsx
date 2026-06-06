import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MainLayout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-base)' }}>
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, scale: 0.98, filter: 'blur(8px)', y: 12 }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', y: 0 }}
          exit={{ opacity: 0, scale: 0.98, filter: 'blur(8px)', y: -12 }}
          transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
          className="flex-1"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  );
}
