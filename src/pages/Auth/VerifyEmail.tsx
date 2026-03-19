import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { BACKEND_URL } from "../../config";
import { cn } from "../../utlis/cn";

export function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link.");
      return;
    }

    async function verify() {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/v1/auth/verify-email?token=${token}`);
        setStatus("success");
        setMessage(res.data.message);
      } catch (error) {
        setStatus("error");
        if (axios.isAxiosError(error) && error.response) {
          setMessage(error.response.data?.message || "Verification failed.");
        } else {
          setMessage("Cannot connect to server.");
        }
      }
    }

    verify();
  }, [token]);

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900">
      <motion.div
        className={cn(
          "glass border border-purple-200/50 dark:border-purple-800/30",
          "p-8 sm:p-10 rounded-2xl shadow-xl w-full max-w-md text-center"
        )}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {status === "loading" && (
          <>
            <div className="w-12 h-12 mx-auto mb-4 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
            <p className="text-gray-600 dark:text-gray-400">Verifying your email...</p>
          </>
        )}
        {status === "success" && (
          <>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2 gradient-text">Email Verified!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
            <Link to="/feed" className="font-semibold gradient-text hover:opacity-80">
              Go to Feed →
            </Link>
          </>
        )}
        {status === "error" && (
          <>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-red-600">Verification Failed</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
            <Link to="/login" className="font-semibold gradient-text hover:opacity-80">
              Go to Login
            </Link>
          </>
        )}
      </motion.div>
    </div>
  );
}
