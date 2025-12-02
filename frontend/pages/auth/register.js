import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { register } from '../../store/slices/authSlice';
import { toast } from 'react-toastify';

export default function Register() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isLoading } = useSelector(state => state.auth);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      await dispatch(register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'student'
      })).unwrap();
      
      toast.success('Registration successful!');
      router.push('/student/dashboard');
    } catch (error) {
      toast.error(error || 'Registration failed');
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
            Create your account
          </h2>
        </div>
        
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="label">Full Name</label>
              <input
                type="text"
                required
                className="input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
              />
            </div>

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
                minLength={6}
                className="input"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="label">Confirm Password</label>
              <input
                type="password"
                required
                className="input"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn btn-primary"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link href="/auth/login" className="w-full btn btn-outline block text-center">
                Sign in instead
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
