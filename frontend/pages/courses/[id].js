import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import api from '../../utils/api';
import { toast } from 'react-toastify';

export default function CourseDetails() {
  const router = useRouter();
  const { id } = router.query;
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCourse();
      if (isAuthenticated && user?.role === 'student') {
        checkEnrollment();
      }
    }
  }, [id, isAuthenticated, user]);

  const fetchCourse = async () => {
    try {
      const { data } = await api.get(`/courses/${id}`);
      setCourse(data.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load course');
      setLoading(false);
    }
  };

  const checkEnrollment = async () => {
    try {
      await api.get(`/enrollments/${id}`);
      setIsEnrolled(true);
    } catch (error) {
      setIsEnrolled(false);
    }
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to enroll');
      router.push('/auth/login');
      return;
    }

    setEnrolling(true);
    try {
      await api.post(`/enrollments/${id}`);
      toast.success('Successfully enrolled in course!');
      setIsEnrolled(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to enroll');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading course...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">Course not found</p>
          <Link href="/" className="btn btn-primary">Go Home</Link>
        </div>
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
            <div className="flex gap-4">
              {isAuthenticated ? (
                <>
                  <Link href={user?.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} 
                    className="btn btn-outline">
                    Dashboard
                  </Link>
                  <button onClick={() => router.push('/')} className="btn btn-primary">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="btn btn-outline">
                    Login
                  </Link>
                  <Link href="/auth/register" className="btn btn-primary">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Course Header */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <span className="inline-block bg-white/20 px-3 py-1 rounded text-sm mb-4">
              {course.category}
            </span>
            <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
            <p className="text-xl mb-6">{course.description}</p>
            <div className="flex items-center gap-6 mb-6">
              <span className="text-lg">👨‍🏫 {course.instructor}</span>
              <span className="text-lg">📚 Batch {course.batch?.batchNumber}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold">৳{course.price}</span>
              {isAuthenticated && user?.role === 'student' && (
                <>
                  {isEnrolled ? (
                    <Link 
                      href={`/learn/${course._id}`}
                      className="btn bg-white text-primary hover:bg-gray-100 px-8 py-3 text-lg"
                    >
                      Start Learning →
                    </Link>
                  ) : (
                    <button 
                      onClick={handleEnroll}
                      disabled={enrolling}
                      className="btn bg-white text-primary hover:bg-gray-100 px-8 py-3 text-lg"
                    >
                      {enrolling ? 'Enrolling...' : 'Enroll Now'}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Tags */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Topics Covered</h2>
            <div className="flex flex-wrap gap-2">
              {course.tags?.map((tag, index) => (
                <span key={index} className="bg-gray-200 px-3 py-1 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Syllabus */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">Course Syllabus</h2>
            <div className="space-y-4">
              {course.syllabus?.map((module, moduleIndex) => (
                <div key={moduleIndex} className="border rounded-lg p-4">
                  <h3 className="text-xl font-bold mb-3">
                    Module {moduleIndex + 1}: {module.moduleTitle}
                  </h3>
                  
                  {/* Lessons */}
                  <div className="ml-4 space-y-2 mb-4">
                    <p className="font-semibold text-gray-700">Lessons:</p>
                    {module.lessons?.map((lesson, lessonIndex) => (
                      <div key={lessonIndex} className="flex items-center gap-2">
                        <span className="text-primary">▶</span>
                        <span>{lesson.lessonTitle}</span>
                        <span className="text-gray-500 text-sm">({lesson.duration})</span>
                      </div>
                    ))}
                  </div>

                  {/* Assignment */}
                  {module.assignment && (
                    <div className="ml-4 mb-4 bg-blue-50 p-3 rounded">
                      <p className="font-semibold text-blue-900">📝 Assignment:</p>
                      <p className="text-blue-800">{module.assignment.question}</p>
                      <span className="text-sm text-blue-600">Type: {module.assignment.type}</span>
                    </div>
                  )}

                  {/* Quiz */}
                  {module.quiz && module.quiz.length > 0 && (
                    <div className="ml-4 bg-green-50 p-3 rounded">
                      <p className="font-semibold text-green-900">✅ Quiz: {module.quiz.length} questions</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Batch Info */}
          {course.batch && (
            <div className="card mt-8">
              <h2 className="text-2xl font-bold mb-4">Batch Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-gray-600">Batch Number</p>
                  <p className="text-xl font-bold">{course.batch.batchNumber}</p>
                </div>
                <div>
                  <p className="text-gray-600">Start Date</p>
                  <p className="text-xl font-bold">
                    {new Date(course.batch.startDate).toLocaleDateString()}
                  </p>
                </div>
                {course.batch.endDate && (
                  <div>
                    <p className="text-gray-600">End Date</p>
                    <p className="text-xl font-bold">
                      {new Date(course.batch.endDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 CourseMaster. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
