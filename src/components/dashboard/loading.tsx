"use client";

import { motion } from "framer-motion";

export function DashboardLoading() {
  return (
    <motion.div
      className="absolute inset-0 z-40 flex items-center justify-center bg-white/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative size-12">
          <div className="absolute inset-0 rounded-full border-4 border-nova-secondary/20"></div>
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-nova-secondary"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear",
            }}
          ></motion.div>
        </div>
        <p className="text-sm font-medium text-gray-600">Chargement...</p>
      </motion.div>
    </motion.div>
  );
}
