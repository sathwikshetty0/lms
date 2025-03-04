"use client";

import { Variants, motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="flex min-h-dvh justify-center items-center">
      <BarLoader />
    </div>
  );
};

const variants = {
  initial: {
    scaleY: 0.5,
    opacity: 0,
  },
  animate: {
    scaleY: 1,
    opacity: 1,
    transition: {
      repeat: Infinity,
      repeatType: "mirror",
      duration: 0.5,
      ease: "circIn",
    },
  },
} as Variants;

const BarLoader = () => {
  return (
    <motion.div
      transition={{
        staggerChildren: 0.1,
      }}
      initial="initial"
      animate="animate"
      className="flex gap-1"
    >
      <motion.div variants={variants} className="h-12 w-2 bg-primary" />
      <motion.div variants={variants} className="h-12 w-2 bg-primary" />
      <motion.div variants={variants} className="h-12 w-2 bg-primary" />
      <motion.div variants={variants} className="h-12 w-2 bg-primary" />
      <motion.div variants={variants} className="h-12 w-2 bg-primary" />
    </motion.div>
  );
};

export default Loading;
