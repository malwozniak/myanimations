import { motion } from 'framer-motion';
import * as React from 'react';

const PageWrapper = ({ children }) => {
  const transition = {
    duration: 0.4,
    ease: 'easeInOut',
  };

  const variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      transition={transition}
    >
      {children}
    </motion.div>
  );
};

export default PageWrapper;
