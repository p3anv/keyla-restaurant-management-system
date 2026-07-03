import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLogin } from '@/hooks/queries/useAuth';
import { Link } from 'react-router-dom';

const LoginSchema = z.object({ email: z.string().email(), password: z.string().min(6) });

export const LoginForm = () => {
  const { mutate, isPending, error } = useLogin();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(LoginSchema) });
  const onSubmit = (data) => mutate(data);

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Restaurant Management System</h2>
      <p className="text-center text-gray-600 mb-6">Sign in to your account</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" {...register('email')} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" placeholder="waiter@restaurant.com" />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input type="password" {...register('password')} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" placeholder="••••••••" />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{(error as any)?.response?.data?.error?.message || 'Login failed'}</div>}
        <button type="submit" disabled={isPending} className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50">{isPending ? 'Signing in...' : 'Sign In'}</button>
      </form>
      <p className="text-center text-sm text-gray-600 mt-4">Don't have an account? <Link to="/register" className="text-primary-600 hover:underline">Register</Link></p>
    </div>
  );
};
