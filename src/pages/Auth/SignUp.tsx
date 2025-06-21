import { useRef, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/Input";
import { BACKEND_URL } from "../../config";
import { useNavigate } from "react-router-dom";

export function SignUp() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  function isPasswordStrong(password: string) {
    return (
      password.length >= 8 &&
      /[0-9]/.test(password) &&
      /[a-zA-Z]/.test(password)
    );
  }

  async function signup() {
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;
    const confirmPassword = confirmPasswordRef.current?.value;

    if (!username || !password || !confirmPassword) {
      alert("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!isPasswordStrong(password)) {
      alert("Password must be at least 8 characters, include letters and numbers");
      return;
    }

    await axios.post(BACKEND_URL + "/api/v1/signup", {
      username,
      password,
    });

    alert("Signed Up");
    navigate("/login");
  }

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-gray-100">
      <motion.div
        className="border border-gray-300 p-10 rounded-xl bg-white shadow-md w-full max-w-md"
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.h2
          className="text-2xl font-bold mb-6 text-center text-purple-700"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Sign up for Brainly
        </motion.h2>

        <Input reference={usernameRef} placeholder="Username" />
        <Input
          reference={passwordRef}
          placeholder="Password"
          type={showPassword ? "text" : "password"}
        />
        <Input
          reference={confirmPasswordRef}
          placeholder="Confirm Password"
          type={showPassword ? "text" : "password"}
        />

        <div className="flex items-center mb-4 ml-2">
          <input
            type="checkbox"
            onChange={() => setShowPassword(!showPassword)}
            className="mr-2"
          />
          <label className="text-sm text-gray-600">Show Password</label>
        </div>

        <motion.p
          className="text-sm text-gray-500 mt-1 ml-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Password must be at least 8 characters long and include letters and numbers.
        </motion.p>

        <div className="pt-6">
          <Button
            variant="primary"
            onClick={signup}
            loading={false}
            text="Submit"
            size="md"
            fullWidth={true}
          />
        </div>
      </motion.div>
    </div>
  );
}
