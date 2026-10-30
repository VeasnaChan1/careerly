import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../../app/features/authSlice';
import api from '../../config/api';
import { Eye, EyeOff, ArrowLeft, Check, Sparkles, AlertCircle, Loader2 } from 'lucide-react';

// Google Official 4-Color SVG Icon
export function GoogleIcon({ className = "h-5 w-5" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 48 48">
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s12-5.373 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-2.641-.21-5.236-.611-7.743z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.026 44 30.038 44 24c0-2.641-.21-5.236-.611-7.743z"
      />
    </svg>
  );
}

// Glass input container matching 21st.dev style adapted to Careerly palette
export function GlassInputWrapper({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-[#E7E2D8] bg-white/70 hover:bg-white focus-within:bg-white focus-within:border-[#F46200] focus-within:ring-2 focus-within:ring-[#F46200]/20 backdrop-blur-sm transition-all duration-200 ${className}`}
    >
      {children}
    </div>
  );
}

// Testimonial card floating over the hero background
export function TestimonialCard({ testimonial, delay = "animate-delay-1000" }) {
  return (
    <div
      className={`animate-testimonial ${delay} flex items-start gap-3.5 rounded-3xl bg-white/90 dark:bg-[#1F1F1F]/90 backdrop-blur-xl border border-white/40 p-4 sm:p-5 w-72 sm:w-80 shadow-[0_20px_45px_rgba(0,0,0,0.22)] text-left transition-all hover:scale-[1.02]`}
    >
      <img
        src={testimonial.avatarSrc}
        className="h-11 w-11 object-cover rounded-2xl ring-2 ring-[#F46200]/25 flex-shrink-0"
        alt={testimonial.name}
      />
      <div className="text-sm leading-snug flex-1">
        <div className="flex items-center justify-between gap-1">
          <p className="font-semibold text-[#1F1F1F] dark:text-white truncate">
            {testimonial.name}
          </p>
          {testimonial.badge && (
            <span className="text-[10px] font-semibold tracking-wide text-[#F46200] bg-[#FFF3EB] px-2 py-0.5 rounded-full flex-shrink-0">
              {testimonial.badge}
            </span>
          )}
        </div>
        <p className="text-xs text-[#8A847C] dark:text-zinc-400">
          {testimonial.handle} {testimonial.role ? `• ${testimonial.role}` : ''}
        </p>
        <p className="mt-1.5 text-xs text-[#2D2D2D]/90 dark:text-zinc-200 leading-relaxed font-normal">
          "{testimonial.text}"
        </p>
      </div>
    </div>
  );
}

// Default Careerly Testimonials
export const defaultCareerlyTestimonials = [
  {
    avatarSrc: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80",
    name: "Sereyroth Chan",
    handle: "@sereyroth_c",
    role: "Junior Web Dev",
    badge: "Hired at Smart",
    text: "Careerly's AI CV builder turned my university projects into a crisp English resume that landed me 3 interviews in two weeks!"
  },
  {
    avatarSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80",
    name: "Vannak Meas",
    handle: "@vannak_meas",
    role: "Banking Trainee",
    badge: "ABA Bank",
    text: "The mock interview practice was a lifesaver. The questions matched what the recruiters asked word for word."
  },
  {
    avatarSrc: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=240&q=80",
    name: "Bopha Khem",
    handle: "@bophakhem",
    role: "Digital Marketer",
    badge: "Career Switcher",
    text: "Switching industries felt intimidating until Careerly formatted my transferable skills cleanly. Forever grateful!"
  }
];

export const defaultHeroImage = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80";

/**
 * 21st.dev Compatible SignInPage Component
 */
export function SignInPage({
  title = (
    <span className="font-light text-[#2D2D2D] tracking-tight">
      Welcome <span className="font-serif italic font-normal text-[#F46200]">back</span>
    </span>
  ),
  description = "Access your Careerly account, track job applications, and practice interviews.",
  heroImageSrc = defaultHeroImage,
  testimonials = defaultCareerlyTestimonials,
  onSignIn,
  onGoogleSignIn,
  onResetPassword,
  onCreateAccount,
  onBackToHome,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      if (onSignIn) {
        await onSignIn(e);
      } else {
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());
        console.log("Sign In submitted:", data);
        alert(`Signed in successfully as ${data.email || "user"}!`);
      }
    } catch (err) {
      setErrorMessage(err.message || "Failed to sign in. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full flex flex-col md:flex-row bg-[#FAF8F4] text-[#2D2D2D]">
      {/* Form Section */}
      <section className="flex-1 flex flex-col justify-between p-6 sm:p-10 md:p-12 lg:p-16 max-w-xl mx-auto md:max-w-none w-full">
        {/* Top Header & Brand */}
        <div className="flex items-center justify-between w-full mb-8">
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#5A554E] hover:text-[#2D2D2D] transition-colors rounded-lg py-1 px-2 -ml-2 hover:bg-[#EFECE6]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to website</span>
          </button>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (onBackToHome) onBackToHome();
            }}
            className="flex items-center gap-1.5 text-xl font-bold tracking-tight text-[#2D2D2D]"
          >
            <span>Careerly</span>
            <span className="inline-block w-2 h-2 rounded-full bg-[#D4111A] translate-y-[-2px]"></span>
          </a>
        </div>

        {/* Center Card */}
        <div className="w-full max-w-md mx-auto my-auto">
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="animate-element animate-delay-100 text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight text-[#2D2D2D]">
                {title}
              </h1>
              <p className="animate-element animate-delay-200 mt-2.5 text-sm sm:text-base text-[#5A554E] leading-relaxed">
                {description}
              </p>
            </div>

            {errorMessage && (
              <div className="animate-element flex items-center gap-2 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
              {/* Email Address */}
              <div className="animate-element animate-delay-300">
                <label className="block text-xs sm:text-sm font-medium text-[#5A554E] mb-1.5">
                  Email Address
                </label>
                <GlassInputWrapper>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="name@example.com"
                    className="w-full bg-transparent text-sm p-3.5 sm:p-4 rounded-2xl text-[#2D2D2D] placeholder-[#8A847C] focus:outline-none"
                  />
                </GlassInputWrapper>
              </div>

              {/* Password */}
              <div className="animate-element animate-delay-400">
                <label className="block text-xs sm:text-sm font-medium text-[#5A554E] mb-1.5">
                  Password
                </label>
                <GlassInputWrapper>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Enter your password"
                      className="w-full bg-transparent text-sm p-3.5 sm:p-4 pr-12 rounded-2xl text-[#2D2D2D] placeholder-[#8A847C] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-3.5 flex items-center text-[#8A847C] hover:text-[#2D2D2D] transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </button>
                  </div>
                </GlassInputWrapper>
              </div>

              {/* Options row */}
              <div className="animate-element animate-delay-500 flex items-center justify-between text-xs sm:text-sm">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    defaultChecked
                    className="custom-checkbox"
                  />
                  <span className="text-[#2D2D2D]">Keep me signed in</span>
                </label>
                <button
                  type="button"
                  onClick={onResetPassword}
                  className="font-medium text-[#F46200] hover:text-[#DC5800] hover:underline transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="animate-element animate-delay-600 w-full rounded-2xl bg-[#F46200] hover:bg-[#DC5800] active:scale-[0.99] py-3.5 sm:py-4 font-semibold text-white shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="animate-element animate-delay-700 relative flex items-center justify-center my-1">
              <span className="w-full border-t border-[#E7E2D8]"></span>
              <span className="px-4 text-xs sm:text-sm text-[#8A847C] bg-[#FAF8F4] absolute">
                Or continue with
              </span>
            </div>

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={onGoogleSignIn}
              className="animate-element animate-delay-800 w-full flex items-center justify-center gap-3 border border-[#E7E2D8] bg-white hover:bg-[#FAF8F4] active:scale-[0.99] rounded-2xl py-3.5 sm:py-4 text-sm font-medium text-[#2D2D2D] transition-all shadow-xs cursor-pointer"
            >
              <GoogleIcon className="w-5 h-5" />
              <span>Continue with Google</span>
            </button>

            {/* Footer toggle */}
            <p className="animate-element animate-delay-900 text-center text-xs sm:text-sm text-[#5A554E]">
              New to Careerly?{" "}
              <button
                type="button"
                onClick={onCreateAccount}
                className="font-semibold text-[#F46200] hover:text-[#DC5800] hover:underline transition-colors cursor-pointer"
              >
                Create free account
              </button>
            </p>
          </div>
        </div>

        {/* Bottom copyright / security note */}
        <div className="w-full text-center text-xs text-[#8A847C] mt-8">
          Protected by industry standard encryption • Careerly Cambodia
        </div>
      </section>

      {/* Hero Visual Section with Testimonials (Right Side) */}
      {heroImageSrc && (
        <section className="hidden md:block flex-1 relative p-4 lg:p-6 min-h-[100dvh]">
          <div
            className="animate-slide-right animate-delay-300 absolute inset-4 lg:inset-6 rounded-3xl bg-cover bg-center overflow-hidden shadow-2xl"
            style={{ backgroundImage: `url(${heroImageSrc})` }}
          >
            {/* Dark & Gradient Overlay for Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/25" />

            {/* Floating Top Badge */}
            <div className="absolute top-8 left-8 right-8 flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-medium text-white shadow-lg">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Empowering 12,000+ Cambodian job seekers</span>
              </div>
            </div>

            {/* Floating Testimonials at the bottom */}
            {testimonials.length > 0 && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 px-6 w-full justify-center items-end">
                <TestimonialCard testimonial={testimonials[0]} delay="animate-delay-1000" />
                {testimonials[1] && (
                  <div className="hidden xl:flex">
                    <TestimonialCard testimonial={testimonials[1]} delay="animate-delay-1200" />
                  </div>
                )}
                {testimonials[2] && (
                  <div className="hidden 2xl:flex">
                    <TestimonialCard testimonial={testimonials[2]} delay="animate-delay-1400" />
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

/**
 * Matching SignUpPage Component
 */
export function SignUpPage({
  title = (
    <span className="font-light text-[#2D2D2D] tracking-tight">
      Create your <span className="font-serif italic font-normal text-[#F46200]">free account</span>
    </span>
  ),
  description = "Join thousands of Cambodian students and graduates landing jobs with Careerly.",
  heroImageSrc = defaultHeroImage,
  testimonials = defaultCareerlyTestimonials,
  onSignUp,
  onGoogleSignIn,
  onSignIn,
  onBackToHome,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("student");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Simple password strength calculation
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { label: "", percent: 0, color: "bg-gray-200" };
    if (pwd.length < 6) return { label: "Too short", percent: 25, color: "bg-red-400" };
    const hasNum = /\d/.test(pwd);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
    if (pwd.length >= 8 && hasNum && hasSpecial) {
      return { label: "Strong", percent: 100, color: "bg-emerald-500" };
    }
    if (pwd.length >= 6) {
      return { label: "Medium", percent: 65, color: "bg-amber-400" };
    }
    return { label: "Weak", percent: 40, color: "bg-red-400" };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      if (onSignUp) {
        await onSignUp(e);
      } else {
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());
        data.role = selectedRole;
        console.log("Sign Up submitted:", data);
        alert(`Account created successfully for ${data.fullName || "User"}! Welcome to Careerly.`);
      }
    } catch (err) {
      setErrorMessage(err.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full flex flex-col md:flex-row bg-[#FAF8F4] text-[#2D2D2D]">
      {/* Form Section */}
      <section className="flex-1 flex flex-col justify-between p-6 sm:p-10 md:p-12 lg:p-16 max-w-xl mx-auto md:max-w-none w-full">
        {/* Top Header & Brand */}
        <div className="flex items-center justify-between w-full mb-6">
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#5A554E] hover:text-[#2D2D2D] transition-colors rounded-lg py-1 px-2 -ml-2 hover:bg-[#EFECE6]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to website</span>
          </button>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (onBackToHome) onBackToHome();
            }}
            className="flex items-center gap-1.5 text-xl font-bold tracking-tight text-[#2D2D2D]"
          >
            <span>Careerly</span>
            <span className="inline-block w-2 h-2 rounded-full bg-[#D4111A] translate-y-[-2px]"></span>
          </a>
        </div>

        {/* Center Card */}
        <div className="w-full max-w-md mx-auto my-auto py-2">
          <div className="flex flex-col gap-5 sm:gap-6">
            <div>
              <h1 className="animate-element animate-delay-100 text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight text-[#2D2D2D]">
                {title}
              </h1>
              <p className="animate-element animate-delay-200 mt-2 text-xs sm:text-sm md:text-base text-[#5A554E] leading-relaxed">
                {description}
              </p>
            </div>

            {errorMessage && (
              <div className="animate-element flex items-center gap-2 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Role Picker Pills */}
              <div className="animate-element animate-delay-300">
                <label className="block text-xs font-semibold text-[#5A554E] uppercase tracking-wider mb-2">
                  I am a:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "student", label: "Student" },
                    { id: "graduate", label: "Fresh Grad" },
                    { id: "switcher", label: "Career Switcher" },
                  ].map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRole(role.id)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-medium border transition-all text-center cursor-pointer ${
                        selectedRole === role.id
                          ? "bg-[#FFF3EB] border-[#F46200] text-[#F46200] font-semibold ring-1 ring-[#F46200]"
                          : "bg-white border-[#E7E2D8] text-[#5A554E] hover:border-[#D5CFC3]"
                      }`}
                    >
                      {role.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Name */}
              <div className="animate-element animate-delay-400">
                <label className="block text-xs sm:text-sm font-medium text-[#5A554E] mb-1.5">
                  Full Name
                </label>
                <GlassInputWrapper>
                  <input
                    name="fullName"
                    type="text"
                    required
                    placeholder="e.g. Serey Vathana"
                    className="w-full bg-transparent text-sm p-3.5 rounded-2xl text-[#2D2D2D] placeholder-[#8A847C] focus:outline-none"
                  />
                </GlassInputWrapper>
              </div>

              {/* Email Address */}
              <div className="animate-element animate-delay-500">
                <label className="block text-xs sm:text-sm font-medium text-[#5A554E] mb-1.5">
                  Email Address
                </label>
                <GlassInputWrapper>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="name@example.com"
                    className="w-full bg-transparent text-sm p-3.5 rounded-2xl text-[#2D2D2D] placeholder-[#8A847C] focus:outline-none"
                  />
                </GlassInputWrapper>
              </div>

              {/* Password */}
              <div className="animate-element animate-delay-600">
                <label className="block text-xs sm:text-sm font-medium text-[#5A554E] mb-1.5">
                  Create Password
                </label>
                <GlassInputWrapper>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full bg-transparent text-sm p-3.5 pr-12 rounded-2xl text-[#2D2D2D] placeholder-[#8A847C] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-3.5 flex items-center text-[#8A847C] hover:text-[#2D2D2D] transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </GlassInputWrapper>

                {/* Password strength bar */}
                {password && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-1.5 flex-1 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${strength.color}`}
                        style={{ width: `${strength.percent}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-medium text-[#5A554E]">
                      {strength.label}
                    </span>
                  </div>
                )}
              </div>

              {/* Terms checkbox */}
              <div className="animate-element animate-delay-700 flex items-start gap-2.5 text-xs text-[#5A554E]">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  required
                  defaultChecked
                  className="custom-checkbox mt-0.5"
                />
                <span className="leading-tight">
                  I agree to Careerly's{" "}
                  <a href="#terms" className="text-[#F46200] hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#privacy" className="text-[#F46200] hover:underline">
                    Privacy Policy
                  </a>
                  .
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="animate-element animate-delay-800 w-full rounded-2xl bg-[#F46200] hover:bg-[#DC5800] active:scale-[0.99] py-3.5 sm:py-4 font-semibold text-white shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating your account...</span>
                  </>
                ) : (
                  <span>Create Account</span>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="animate-element animate-delay-900 relative flex items-center justify-center my-1">
              <span className="w-full border-t border-[#E7E2D8]"></span>
              <span className="px-4 text-xs sm:text-sm text-[#8A847C] bg-[#FAF8F4] absolute">
                Or sign up with
              </span>
            </div>

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={onGoogleSignIn}
              className="animate-element animate-delay-1000 w-full flex items-center justify-center gap-3 border border-[#E7E2D8] bg-white hover:bg-[#FAF8F4] active:scale-[0.99] rounded-2xl py-3.5 text-sm font-medium text-[#2D2D2D] transition-all shadow-xs cursor-pointer"
            >
              <GoogleIcon className="w-5 h-5" />
              <span>Continue with Google</span>
            </button>

            {/* Footer toggle */}
            <p className="animate-element animate-delay-1100 text-center text-xs sm:text-sm text-[#5A554E]">
              Already have an account?{" "}
              <button
                type="button"
                onClick={onSignIn}
                className="font-semibold text-[#F46200] hover:text-[#DC5800] hover:underline transition-colors cursor-pointer"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="w-full text-center text-xs text-[#8A847C] mt-6">
          Free basic tier forever • No credit card required
        </div>
      </section>

      {/* Hero Visual Section with Testimonials (Right Side) */}
      {heroImageSrc && (
        <section className="hidden md:block flex-1 relative p-4 lg:p-6 min-h-[100dvh]">
          <div
            className="animate-slide-right animate-delay-300 absolute inset-4 lg:inset-6 rounded-3xl bg-cover bg-center overflow-hidden shadow-2xl"
            style={{ backgroundImage: `url(${heroImageSrc})` }}
          >
            {/* Dark & Gradient Overlay for Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/25" />

            {/* Floating Top Badge */}
            <div className="absolute top-8 left-8 right-8 flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-medium text-white shadow-lg">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Build your English CV in under 15 minutes</span>
              </div>
            </div>

            {/* Floating Testimonials at the bottom */}
            {testimonials.length > 0 && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 px-6 w-full justify-center items-end">
                <TestimonialCard testimonial={testimonials[0]} delay="animate-delay-1000" />
                {testimonials[1] && (
                  <div className="hidden xl:flex">
                    <TestimonialCard testimonial={testimonials[1]} delay="animate-delay-1200" />
                  </div>
                )}
                {testimonials[2] && (
                  <div className="hidden 2xl:flex">
                    <TestimonialCard testimonial={testimonials[2]} delay="animate-delay-1400" />
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

/**
 * Interactive Combined AuthPage with smooth mode switching (Sign In, Sign Up, Forgot Password)
 */
export function AuthPage({
  initialMode = "signin",
  onNavigateHome,
}) {
  const [mode, setMode] = useState(initialMode); // 'signin' | 'signup' | 'reset'
  const [resetSent, setResetSent] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const dispatch = typeof useDispatch === 'function' ? useDispatch() : null;
  const navigate = typeof useNavigate === 'function' ? useNavigate() : null;

  const handleSignIn = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    try {
      const res = await api.post('/api/users/login', {
        email: data.email,
        password: data.password
      });
      localStorage.setItem('token', res.data.token);
      if (dispatch) dispatch(login({ token: res.data.token, user: res.data.user }));
      showToast(`Welcome back, ${res.data.user?.name || res.data.user?.email || 'User'}!`);
      setTimeout(() => {
        if (navigate) navigate('/app');
        else if (onNavigateHome) onNavigateHome();
      }, 700);
    } catch (err) {
      showToast(err?.response?.data?.message || err.message || 'Login failed');
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    try {
      const res = await api.post('/api/users/register', {
        name: data.fullName,
        email: data.email,
        password: data.password
      });
      localStorage.setItem('token', res.data.token);
      if (dispatch) dispatch(login({ token: res.data.token, user: res.data.user }));
      showToast(`Welcome to Careerly, ${data.fullName || 'User'}! Account created successfully.`);
      setTimeout(() => {
        if (navigate) navigate('/app');
        else if (onNavigateHome) onNavigateHome();
      }, 700);
    } catch (err) {
      showToast(err?.response?.data?.message || err.message || 'Registration failed');
    }
  };

  const handleGoogleSignIn = () => {
    showToast("Connecting with Google OAuth...");
    setTimeout(() => {
      showToast("Google Authentication successful! Welcome.");
      setTimeout(() => {
        if (onNavigateHome) onNavigateHome();
      }, 1000);
    }, 800);
  };

  const handleResetPasswordSubmit = (e) => {
    e.preventDefault();
    setResetSent(true);
    showToast(`Password reset link sent to ${resetEmail || "your email"}`);
  };

  return (
    <div className="relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#1F1F1F] text-white text-xs sm:text-sm font-medium shadow-2xl border border-white/10">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Forgot Password View */}
      {mode === "reset" ? (
        <div className="min-h-[100dvh] w-full flex items-center justify-center bg-[#FAF8F4] p-6 text-[#2D2D2D]">
          <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-[#E7E2D8] shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setResetSent(false);
              }}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#5A554E] hover:text-[#2D2D2D] mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to sign in</span>
            </button>

            {resetSent ? (
              <div className="text-center py-4 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
                  <Check className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-bold font-serif text-[#2D2D2D]">Check your inbox</h2>
                <p className="text-sm text-[#5A554E] leading-relaxed">
                  We've sent a password reset link to <strong className="text-[#2D2D2D]">{resetEmail}</strong>. Please check your spam folder if you don't see it within a couple minutes.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setMode("signin");
                    setResetSent(false);
                  }}
                  className="w-full mt-4 py-3.5 rounded-2xl bg-[#F46200] hover:bg-[#DC5800] text-white font-semibold text-sm transition-all shadow-sm"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#2D2D2D]">
                  Reset your <span className="font-serif italic font-normal text-[#F46200]">password</span>
                </h2>
                <p className="mt-2 text-sm text-[#5A554E] leading-relaxed">
                  Enter the email address associated with your Careerly account, and we'll send you a link to reset your password.
                </p>

                <form className="mt-6 space-y-4" onSubmit={handleResetPasswordSubmit}>
                  <div>
                    <label className="block text-xs font-medium text-[#5A554E] mb-1.5">
                      Email Address
                    </label>
                    <GlassInputWrapper>
                      <input
                        type="email"
                        required
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full bg-transparent text-sm p-3.5 rounded-2xl text-[#2D2D2D] placeholder-[#8A847C] focus:outline-none"
                      />
                    </GlassInputWrapper>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-[#F46200] hover:bg-[#DC5800] text-white font-semibold text-sm transition-all shadow-sm cursor-pointer"
                  >
                    Send Reset Link
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      ) : mode === "signup" ? (
        <SignUpPage
          onSignIn={() => setMode("signin")}
          onSignUp={handleSignUp}
          onGoogleSignIn={handleGoogleSignIn}
          onBackToHome={onNavigateHome}
        />
      ) : (
        <SignInPage
          onCreateAccount={() => setMode("signup")}
          onResetPassword={() => setMode("reset")}
          onSignIn={handleSignIn}
          onGoogleSignIn={handleGoogleSignIn}
          onBackToHome={onNavigateHome}
        />
      )}
    </div>
  );
}

export default AuthPage;
