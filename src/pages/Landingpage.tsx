import { LandingNavbar, Footer, IconMarquee } from "../Landing";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "../utlis/cn";
import {
  UserGroupIcon,
  LinkIcon,
  FolderIcon,
  BookmarkIcon,
  TagIcon,
  MagnifyingGlassIcon,
  DevicePhoneMobileIcon,
  LockClosedIcon,
  SparklesIcon,
  CloudArrowUpIcon,
  Squares2X2Icon,
  GlobeAltIcon,
  StarIcon,
  ArrowDownIcon,
  PlayCircleIcon,
  PaintBrushIcon,
  CodeBracketIcon,
  MicrophoneIcon
} from '@heroicons/react/24/outline';

export function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/feed", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <LandingNavbar />
      
      {/* Enhanced Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-purple-50/30 to-pink-50/30 dark:from-gray-950 dark:via-purple-950/20 dark:to-pink-950/20">
        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{ duration: 8, repeat: Infinity, delay: 1 }}
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="inline-block mb-6 animate-float">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-purple-500/50">
                <SparklesIcon className="w-14 h-14 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Welcome to <span className="gradient-text">Brainly</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-4 max-w-3xl mx-auto">
              Organize your links, share ideas, and build your digital brain.
            </p>
            <p className="text-lg text-gray-500 dark:text-gray-500 mb-12">
              Never lose a thought again.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => navigate("/signup")}
                className={cn(
                  "px-8 py-4 rounded-2xl font-semibold text-lg",
                  "bg-gradient-to-r from-purple-600 to-pink-600",
                  "hover:from-purple-700 hover:to-pink-700",
                  "text-white shadow-lg shadow-purple-500/30",
                  "hover:shadow-xl hover:shadow-purple-500/40",
                  "transition-all duration-200",
                  "active:scale-95"
                )}
              >
                Get Started Free
              </button>
              <button
                className={cn(
                  "px-8 py-4 rounded-2xl font-semibold text-lg",
                  "bg-white dark:bg-gray-800",
                  "border-2 border-gray-200 dark:border-gray-700",
                  "text-gray-900 dark:text-white",
                  "hover:border-purple-500 dark:hover:border-purple-500",
                  "transition-all duration-200",
                  "active:scale-95",
                  "flex items-center gap-2"
                )}
              >
                <PlayCircleIcon className="w-6 h-6" />
                Watch Demo
              </button>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ArrowDownIcon className="w-6 h-6 text-gray-400" />
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white dark:bg-gray-950 border-y border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { number: "50K+", label: "Active Users", icon: UserGroupIcon },
              { number: "2M+", label: "Links Saved", icon: LinkIcon },
              { number: "100K+", label: "Collections Created", icon: FolderIcon }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className={cn(
                  "text-center p-8 rounded-2xl",
                  "bg-gradient-to-br from-purple-50 to-pink-50",
                  "dark:from-purple-900/10 dark:to-pink-900/10",
                  "border border-purple-200/50 dark:border-purple-800/30"
                )}
              >
                <stat.icon className="w-12 h-12 mx-auto mb-3 text-purple-600 dark:text-purple-400" />
                <div className="text-4xl font-bold gradient-text mb-2">{stat.number}</div>
                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-purple-50/30 dark:from-gray-900 dark:to-purple-950/20">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything you need to <span className="gradient-text">stay organized</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              A central hub for your digital life.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: BookmarkIcon,
                title: "Save Anything",
                description: "Bookmark links, articles, videos, and more from across the web with one click."
              },
              {
                icon: TagIcon,
                title: "Smart Tags",
                description: "Organize content with powerful tagging system for instant search and discovery."
              },
              {
                icon: FolderIcon,
                title: "Collections",
                description: "Group related content into beautiful collections you can share with anyone."
              },
              {
                icon: MagnifyingGlassIcon,
                title: "Share & Discover",
                description: "Explore what others are saving and share your curated collections publicly."
              },
              {
                icon: DevicePhoneMobileIcon,
                title: "Cross-Platform",
                description: "Access your brain from anywhere - web, mobile, and browser extensions."
              },
              {
                icon: LockClosedIcon,
                title: "Private & Secure",
                description: "Your data is encrypted and secure. Choose what to share and what to keep private."
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4, scale: 1.02 }}
                className={cn(
                  "p-6 rounded-2xl",
                  "bg-white dark:bg-gray-800/90",
                  "border border-gray-200/50 dark:border-gray-700/50",
                  "shadow-lg hover:shadow-xl",
                  "transition-all duration-300",
                  "group"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl mb-4",
                  "bg-gradient-to-br from-purple-100 to-pink-100",
                  "dark:from-purple-900/30 dark:to-pink-900/30",
                  "flex items-center justify-center",
                  "group-hover:scale-110 transition-transform duration-300"
                )}>
                  <feature.icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Start building your digital brain in 4 simple steps
            </p>
          </motion.div>

          <div className="relative">
            {/* Connecting line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 hidden lg:block" style={{ top: '60px' }} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
              {[
                {
                  step: "01",
                  title: "Sign Up",
                  description: "Create your free account in seconds",
                  icon: SparklesIcon
                },
                {
                  step: "02",
                  title: "Save Content",
                  description: "Add links, notes, and ideas easily",
                  icon: CloudArrowUpIcon
                },
                {
                  step: "03",
                  title: "Organize",
                  description: "Tag and group into collections",
                  icon: Squares2X2Icon
                },
                {
                  step: "04",
                  title: "Share & Discover",
                  description: "Connect with others and explore",
                  icon: GlobeAltIcon
                }
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className={cn(
                    "w-24 h-24 mx-auto mb-4 rounded-full",
                    "bg-gradient-to-br from-purple-500 to-pink-500",
                    "flex items-center justify-center text-white",
                    "shadow-lg shadow-purple-500/30"
                  )}>
                    <item.icon className="w-12 h-12" />
                  </div>
                  <div className="text-sm font-bold text-purple-600 dark:text-purple-400 mb-2">
                    STEP {item.step}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/10 dark:to-pink-950/10">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Loved by <span className="gradient-text">knowledge workers</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              See what our users have to say
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah Chen",
                role: "Product Designer",
                content: "Brainly has completely changed how I organize my design inspiration. I can finally find that perfect reference when I need it!",
                avatar: PaintBrushIcon,
                rating: 5
              },
              {
                name: "Marcus Rodriguez",
                role: "Software Engineer",
                content: "As a developer, I save tons of code snippets and documentation. Brainly makes it so easy to categorize and retrieve everything.",
                avatar: CodeBracketIcon,
                rating: 5
              },
              {
                name: "Emily Taylor",
                role: "Content Creator",
                content: "The collections feature is perfect for content research. I can share curated resources with my team effortlessly.",
                avatar: MicrophoneIcon,
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className={cn(
                  "p-6 rounded-2xl",
                  "bg-white dark:bg-gray-800",
                  "border border-gray-200/50 dark:border-gray-700/50",
                  "shadow-lg"
                )}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <testimonial.avatar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations/Platforms */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Works with your <span className="gradient-text">favorite platforms</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Save content from anywhere on the web
            </p>
          </motion.div>

          <IconMarquee />
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600" />
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{ duration: 8, repeat: Infinity, delay: 1 }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to build your digital brain?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Join thousands of users who never lose track of important content
            </p>
            <button
              onClick={() => navigate("/signup")}
              className={cn(
                "px-8 py-4 rounded-2xl font-semibold text-lg",
                "bg-white text-purple-600",
                "hover:bg-gray-100",
                "shadow-lg shadow-black/20",
                "hover:shadow-xl",
                "transition-all duration-200",
                "active:scale-95"
              )}
            >
              Get Started - It's Free
            </button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
