import { Lock, Mail, User2Icon, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../app/features/authSlice.js';
import toast from 'react-hot-toast';
import api from '../config/api.js';

export const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const query = new URLSearchParams(window.location.search);
  const urlState = query.get('state');
  const [state, setState] = useState(urlState || 'login');
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await api.post(`/api/users/${state}`, formData);
      dispatch(login(data));
      localStorage.setItem('token', data.token);
      toast.success(data.message);
      navigate('/app');
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FAF8F4] p-4 relative">
      <div className="absolute top-12 left-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2.5 text-sm font-semibold text-[#5A554E] hover:text-[#2D2D2D] transition-colors group"
        >
          <ArrowLeft className="size-4.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to Home
        </Link>
      </div>
      <form
        onSubmit={handleSubmit}
        className="sm:w-[380px] w-full text-center border border-[#E7E2D8] rounded-2xl px-8 py-8 bg-white shadow-sm"
      >
        <div className="flex items-center justify-center gap-1.5 mb-4">
          <span className="font-sans font-extrabold text-2xl tracking-tight text-[#2D2D2D]">
            Careerly
          </span>
          <span className="inline-block w-2 h-2 rounded-full bg-[#F46200]" aria-hidden="true"></span>
        </div>

        <h1 className="text-[#2D2D2D] text-2xl font-bold">
          {state === 'login' ? 'Welcome back' : 'Create account'}
        </h1>
        <p className="text-[#8A847C] text-sm mt-1.5">
          {state === 'login' ? 'Sign in to access your saved CVs' : 'Join Careerly to save and manage your CVs'}
        </p>

        <div className="mt-6 space-y-3.5">
          {state !== 'login' && (
            <div className="flex items-center w-full bg-white border border-[#E7E2D8] focus-within:border-[#F46200] h-12 rounded-full overflow-hidden px-4 gap-2.5 transition-all">
              <User2Icon size={16} className="text-[#8A847C]" />
              <input
                type="text"
                name="name"
                placeholder="Full name"
                className="w-full text-sm text-[#2D2D2D] placeholder-[#A09A90] border-none outline-none ring-0 bg-transparent"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="flex items-center w-full bg-white border border-[#E7E2D8] focus-within:border-[#F46200] h-12 rounded-full overflow-hidden px-4 gap-2.5 transition-all">
            <Mail size={16} className="text-[#8A847C]" />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              className="w-full text-sm text-[#2D2D2D] placeholder-[#A09A90] border-none outline-none ring-0 bg-transparent"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex items-center w-full bg-white border border-[#E7E2D8] focus-within:border-[#F46200] h-12 rounded-full overflow-hidden px-4 gap-2.5 transition-all">
            <Lock size={16} className="text-[#8A847C]" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              className="w-full text-sm text-[#2D2D2D] placeholder-[#A09A90] border-none outline-none ring-0 bg-transparent flex-1 min-w-0"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-[#8A847C] hover:text-[#2D2D2D] focus:outline-none transition-colors ml-1 cursor-pointer"
            >
              {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 w-full h-11 rounded-full text-white bg-[#F46200] hover:bg-[#DC5800] font-semibold text-sm shadow-xs active:scale-[0.99] transition-all cursor-pointer"
        >
          {state === 'login' ? 'Log in' : 'Create account'}
        </button>

        <p
          onClick={() => setState((prev) => (prev === 'login' ? 'register' : 'login'))}
          className="text-[#8A847C] text-sm mt-5 cursor-pointer hover:text-[#5A554E] transition-colors"
        >
          {state === 'login' ? "Don't have an account?" : 'Already have an account?'}
          <span className="text-[#F46200] hover:text-[#DC5800] hover:underline font-semibold ml-1.5">
            {state === 'login' ? 'Sign up' : 'Log in'}
          </span>
        </p>
      </form>
    </div>
  );
};
