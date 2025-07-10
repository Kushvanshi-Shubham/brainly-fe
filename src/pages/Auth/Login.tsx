import { useRef, useState } from "react";

import { Input } from "../../components/ui/Input";
import { BACKEND_URL } from "../../config";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Button } from "../../components/ui/button.tsx";

export function Login() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();

    const email = emailRef.current?.value.trim();
    const password = passwordRef.current?.value.trim();

    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(BACKEND_URL + "/api/v1/login", {
        username: email,
        password,
      });

      const jwt = response.data.token;
      localStorage.setItem("token", jwt);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 401 || error.response.status === 403) {
          toast.error("Invalid email or password.");
        } else {
          toast.error("An unexpected error occurred. Please try again later.");
        }
      } else {
        toast.error("Network error. Please check your internet connection.");
      }
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <motion.div
        className="border border-gray-200 dark:border-gray-700 p-8 sm:p-10 rounded-xl bg-white dark:bg-gray-800 shadow-lg w-full max-w-md mx-4"
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-extrabold mb-8 text-center text-purple-700 dark:text-purple-400">
          Login to Brainly
        </h2>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <Input ref={emailRef} placeholder="Email" type="email" />
          </div>
          <div className="mb-2">
            <Input
              ref={passwordRef}
              placeholder="Password"
              type={showPassword ? "text" : "password"}
            />
          </div>

          <div className="flex items-center mb-6 ml-1">
            <input
              id="show-password-checkbox"
              type="checkbox"
              onChange={() => setShowPassword(!showPassword)}
              className="mr-2 h-4 w-4 text-purple-600 dark:text-purple-400 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor="show-password-checkbox" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none">
              Show Password
            </label>
          </div>

          <div className="pt-2">
            <Button
              variant="primary"
              loading={loading}
              text={loading ? "Logging In..." : "Log In"}
              size="md"
              fullWidth={true}
              type="submit"
              disabled={loading}
            />
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-3 text-center">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-purple-600 dark:text-purple-400 underline hover:text-purple-800 dark:hover:text-purple-300 transition-colors duration-200"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
