import { motion } from "framer-motion";

export default function StatBar({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight: boolean;
}) {
  return (
    <div className="mb-3">
      <div className="flex justify-between mb-1 text-sm">
        <span className="font-semibold text-gray-200">{label}</span>
        <span className="font-mono text-gray-300">{value}</span>
      </div>

      <div className="w-full h-4 bg-gray-800 rounded overflow-hidden">
        <motion.div
          transition={{ type: "spring", stiffness: 110, damping: 15 }}
          animate={{ width: `${value}%` }}
          className={`h-full ${
            highlight
              ? "bg-gradient-to-r from-cyan-300 via-yellow-400 to-pink-400 shadow-lg"
              : "bg-gradient-to-r from-yellow-300 to-red-500"
          }`}
        />
      </div>
    </div>
  );
}
