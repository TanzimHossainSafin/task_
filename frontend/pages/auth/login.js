import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { login } from '../../store/slices/authSlice';
import { toast } from 'react-toastify';

export default function Login() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isLoading } = useSelector(state => state.auth);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const result = await dispatch(login(formData)).unwrap();
      toast.success('Login successful!');
      
      if (result.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/student/dashboard');
      }
    } catch (error) {
      toast.error(error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-primary">
            CourseMaster
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                required
                className="input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="label">Password</label>
              <input
                type="password"
                required
                className="input"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn btn-primary"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Don't have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link href="/auth/register" className="w-full btn btn-outline block text-center">
                Create an account
              </Link>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded">
            <p className="text-sm font-semibold text-gray-700">Demo Accounts:</p>
            <p className="text-xs text-gray-600 mt-2">Admin: admin@coursemaster.com / Admin@123456</p>
            <p className="text-xs text-gray-600">Student: student@test.com / Student@123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
