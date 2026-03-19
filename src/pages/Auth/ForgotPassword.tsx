import { useRef, useState } from "react";
import { Input } from "../../components/ui/Input";
import { BACKEND_URL } from "../../config";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Button } from "../../components/ui/button.tsx";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { cn } from "../../utlis/cn";

export function ForgotPassword() {
  const emailRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const email = emailRef.current?.value.trim();
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(BACKEND_URL + "/api/v1/auth/forgot-password", { email });
      setSent(true);
      toast.success("Check your email for the reset link!");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data?.message || "Something went wrong.");
      } else {
        toast.error("Cannot connect to server. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 transition-colors duration-300">
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-purple-200/50 dark:border-purple-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              to="/login"
              className={cn(
                "flex items-center gap-2 text-gray-700 dark:text-gray-300",
                "hover:text-purple-600 dark:hover:text-purple-400",
                "transition-colors duration-200 font-medium"
              )}
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span>Back to Login</span>
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold gradient-text">Braintox</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex justify-center items-center min-h-screen pt-16 px-4">
        <motion.div
          className={cn(
            "glass border border-purple-200/50 dark:border-purple-800/30",
            "p-8 sm:p-10 rounded-2xl shadow-xl",
            "w-full max-w-md"
          )}
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-4 text-center gradient-text">
            Reset Password
          </h2>

          {sent ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                If an account with that email exists, we've sent a password reset link.
                Check your inbox (and spam folder).
              </p>
              <Link
                to="/login"
                className="font-semibold gradient-text hover:opacity-80 transition-opacity duration-200"
              >
                Return to Login
              </Link>
            </motion.div>
          ) : (
            <>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-center text-sm">
                Enter the email address associated with your account, and we'll send you a link to reset your password.
              </p>
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <Input ref={emailRef} placeholder="Email address" type="email" />
                </div>
                <Button
                  variant="primary"
                  loading={loading}
                  text={loading ? "Sending..." : "Send Reset Link"}
                  size="md"
                  fullWidth={true}
                  type="submit"
                  disabled={loading}
                />
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center">
                  Remember your password?{" "}
                  <Link
                    to="/login"
                    className="font-semibold gradient-text hover:opacity-80 transition-opacity duration-200"
                  >
                    Sign In
                  </Link>
                </div>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
