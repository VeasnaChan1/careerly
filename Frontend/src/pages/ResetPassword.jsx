import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { GlassInputWrapper } from '../components/ui/sign-in';
import api from '../config/api';

const inputClass = 'w-full bg-transparent p-3.5 text-sm rounded-2xl text-[#2D2D2D] focus:outline-none';

export default function ResetPassword({ verifyEmail = false }) {
  const { hash } = useLocation();
  const navigate = useNavigate();
  const token = new URLSearchParams(hash.slice(1)).get('token');
  const hasToken = /^[a-f0-9]{64}$/.test(token ?? '');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = form.get('password');
    if (password !== form.get('confirmation')) {
      setErrorMessage('Your passwords must match.');
      return;
    }

    setErrorMessage('');
    setIsSaving(true);
    try {
      const endpoint = verifyEmail ? 'verify-email' : 'reset-password';
      const { data } = await api.post(`/api/users/${endpoint}`, {
        token,
        password,
        name: verifyEmail ? form.get('fullName') : undefined,
      });
      toast.success(data.message);
      navigate('/login', { replace: true });
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Could not save your password. Try again.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="min-h-dvh flex items-center justify-center bg-[#FAF8F4] p-4 text-[#2D2D2D]">
      <section className="w-full max-w-md rounded-3xl border border-[#E7E2D8] bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold">{verifyEmail ? 'Finish creating your account' : 'Set a new password'}</h1>
        {hasToken ? (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <p className="text-sm text-[#5A554E]">Use at least 8 characters.</p>
            {verifyEmail && (
              <div>
                <label htmlFor="signup-name" className="mb-1.5 block text-sm font-medium">Full name</label>
                <GlassInputWrapper>
                  <input id="signup-name" name="fullName" autoComplete="name" maxLength={255}
                    required className={inputClass} />
                </GlassInputWrapper>
              </div>
            )}
            <div>
              <label htmlFor="new-password" className="mb-1.5 block text-sm font-medium">New password</label>
              <GlassInputWrapper>
                <input id="new-password" name="password" type="password" autoComplete="new-password"
                  minLength={8} required className={inputClass} />
              </GlassInputWrapper>
            </div>
            <div>
              <label htmlFor="confirm-password" className="mb-1.5 block text-sm font-medium">Confirm password</label>
              <GlassInputWrapper>
                <input id="confirm-password" name="confirmation" type="password" autoComplete="new-password"
                  required className={inputClass} />
              </GlassInputWrapper>
            </div>
            {errorMessage && <p role="alert" className="text-sm text-red-700">{errorMessage}</p>}
            <button type="submit" disabled={isSaving}
              className="w-full rounded-2xl bg-[#F46200] py-3.5 text-sm font-semibold text-white hover:bg-[#DC5800] disabled:opacity-70">
              {isSaving ? 'Saving…' : verifyEmail ? 'Verify email and create account' : 'Update password'}
            </button>
          </form>
        ) : (
          <p className="mt-3 text-sm text-[#5A554E]">
            {verifyEmail ? 'This verification link is invalid. Start signup again for a new link.' :
              'This reset link is invalid. Request a new link from the sign-in page.'}
          </p>
        )}
        {verifyEmail && (
          <Link to="/signup" className="mt-5 mr-4 inline-block text-sm font-semibold text-[#DC5800] hover:underline">
            Request a new link
          </Link>
        )}
        <Link to="/login" className="mt-5 inline-block text-sm font-semibold text-[#DC5800] hover:underline">
          Back to sign in
        </Link>
      </section>
    </main>
  );
}
