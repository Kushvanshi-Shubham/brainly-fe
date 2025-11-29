import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Input } from "../../components/ui/Input";
import { BACKEND_URL } from "../../config";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Button } from "../../components/ui/button.tsx";

function isPasswordStrong(password: string) {
  return (
    password.length >= 8 &&
    /\d/.test(password) &&
    /[a-zA-Z]/.test(password) &&
    /[^a-zA-Z0-9]/.test(password) &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password)
  );
}

export function SignUp() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/feed", { replace: true });
    }
  }, [navigate]);

  async function handleSignup(event: React.FormEvent) {
    event.preventDefault();

    const username = usernameRef.current?.value.trim();
    const email = emailRef.current?.value.trim();
    const password = passwordRef.current?.value.trim();
    const confirmPassword = confirmPasswordRef.current?.value.trim();

    if (!username || !email || !password || !confirmPassword) {
      toast.error("All fields are required.");
      return;
    }

    if (username.length < 3) {
      toast.error("Username must be at least 3 characters.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (!isPasswordStrong(password)) {
      toast.error(
        "Password must be at least 8 characters, with letters & numbers."
      );
      return;
    }

    setLoading(true);
    try {
      await axios.post(BACKEND_URL + "/api/v1/signup", {
        username,
        email,
        password,
      });

      toast.success("Signed up successfully! Please log in.");
      navigate("/login");
    } catch (e) {
      if (axios.isAxiosError(e)) {
        if (e.response) {
          // Backend returned an error response
          const message = e.response.data?.message || "Signup failed";
          toast.error(message);
        } else if (e.request) {
          // Request was made but no response (backend down)
          toast.error("Cannot connect to server. Please ensure the backend is running.");
        } else {
          toast.error("An unexpected error occurred.");
        }
      } else {
        toast.error("Network error. Please check your internet connection.");
      }
      console.error("Signup error:", e);
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
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.h2
          className="text-3xl font-extrabold mb-8 text-center text-purple-700 dark:text-purple-400"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Sign up for Brainly
        </motion.h2>

        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <Input ref={usernameRef} placeholder="Username" type="text" />
          </div>
          <div className="mb-4">
            <Input ref={emailRef} placeholder="Email" type="email" />
          </div>
          <div className="mb-4">
            <Input
              ref={passwordRef}
              placeholder="Password"
              type={showPassword ? "text" : "password"}
            />
          </div>
          <div className="mb-2">
            <Input
              ref={confirmPasswordRef}
              placeholder="Confirm Password"
              type={showPassword ? "text" : "password"}
            />
          </div>

          <div className="flex items-center mb-4 ml-1">
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

          <motion.p
            className="text-sm text-gray-600 dark:text-gray-400 mt-1 mb-6 ml-1 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Password must be at least 8 characters long and include letters and
            numbers.
          </motion.p>

          <div className="pt-2">
            <Button
              variant="primary"
              loading={loading}
              text={loading ? "Submitting..." : "Sign Up"}
              size="md"
              fullWidth={true}
              type="submit"
              disabled={loading}
            />
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-3 text-center">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-purple-600 dark:text-purple-400 underline hover:text-purple-800 dark:hover:text-purple-300 transition-colors duration-200"
              >
                Sign In
              </Link>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
