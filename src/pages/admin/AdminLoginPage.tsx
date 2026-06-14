// ============================================================
// NEXORA — Admin Login Page
// ============================================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Shield, Eye, EyeOff } from 'lucide-react';
import { loginSchema, type LoginFormData } from '@/lib/validators';
import { useAuthStore } from '@/stores/authStore';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const login = useAuthStore((s) => s.login);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      toast.success('Welcome back');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Login failed. Please check your details.';
      toast.error(message);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(200,169,106,0.14),transparent_36%),linear-gradient(145deg,#050505,#0b0b0d_55%,#17171a)]" />
      <Link
        to="/"
        className="absolute left-5 top-5 z-10 inline-flex items-center gap-2 border border-[#202024] bg-[#0b0b0d]/75 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#b8b0a3] transition-colors hover:border-[#c8a96a]/50 hover:text-[#c8a96a]"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Storefront
      </Link>

      <div className="relative z-10 w-full max-w-md border border-[#202024] bg-[#0b0b0d]/82 p-6 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-8">
        <div className="text-center mb-9">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center border border-[#c8a96a]/25 bg-[#050505]">
            <img
              src="/assets/nexora-logo-ivory.png"
              alt="NEXORA"
              className="h-14 w-auto object-contain opacity-90"
            />
          </div>
          <h1 className="text-sm font-black tracking-[0.28em] uppercase text-[#f4f0e8]">NEXORA Admin</h1>
          <p className="mt-3 text-xs leading-6 text-[#8a8175]">Manage products, orders, inventory, limited drops, and campaigns from one command center.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="text-[10px] text-[#8a8175] uppercase tracking-[0.18em] mb-1.5 block">
              Email
            </label>
            <input
              {...register('email')}
              type="email"
              className="w-full bg-[#050505] border border-[#202024] px-4 py-3.5 text-sm text-[#f4f0e8] placeholder:text-[#6f675d] focus:outline-none focus:border-[#c8a96a] transition-colors"
              placeholder="admin@nexora.store"
            />
            {errors.email && (
              <p className="text-[10px] text-red-400 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="text-[10px] text-[#8a8175] uppercase tracking-[0.18em] mb-1.5 block">
              Password
            </label>
            <div className="relative">
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                className="w-full bg-[#050505] border border-[#202024] px-4 py-3.5 pr-10 text-sm text-[#f4f0e8] placeholder:text-[#6f675d] focus:outline-none focus:border-[#c8a96a] transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a8175] hover:text-[#c8a96a]"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-[10px] text-red-400 mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="nexora-button-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Shield className="w-4 h-4" />
            {isSubmitting ? 'Authenticating...' : 'Enter Dashboard'}
          </button>
        </form>

        <p className="text-center text-[10px] text-[#6f675d] mt-6 tracking-[0.18em] uppercase">
          Secure operations portal
        </p>
      </div>
    </div>
  );
}
