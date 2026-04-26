import { motion } from "framer-motion";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  // Reset scroll on route change so new pages don't appear "stuck"
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};
