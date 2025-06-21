import { useRef, useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/Input";
import { BACKEND_URL } from "../../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export function Login() {
  const usernameRef = useRef<HTMLInputElement>();
  const passwordRef = useRef<HTMLInputElement>();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  async function login() {
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

    if (!username || !password) {
      alert("Please enter both username and password");
      return;
    }

    try {
      const response = await axios.post(BACKEND_URL + "/api/v1/login", {
        username,
        password,
      });

      const jwt = response.data.token;
      localStorage.setItem("token", jwt);
      navigate("/dashboard");
    } catch (error) {
      alert("Invalid credentials or server error.");
    }
  }

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-gray-200">
      <motion.div
        className="border p-10 rounded-xl bg-white shadow-md w-full max-w-md"
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-purple-700">
          Login to Brainly
        </h2>

        <Input reference={usernameRef} placeholder="Username" />
        <Input
          reference={passwordRef}
          placeholder="Password"
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

        <div className="pt-4">
          <Button
            variant="primary"
            onClick={login}
            loading={false}
            text="Log In"
            size="md"
            fullWidth={true}
          />
        </div>
      </motion.div>
    </div>
  );
}
