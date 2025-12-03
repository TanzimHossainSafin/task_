import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import api from '../../utils/api';
import { toast } from 'react-toastify';

export default function StudentDashboard() {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('courses');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    if (user?.role !== 'student') {
      router.push('/admin/dashboard');
      return;
    }
    fetchEnrollments();
  }, [isAuthenticated, user]);

  const fetchEnrollments = async () => {
    try {
      const { data } = await api.get('/enrollments/my');
      setEnrollments(data.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load enrollments');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              CourseMaster
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">Welcome, {user?.name}</span>
              <Link href="/" className="btn btn-outline">
                Browse Courses
              </Link>
              <button onClick={handleLogout} className="btn btn-primary">
                Logout
              </button>
            </div>
          </div>
        </nav>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Student Dashboard</h1>
          <p className="text-gray-600">Track your learning progress</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <h3 className="text-gray-600 mb-2">Enrolled Courses</h3>
            <p className="text-3xl font-bold text-primary">{enrollments.length}</p>
          </div>
          <div className="card">
            <h3 className="text-gray-600 mb-2">Average Progress</h3>
            <p className="text-3xl font-bold text-green-600">
              {enrollments.length > 0 
                ? Math.round(enrollments.reduce((sum, e) => sum + e.progress.completionPercentage, 0) / enrollments.length)
                : 0}%
            </p>
          </div>
          <div className="card">
            <h3 className="text-gray-600 mb-2">Completed Courses</h3>
            <p className="text-3xl font-bold text-blue-600">
              {enrollments.filter(e => e.progress.completionPercentage === 100).length}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-4 border-b">
            <button
              onClick={() => setActiveTab('courses')}
              className={`px-4 py-2 font-semibold ${
                activeTab === 'courses'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-600'
              }`}
            >
              My Courses
            </button>
          </div>
        </div>

        {/* Course List */}
        {enrollments.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-xl text-gray-600 mb-4">You haven't enrolled in any courses yet</p>
            <Link href="/" className="btn btn-primary">
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((enrollment) => (
              <div key={enrollment._id} className="card">
                <img
                  src={enrollment.course.thumbnail}
                  alt={enrollment.course.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <span className="inline-block bg-primary text-white text-xs px-2 py-1 rounded mb-2">
                  {enrollment.course.category}
                </span>
                <h3 className="text-xl font-bold mb-2">{enrollment.course.title}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  By {enrollment.course.instructor}
                </p>
                
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-semibold text-primary">
                      {Math.round(enrollment.progress.completionPercentage)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${enrollment.progress.completionPercentage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link 
                    href={`/courses/${enrollment.course._id}`}
                    className="btn btn-outline flex-1"
                  >
                    View Course
                  </Link>
                  <Link 
                    href={`/learn/${enrollment.course._id}`}
                    className="btn btn-primary flex-1"
                  >
                    Continue Learning
                  </Link>
                </div>

                <div className="mt-4 pt-4 border-t text-sm text-gray-600">
                  <p>Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString()}</p>
                  <p>Completed Lessons: {enrollment.progress.completedLessons?.length || 0}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
