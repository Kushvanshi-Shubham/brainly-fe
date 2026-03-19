import { useRef, useState } from "react";
import { Input } from "../../components/ui/Input";
import { BACKEND_URL } from "../../config";
import axios from "axios";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Button } from "../../components/ui/button.tsx";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { cn } from "../../utlis/cn";

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (!token) {
    return (
      <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Invalid Reset Link</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">This password reset link is invalid or has expired.</p>
          <Link to="/forgot-password" className="font-semibold gradient-text hover:opacity-80">
            Request a new reset link
          </Link>
        </div>
      </div>
    );
  }

  async function handleReset(event: React.FormEvent) {
    event.preventDefault();

    const password = passwordRef.current?.value.trim();
    const confirmPassword = confirmPasswordRef.current?.value.trim();

    if (!password || !confirmPassword) {
      toast.error("Please fill in both fields.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (password.length < 12) {
      toast.error("Password must be at least 12 characters.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(BACKEND_URL + "/api/v1/auth/reset-password", {
        token,
        password,
      });
      toast.success("Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data?.message || "Reset failed. Please try again.");
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
          <h2 className="text-3xl font-bold mb-2 text-center gradient-text">
            Set New Password
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-center text-sm">
            Enter your new password below.
          </p>

          <form onSubmit={handleReset}>
            <div className="mb-4">
              <Input
                ref={passwordRef}
                placeholder="New Password"
                type={showPassword ? "text" : "password"}
              />
            </div>
            <div className="mb-2">
              <Input
                ref={confirmPasswordRef}
                placeholder="Confirm New Password"
                type={showPassword ? "text" : "password"}
              />
            </div>

            <div className="flex items-center mb-4">
              <input
                id="show-password-checkbox"
                type="checkbox"
                onChange={() => setShowPassword(!showPassword)}
                className="mr-2 h-4 w-4 text-purple-600 dark:text-purple-400 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
              />
              <label htmlFor="show-password-checkbox" className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer select-none">
                Show Password
              </label>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
              Password must be at least 12 characters with uppercase, lowercase, number, and special character.
            </p>

            <Button
              variant="primary"
              loading={loading}
              text={loading ? "Resetting..." : "Reset Password"}
              size="md"
              fullWidth={true}
              type="submit"
              disabled={loading}
            />
          </form>
        </motion.div>
      </div>
    </div>
  );
}
