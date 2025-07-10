import { motion } from "framer-motion";
import { ArchiveIcon, ShareIcon, UserIcon } from "../Icons/IconsImport";


const features = [
  {
    Icon: ArchiveIcon,
    title: "Organize Your World",
    description: "Save articles, videos, and tweets in one centralized place. Never lose a valuable link or thought again."
  },
  {
    Icon: UserIcon,
    title: "Build Your Digital Brain",
    description: "Use tags and categories to create a flexible, searchable system for all your saved knowledge and resources."
  },
  {
    Icon: ShareIcon,
    title: "Share Your Knowledge",
    description: "Generate a unique, public link to share your curated collection of content with friends, colleagues, or the world."
  }
];

export const FeaturesSection = () => (
  <section className="w-full bg-gray-50 dark:bg-gray-900 py-20 px-4">
    <div className="max-w-5xl mx-auto text-center">
      <h2 className="text-3xl font-bold mb-4">What can you do with Brainly?</h2>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-12">A central hub for your digital life.</p>
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 dark:bg-purple-900/50 mx-auto mb-6">
              <feature.Icon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
