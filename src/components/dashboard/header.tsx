import { motion } from "framer-motion";

interface DashboardHeaderProps {
  currentPath: string;
}

export function DashboardHeader({ currentPath }: DashboardHeaderProps) {
  const formatPathName = (path: string) => {
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <motion.header
      className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-1 items-center justify-end gap-4 md:gap-8">
        <h1 className="text-xl font-semibold md:text-2xl">
          {formatPathName(currentPath)}
        </h1>
      </div>
    </motion.header>
  );
}
