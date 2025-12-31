import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-blue-950 text-white flex flex-col items-center justify-center px-6">
      <motion.h1
        className="text-5xl md:text-7xl font-extrabold text-center mb-6 bg-gradient-to-br from-blue-300 to-blue-500 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        Sideline Trader
      </motion.h1>

      <motion.p
        className="text-lg md:text-2xl text-gray-300 text-center max-w-2xl mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.7 }}
      >
        A take on sports analytics through the use of prediction markets.
      </motion.p>


      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.7 }}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/app")}
          className="text-lg px-8 py-6 rounded-2xl shadow-lg bg-blue-600 hover:bg-blue-500 hover:shadow-blue-500/30 transition-all flex items-center gap-2 font-semibold focus:outline-none focus:ring-4 focus:ring-blue-400/50"
          aria-label="Enter the Sideline Trader app"
        >
          Enter App
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </motion.div>

      </div>
  );
}