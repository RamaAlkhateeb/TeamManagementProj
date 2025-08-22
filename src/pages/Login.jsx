import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Lock, AlertCircle, Loader } from "lucide-react";
import { Input } from "../pages/input";
import { Button } from "../pages/button";
import Img1 from "../image/1.jpg";

export default function LoginPage() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const fieldErrors = {};
    if (!userName) fieldErrors.userName = "Username is required.";
    if (!password) fieldErrors.password = "Password is required.";

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://ramialzend.bsite.net/User/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userName, password }),
      });

      const text = await response.text();
      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error("Failed to parse server response.");
      }

      if (!response.ok || !data.isSuccess) {
        throw new Error(data.message || "Incorrect username or password.");
      }

      localStorage.setItem("token", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);
      navigate("/Dash");
    } catch (err) {
      setErrors({ general: err.message || "Login error occurred." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen px-4 flex items-center justify-center transition-colors duration-300 ${
        
      }`}
    >
      <motion.div
        className="flex flex-col md:flex-row w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl relative"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Side Image */}
        <div className="hidden md:block md:w-1/2 relative">
          <img
            src={Img1}
            alt="Login Visual"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/70 to-transparent" />
        </div>

        {/* Login Form */}
        <div
          className={`w-full md:w-1/2 p-8 sm:p-10 ${
            darkMode ? "bg-[#020617]/60 text-white" : "bg-white/90 text-black"
          } backdrop-blur-lg`}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-2 text-center">
            Welcome Back 👋
          </h2>
          <p className="text-white/70 dark:text-black/60 mb-6 text-sm text-center">
            Please log in to continue
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* General Error */}
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-sm bg-red-500/10 text-red-600 border border-red-400 px-4 py-2 rounded-md"
              >
                <AlertCircle size={16} /> {errors.general}
              </motion.div>
            )}

            {/* Username Field */}
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" />
              <Input
                type="text"
                placeholder="Username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="pl-10 py-3 bg-transparent border border-white/20 text-white placeholder-white/50 rounded-md focus:ring-2 focus:ring-blue-400/40 shadow-inner transition-all"
              />
              {errors.userName && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-1 text-sm text-red-400"
                >
                  {errors.userName}
                </motion.p>
              )}
            </div>

            {/* Password Field */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 py-3 bg-transparent border border-white/20 text-white placeholder-white/50 rounded-md focus:ring-2 focus:ring-blue-400/40 shadow-inner transition-all"
              />
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-1 text-sm text-red-400"
                >
                  {errors.password}
                </motion.p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center text-sm text-white/70">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="form-checkbox text-blue-500 bg-white/10 border-white/30 rounded"
                />
                <span>Remember me</span>
              </label>
            </div>

            {/* log In Button */}
            <motion.button
              type="submit"
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              disabled={loading}
              className={`w-full py-3 rounded-md transition-colors text-white font-semibold flex items-center justify-center gap-2 ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-500"
              }`}
            >
              {loading ? (
                <Loader className="animate-spin" size={18} />
              ) : (
                <>
                  <Lock size={18} /> Log In
                </>
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}


