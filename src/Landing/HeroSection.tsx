import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button.tsx";




export const HeroSection = () => (
  <main className="flex-1 flex flex-col items-center p-6 justify-center text-center px-4 sm:px-6 lg:px-8">
    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-800 dark:text-white leading-tight"
    >
      Welcome to <span className="text-purple-600 dark:text-purple-400">Braintox</span>
    </motion.h1>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="mt-4 text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-3xl leading-relaxed"
    >
      Organize your links, share ideas, and build your digital brain.
      <br className="hidden sm:inline" /> Never lose a thought again.
    </motion.p>
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.6, type: "spring", stiffness: 150 }}
      className="mt-8"
    >
      <Link to="/signup">
        <Button variant="primary" size="lg" text="Get Started" />
      </Link>
    </motion.div>
  </main>
);
