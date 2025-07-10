import { motion } from "framer-motion";
import { TwitterIcon , YoutubeIcon, GithubIcon, DiscordIcon , SlackIcon} from "../Icons/IconsImport";


const icons = [
  { Icon: TwitterIcon, color: "text-blue-400" },
  { Icon: YoutubeIcon, color: "text-red-600" },
  { Icon: GithubIcon, color: "text-gray-800 dark:text-white" },
  { Icon: DiscordIcon, color: "text-indigo-500" },
  { Icon: SlackIcon, color: "text-pink-500" },
];

export const IconMarquee = () => (
  <div className="py-16 w-full max-w-4xl overflow-hidden relative mx-auto">
    <div className="absolute inset-0 bg-gradient-to-r from-white dark:from-gray-950 via-transparent to-white dark:to-gray-950 z-10"></div>
    <motion.div
      className="flex space-x-16"
      animate={{ x: ['0%', '-100%'] }}
      transition={{
        ease: 'linear',
        duration: 20,
        repeat: Infinity,
      }}
    >
      {[...icons, ...icons].map(({ Icon, color }, index) => (
        <Icon key={index} className={`w-12 h-12 flex-shrink-0 ${color}`} />
      ))}
    </motion.div>
  </div>
);
