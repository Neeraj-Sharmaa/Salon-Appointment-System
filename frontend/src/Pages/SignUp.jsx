import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, Eye, EyeOff, Sparkles, Sun, Moon, User, Scissors, Briefcase } from "lucide-react";
import API_BASE_URL from "../config/api";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user"); // user, professional, admin
  const [specialization, setSpecialization] = useState("");
  const [experience, setExperience] = useState("");
  const [darkMode, setDarkMode] = useState(true); // Default to Dark mode for luxury look
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // OTP Verification States
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(0);

  // Handle countdown timer for OTP resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Password Strength State
  const [passwordStrength, setPasswordStrength] = useState(0); // 0 to 4
  const [strengthLabel, setStrengthLabel] = useState("");

  // Simulated Google Sign Up state
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState("");
  const [customGoogleName, setCustomGoogleName] = useState("");
  const [isAddingGoogleAccount, setIsAddingGoogleAccount] = useState(false);

  const { signup, googleSignIn } = useAuth();
  const navigate = useNavigate();

  // Calculate Password Strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      setStrengthLabel("");
      return;
    }

    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    // Cap strength at 4 max for visual simplicity
    const finalStrength = Math.min(strength, 4);
    setPasswordStrength(finalStrength);

    const labels = ["Very Weak", "Weak", "Medium", "Strong", "Excellent"];
    setStrengthLabel(labels[finalStrength]);
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!otpSent) {
      // Step 1: Send OTP
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, name }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to send verification code");
        }
        setOtpSent(true);
        setCountdown(60);
      } catch (err) {
        setError(err.message || "Something went wrong sending verification code.");
      } finally {
        setLoading(false);
      }
    } else {
      // Step 2: Verify & Sign Up
      if (!otp || otp.length !== 6) {
        setError("Please enter a valid 6-digit verification code.");
        return;
      }
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 800));

        const signupData = {
          name,
          email,
          password,
          role,
          specialization: role === "professional" ? specialization : undefined,
          experience: role === "professional" ? Number(experience) : undefined,
          otp,
        };

        const user = await signup(signupData);
        
        if (user.role === "admin") {
          navigate("/dashboard-admin");
        } else if (user.role === "professional") {
          navigate("/dashboard-professional");
        } else {
          navigate("/dashboard-user");
        }
      } catch (err) {
        setError(err.message || "Something went wrong during sign up.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to resend code");
      }
      setCountdown(60);
      setOtp("");
    } catch (err) {
      setError(err.message || "Failed to resend verification code.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    setShowGoogleModal(true);
  };

  const handleSimulatedGoogleSignUp = async (profile) => {
    setError("");
    setLoading(true);
    setShowGoogleModal(false);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const user = await googleSignIn({
        isMock: true,
        profile: {
          email: profile.email,
          name: profile.name,
          avatar: profile.avatar,
          googleId: profile.googleId,
        },
        role,
        specialization: role === "professional" ? specialization : undefined,
        experience: role === "professional" ? Number(experience) : undefined,
      });

      if (user.role === "admin") {
        navigate("/dashboard-admin");
      } else if (user.role === "professional") {
        navigate("/dashboard-professional");
      } else {
        navigate("/dashboard-user");
      }
    } catch (err) {
      setError(err.message || "Failed to sign up with Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex font-sans transition-colors duration-500 overflow-hidden relative ${
      darkMode ? "bg-[#08070b] text-[#f3f4f6]" : "bg-[#FAF8F5] text-[#2d2d2d]"
    }`}>
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');
        .font-luxury-serif { font-family: 'Playfair Display', serif; }
        .font-luxury-brand { font-family: 'Cinzel', serif; }
        .font-luxury-body { font-family: 'Montserrat', sans-serif; }
        
        /* Floating particles animation */
        @keyframes float-particle {
          0% { transform: translateY(0px) translateX(0px) scale(1); opacity: 0.2; }
          50% { transform: translateY(-80px) translateX(15px) scale(1.2); opacity: 0.6; }
          100% { transform: translateY(-160px) translateX(-5px) scale(0.8); opacity: 0; }
        }
        
        .floating-particle {
          position: absolute;
          border-radius: 50%;
          background: #C88E81;
          pointer-events: none;
          filter: blur(1px);
        }
        
        /* Gradient Border Glow animation */
        @keyframes shine {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .shine-button {
          background-size: 200% auto;
          animation: shine 3s linear infinite;
        }
      `}</style>

      {/* Floating Background Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(12)].map((_, i) => {
          const size = Math.random() * 6 + 4;
          const left = Math.random() * 100;
          const bottom = Math.random() * 50;
          const delay = Math.random() * 5;
          const duration = Math.random() * 6 + 8;
          return (
            <div
              key={i}
              className="floating-particle"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${left}%`,
                bottom: `${bottom}%`,
                animation: `float-particle ${duration}s ease-in-out ${delay}s infinite`,
              }}
            />
          );
        })}
      </div>

      {/* Toggle Theme Control (Floating top right) */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`absolute top-6 right-6 z-50 p-3 rounded-full border transition-all duration-300 ${
          darkMode
            ? "bg-[#141219]/80 border-gray-800 text-yellow-500 hover:text-white"
            : "bg-white/90 border-[#EBE5DA] text-indigo-900 hover:bg-[#FDFBF7]"
        }`}
        aria-label="Toggle Theme"
      >
        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      {/* SPLIT SCREEN LAYOUT */}

      {/* LEFT PANEL: Cinematic Image & Branding */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-black select-none">
        {/* Cinematic Salon Background */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[12s] scale-105 hover:scale-100"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1200&q=90')`,
          }}
        />
        {/* Soft Luxury Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/75 to-transparent" />
        
        {/* Subtle Brand Border Glow */}
        <div className="absolute bottom-12 left-12 right-12 h-[1px] bg-gradient-to-r from-transparent via-[#C88E81]/50 to-transparent"></div>

        {/* Content Container */}
        <div className="relative z-10 w-full h-full flex flex-col justify-between p-16">
          {/* Logo Section */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full border border-[#C88E81] flex items-center justify-center bg-black/40">
              <Sparkles size={14} className="text-[#C88E81]" />
            </div>
            <span className="text-xl font-bold tracking-[0.25em] text-white font-luxury-brand">
              ELEGANCE
            </span>
          </div>

          {/* Slogan details */}
          <div className="max-w-md space-y-6 mb-12">
            <h1 className="text-5xl font-light text-white tracking-tight leading-tight font-luxury-serif">
              Where Beauty <br />
              <span className="font-semibold text-[#C88E81] italic">Meets Excellence</span>
            </h1>
            <p className="text-gray-300 leading-relaxed font-luxury-body text-sm font-light">
              Experience luxury beauty services crafted to enhance your confidence and style. Step into our world of wellness.
            </p>
          </div>

          {/* Footer of Left Panel */}
          <div className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-medium font-luxury-body">
            &copy; Elegance Salon &bull; Est. 2026
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Authentication Form */}
      <div className={`w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-16 relative z-10 font-luxury-body ${
        darkMode ? "bg-[#0b0a0f]" : "bg-[#FDFBF7]"
      }`}>
        
        {/* Decorative Ambient Aura behind card */}
        <div className="absolute w-[300px] h-[300px] rounded-full bg-[#C88E81]/10 blur-[80px] pointer-events-none top-[25%] right-[25%] z-0" />

        <div className={`w-full max-w-md p-8 sm:p-10 rounded-[2rem] border transition-all duration-300 relative z-10 backdrop-blur-xl ${
          darkMode 
            ? "bg-[#131118]/80 border-white/5 shadow-2xl" 
            : "bg-white/60 border-[#F2EDE4]/60 shadow-[0_20px_50px_rgba(200,142,129,0.08)]"
        }`}>
          {/* Logo on Mobile */}
          <div className="flex lg:hidden items-center justify-center gap-2 mb-6">
            <span className="text-xl font-bold tracking-[0.2em] text-[#C88E81] font-luxury-brand">
              ELEGANCE
            </span>
          </div>

          <div className="mb-6">
            <h2 className={`text-3xl font-extrabold tracking-tight font-luxury-serif ${
              darkMode ? "text-white" : "text-[#2d2d2d]"
            }`}>
              Create Account
            </h2>
            <p className={`text-xs mt-2 font-medium ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}>
              Join us to book services and customize your style experience.
            </p>
          </div>

          {error && (
            <div className="bg-red-950/60 border border-red-500/30 px-4 py-3 rounded-xl mb-6 text-center text-xs text-red-300 animate-fadeIn">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {!otpSent ? (
              <>
                {/* Role Selection Slider */}
                <div>
                  <label className={`block text-[10px] tracking-widest font-bold uppercase mb-2 ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Identify Your Role
                  </label>
                  <div className={`p-1 rounded-xl border flex relative ${
                    darkMode ? "bg-[#18161e] border-gray-800" : "bg-[#FAF8F5] border-[#EBE5DA]"
                  }`}>
                    <button
                      type="button"
                      onClick={() => setRole("user")}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg text-center transition-all duration-300 relative z-10 cursor-pointer ${
                        role === "user" 
                          ? "text-white" 
                          : darkMode ? "text-gray-500 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Client
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("professional")}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg text-center transition-all duration-300 relative z-10 cursor-pointer ${
                        role === "professional" 
                          ? "text-white" 
                          : darkMode ? "text-gray-500 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Stylist
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("admin")}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg text-center transition-all duration-300 relative z-10 cursor-pointer ${
                        role === "admin" 
                          ? "text-white" 
                          : darkMode ? "text-gray-500 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Admin
                    </button>
                    {/* Sliding Indicator */}
                    <div
                      className="absolute top-1 bottom-1 bg-[#C88E81] rounded-lg transition-all duration-300 ease-out"
                      style={{
                        left: role === "user" ? "4px" : role === "professional" ? "34.5%" : "67.5%",
                        width: "31%",
                      }}
                    ></div>
                  </div>
                </div>

                {/* Full Name */}
                <div className="space-y-1">
                  <label className={`block text-[10px] tracking-widest font-bold uppercase ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Full Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                      <User size={16} />
                    </span>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full rounded-xl pl-10 pr-4 py-3.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#C88E81] transition duration-300 ${
                        darkMode
                          ? "bg-[#18161e] border-gray-800 text-white placeholder-gray-600 focus:border-[#C88E81]"
                          : "bg-[#FAF8F5] border-[#EBE5DA] text-gray-800 placeholder-gray-400 focus:border-[#C88E81]"
                      }`}
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className={`block text-[10px] tracking-widest font-bold uppercase ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                      <Mail size={16} />
                    </span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full rounded-xl pl-10 pr-4 py-3.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#C88E81] transition duration-300 ${
                        darkMode
                          ? "bg-[#18161e] border-gray-800 text-white placeholder-gray-600 focus:border-[#C88E81]"
                          : "bg-[#FAF8F5] border-[#EBE5DA] text-gray-800 placeholder-gray-400 focus:border-[#C88E81]"
                      }`}
                      placeholder="name@domain.com"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label className={`block text-[10px] tracking-widest font-bold uppercase ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                      <Lock size={16} />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full rounded-xl pl-10 pr-10 py-3.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#C88E81] transition duration-300 ${
                        darkMode
                          ? "bg-[#18161e] border-gray-800 text-white placeholder-gray-600 focus:border-[#C88E81]"
                          : "bg-[#FAF8F5] border-[#EBE5DA] text-gray-800 placeholder-gray-400 focus:border-[#C88E81]"
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-gray-300 transition cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {password && (
                    <div className="space-y-1.5 pt-1.5 animate-fadeIn">
                      <div className="flex justify-between items-center text-[10px] font-bold">
                        <span className={darkMode ? "text-gray-400" : "text-gray-500"}>Strength</span>
                        <span
                          style={{
                            color:
                              passwordStrength <= 1
                                ? "#EF4444"
                                : passwordStrength === 2
                                ? "#F59E0B"
                                : "#10B981",
                          }}
                        >
                          {strengthLabel}
                        </span>
                      </div>
                      <div className={`h-[4px] w-full rounded-full flex gap-1 ${
                        darkMode ? "bg-gray-800" : "bg-gray-200"
                      }`}>
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className="h-full flex-1 rounded-full transition-all duration-300"
                            style={{
                              backgroundColor:
                                i < passwordStrength
                                  ? passwordStrength <= 1
                                    ? "#EF4444"
                                    : passwordStrength === 2
                                    ? "#F59E0B"
                                    : "#10B981"
                                  : "transparent",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Stylist Details (Dynamic) */}
                {role === "professional" && (
                  <div className="space-y-4 pt-3 border-t border-gray-800/40 animate-fadeIn">
                    <div className="space-y-1">
                      <label className={`block text-[10px] tracking-widest font-bold uppercase ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}>
                        Specialty Focus
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                          <Scissors size={16} />
                        </span>
                        <select
                          required={role === "professional"}
                          value={specialization}
                          onChange={(e) => setSpecialization(e.target.value)}
                          className={`w-full rounded-xl pl-10 pr-4 py-3.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#C88E81] transition duration-300 ${
                            darkMode
                              ? "bg-[#18161e] border-gray-800 text-white focus:border-[#C88E81]"
                              : "bg-[#FAF8F5] border-[#EBE5DA] text-gray-800 focus:border-[#C88E81]"
                          }`}
                        >
                          <option value="" className="bg-[#0b0a0f]">Select Specialty...</option>
                          <option value="Hair Styling" className="bg-[#0b0a0f]">Hair Styling</option>
                          <option value="Hair Coloring" className="bg-[#0b0a0f]">Hair Coloring</option>
                          <option value="Spa Treatment" className="bg-[#0b0a0f]">Spa Treatment</option>
                          <option value="Bridal Makeup" className="bg-[#0b0a0f]">Bridal Makeup</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className={`block text-[10px] tracking-widest font-bold uppercase ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}>
                        Experience (Years)
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                          <Briefcase size={16} />
                        </span>
                        <input
                          type="number"
                          required={role === "professional"}
                          min="0"
                          value={experience}
                          onChange={(e) => setExperience(e.target.value)}
                          className={`w-full rounded-xl pl-10 pr-4 py-3.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#C88E81] transition duration-300 ${
                            darkMode
                              ? "bg-[#18161e] border-gray-800 text-white placeholder-gray-600 focus:border-[#C88E81]"
                              : "bg-[#FAF8F5] border-[#EBE5DA] text-gray-800 placeholder-gray-400 focus:border-[#C88E81]"
                          }`}
                          placeholder="e.g. 5"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-4 animate-fadeIn">
                <div className="text-center py-2">
                  <div className={`text-xs ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                    We have sent a 6-digit verification code to
                  </div>
                  <div className={`text-sm font-bold mt-1 ${darkMode ? "text-[#C88E81]" : "text-[#b87669]"}`}>
                    {email}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className={`block text-[10px] tracking-widest font-bold uppercase ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Verification Code
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                      <Lock size={16} />
                    </span>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      className={`w-full rounded-xl pl-10 pr-4 py-3.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#C88E81] tracking-[0.5em] text-center transition duration-300 ${
                        darkMode
                          ? "bg-[#18161e] border-gray-800 text-white placeholder-gray-600 focus:border-[#C88E81]"
                          : "bg-[#FAF8F5] border-[#EBE5DA] text-gray-800 placeholder-gray-400 focus:border-[#C88E81]"
                      }`}
                      placeholder="••••••"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className={`font-semibold hover:underline flex items-center gap-1 transition ${
                      darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    ← Edit Info
                  </button>

                  <div>
                    {countdown > 0 ? (
                      <span className={darkMode ? "text-gray-500" : "text-gray-400"}>
                        Resend in {countdown}s
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="font-bold text-[#C88E81] hover:text-[#d69f93] transition underline decoration-[#C88E81]/30 hover:decoration-[#C88E81]"
                      >
                        Resend Code
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Signup Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-[#C88E81] to-[#d69f93] hover:from-[#d69f93] hover:to-[#C88E81] transition duration-300 cursor-pointer shadow-lg hover:shadow-[#C88E81]/25 hover:shadow-xl text-xs uppercase tracking-wider relative overflow-hidden flex items-center justify-center gap-2 shine-button"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {otpSent ? "Verifying..." : "Sending Code..."}
                  </>
                ) : (
                  otpSent ? "Verify & Create Account" : "Send Verification Code"
                )}
              </button>
            </div>

            {/* Divider and Google Sign In */}
            {!otpSent && (
              <>
                <div className="relative flex items-center justify-center my-2 text-[10px] tracking-wider uppercase font-bold text-gray-500">
                  <div className="flex-grow border-t border-gray-800/40"></div>
                  <span className="px-3">or continue with</span>
                  <div className="flex-grow border-t border-gray-800/40"></div>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={handleGoogleSignUp}
                    className={`w-full py-3 px-4 rounded-xl border font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:scale-[1.01] transition duration-300 cursor-pointer ${
                      darkMode
                        ? "bg-[#18161e] border-gray-800 text-gray-300 hover:text-white"
                        : "bg-[#FAF8F5] border-[#EBE5DA] text-gray-600 hover:bg-[#FDFBF7]"
                    }`}
                  >
                    <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24">
                      <path
                        fill="#EA4335"
                        d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.213-5.23 4.213-3.555 0-6.437-2.882-6.437-6.437s2.882-6.437 6.437-6.437c1.554 0 2.973.553 4.088 1.472l3.15-3.15C19.117 1.83 15.894 1 12.24 1 5.922 1 1 5.922 1 12s4.922 11 11.24 11c5.96 0 10.96-4.29 10.96-11 0-.743-.075-1.423-.198-2.063H12.24Z"
                      />
                    </svg>
                    Sign Up with Google
                  </button>
                </div>
              </>
            )}
          </form>

          <div className="mt-6 text-center text-xs">
            <span className={darkMode ? "text-gray-400" : "text-gray-500"}>
              Already have an account?{" "}
            </span>
            <Link
              to="/login"
              className="font-bold text-[#C88E81] hover:text-[#d69f93] transition duration-200 underline decoration-[#C88E81]/30 hover:decoration-[#C88E81]"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Simulated Google OAuth Account Chooser Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className={`w-full max-w-sm p-6 rounded-[2rem] border shadow-2xl transition-all duration-300 ${
            darkMode 
              ? "bg-[#131118] border-white/5 text-white" 
              : "bg-white border-[#F2EDE4] text-gray-800"
          }`}>
            {/* Modal Header */}
            <div className="text-center mb-6 relative">
              <div className="flex justify-center mb-3">
                <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.213-5.23 4.213-3.555 0-6.437-2.882-6.437-6.437s2.882-6.437 6.437-6.437c1.554 0 2.973.553 4.088 1.472l3.15-3.15C19.117 1.83 15.894 1 12.24 1 5.922 1 1 5.922 1 12s4.922 11 11.24 11c5.96 0 10.96-4.29 10.96-11 0-.743-.075-1.423-.198-2.063H12.24Z"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-bold font-luxury-serif">Sign up with Google</h3>
              <p className={`text-xs mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                Choose an account to continue to Elegance
              </p>
              <button 
                onClick={() => {
                  setShowGoogleModal(false);
                  setIsAddingGoogleAccount(false);
                }}
                className="absolute top-0 right-0 p-1.5 rounded-full hover:bg-gray-800/20 text-gray-500 transition-colors text-lg"
              >
                &times;
              </button>
            </div>

            {/* Account List */}
            {!isAddingGoogleAccount ? (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => handleSimulatedGoogleSignUp({
                    email: "neerudevgan13@gmail.com",
                    name: "Neeru Devgan",
                    avatar: "",
                    googleId: "google_neeru_123"
                  })}
                  className={`w-full p-3 rounded-xl border flex items-center gap-3 transition duration-300 text-left hover:scale-[1.01] ${
                    darkMode 
                      ? "bg-[#18161e] border-gray-800 hover:bg-[#201d27] hover:border-gray-700" 
                      : "bg-[#FAF8F5] border-[#EBE5DA] hover:bg-[#FDFBF7]"
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-[#1a73e8] text-white flex items-center justify-center text-xs font-bold select-none shadow-sm">
                    N
                  </div>
                  <div className="flex-grow">
                    <div className="text-xs font-bold text-white">Neeru Devgan</div>
                    <div className="text-[10px] text-gray-500">neerudevgan13@gmail.com</div>
                  </div>
                  <span className="text-[10px] font-bold text-[#C88E81] uppercase tracking-wider">Default</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSimulatedGoogleSignUp({
                    email: "vikas@gmail.com",
                    name: "Vikas Sharma",
                    avatar: "",
                    googleId: "google_vikas_456"
                  })}
                  className={`w-full p-3 rounded-xl border flex items-center gap-3 transition duration-300 text-left hover:scale-[1.01] ${
                    darkMode 
                      ? "bg-[#18161e] border-gray-800 hover:bg-[#201d27] hover:border-gray-700" 
                      : "bg-[#FAF8F5] border-[#EBE5DA] hover:bg-[#FDFBF7]"
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-[#7c4dff] text-white flex items-center justify-center text-xs font-bold select-none shadow-sm">
                    V
                  </div>
                  <div className="flex-grow">
                    <div className="text-xs font-bold text-white">Vikas Sharma</div>
                    <div className="text-[10px] text-gray-500">vikas@gmail.com</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setIsAddingGoogleAccount(true)}
                  className={`w-full p-3.5 rounded-xl border border-dashed flex items-center justify-center gap-2 transition duration-300 text-xs font-bold ${
                    darkMode 
                      ? "border-gray-850 text-gray-400 hover:border-gray-700 hover:text-white" 
                      : "border-gray-300 text-gray-600 hover:border-gray-400"
                  }`}
                >
                  <span>+</span> Use another custom account
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-[10px] tracking-widest font-bold uppercase text-gray-400">Email Address</label>
                  <input
                    type="email"
                    required
                    value={customGoogleEmail}
                    onChange={(e) => setCustomGoogleEmail(e.target.value)}
                    className={`w-full rounded-xl px-4 py-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#C88E81] transition duration-300 ${
                      darkMode
                        ? "bg-[#18161e] border-gray-800 text-white placeholder-gray-600 focus:border-[#C88E81]"
                        : "bg-[#FAF8F5] border-[#EBE5DA] text-gray-800 focus:border-[#C88E81]"
                    }`}
                    placeholder="example@gmail.com"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] tracking-widest font-bold uppercase text-gray-400">Full Name</label>
                  <input
                    type="text"
                    required
                    value={customGoogleName}
                    onChange={(e) => setCustomGoogleName(e.target.value)}
                    className={`w-full rounded-xl px-4 py-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#C88E81] transition duration-300 ${
                      darkMode
                        ? "bg-[#18161e] border-gray-800 text-white placeholder-gray-600 focus:border-[#C88E81]"
                        : "bg-[#FAF8F5] border-[#EBE5DA] text-gray-800 focus:border-[#C88E81]"
                    }`}
                    placeholder="Your Name"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingGoogleAccount(false)}
                    className={`flex-grow py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition ${
                      darkMode 
                        ? "bg-[#18161e] border-gray-800 text-gray-400 hover:text-white" 
                        : "bg-[#FAF8F5] border-[#EBE5DA] text-gray-600"
                    }`}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!customGoogleEmail || !customGoogleName) {
                        alert("Please fill in both fields.");
                        return;
                      }
                      handleSimulatedGoogleSignUp({
                        email: customGoogleEmail,
                        name: customGoogleName,
                        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(customGoogleName)}&background=C88E81&color=fff`,
                        googleId: "google_custom_" + Date.now()
                      });
                    }}
                    className="flex-grow py-3 rounded-xl bg-[#C88E81] text-white hover:bg-[#d69f93] transition text-xs font-bold uppercase tracking-wider"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;
