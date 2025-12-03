import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import api from '../../utils/api';
import { toast } from 'react-toastify';

export default function AdminDashboard() {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('courses');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: '',
    price: '',
    category: 'Programming',
    tags: '',
    thumbnail: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    if (user?.role !== 'admin') {
      router.push('/student/dashboard');
      return;
    }
    fetchCourses();
  }, [isAuthenticated, user]);

  const fetchCourses = async () => {
    try {
      const { data } = await api.get('/courses');
      setCourses(data.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load courses');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const courseData = {
        ...formData,
        price: Number(formData.price),
        tags: formData.tags.split(',').map(tag => tag.trim()),
        syllabus: [
          {
            moduleTitle: 'Introduction',
            lessons: [
              {
                lessonTitle: 'Getting Started',
                videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                duration: '10:00'
              }
            ],
            assignment: {
              question: 'Complete the introduction assignment',
              type: 'text'
            },
            quiz: [
              {
                question: 'Sample quiz question',
                options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
                correctAnswer: 0
              }
            ]
          }
        ],
        batch: {
          batchNumber: 1,
          startDate: new Date(),
          endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)
        }
      };

      if (editingCourse) {
        await api.put(`/courses/${editingCourse._id}`, courseData);
        toast.success('Course updated successfully');
      } else {
        await api.post('/courses', courseData);
        toast.success('Course created successfully');
      }
      
      setShowCreateModal(false);
      setEditingCourse(null);
      setFormData({
        title: '',
        description: '',
        instructor: '',
        price: '',
        category: 'Programming',
        tags: '',
        thumbnail: '',
      });
      fetchCourses();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save course');
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      instructor: course.instructor,
      price: course.price,
      category: course.category,
      tags: course.tags.join(', '),
      thumbnail: course.thumbnail,
    });
    setShowCreateModal(true);
  };

  const handleDelete = async (courseId) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    
    try {
      await api.delete(`/courses/${courseId}`);
      toast.success('Course deleted successfully');
      fetchCourses();
    } catch (error) {
      toast.error('Failed to delete course');
    }
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
              CourseMaster Admin
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">Welcome, {user?.name}</span>
              <Link href="/" className="btn btn-outline">
                View Site
              </Link>
              <button onClick={handleLogout} className="btn btn-primary">
                Logout
              </button>
            </div>
          </div>
        </nav>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage your courses and content</p>
          </div>
          <button
            onClick={() => {
              setEditingCourse(null);
              setFormData({
                title: '',
                description: '',
                instructor: '',
                price: '',
                category: 'Programming',
                tags: '',
                thumbnail: '',
              });
              setShowCreateModal(true);
            }}
            className="btn btn-primary"
          >
            + Create New Course
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <h3 className="text-gray-600 mb-2">Total Courses</h3>
            <p className="text-3xl font-bold text-primary">{courses.length}</p>
          </div>
          <div className="card">
            <h3 className="text-gray-600 mb-2">Categories</h3>
            <p className="text-3xl font-bold text-green-600">
              {new Set(courses.map(c => c.category)).size}
            </p>
          </div>
          <div className="card">
            <h3 className="text-gray-600 mb-2">Avg Price</h3>
            <p className="text-3xl font-bold text-blue-600">
              ৳{courses.length > 0 ? Math.round(courses.reduce((sum, c) => sum + c.price, 0) / courses.length) : 0}
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
              Courses
            </button>
          </div>
        </div>

        {/* Course List */}
        {courses.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-xl text-gray-600 mb-4">No courses yet</p>
            <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">
              Create Your First Course
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {courses.map((course) => (
              <div key={course._id} className="card">
                <div className="flex gap-6">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-48 h-32 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="inline-block bg-primary text-white text-xs px-2 py-1 rounded mb-2">
                          {course.category}
                        </span>
                        <h3 className="text-xl font-bold">{course.title}</h3>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(course)}
                          className="btn btn-outline btn-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(course._id)}
                          className="btn bg-red-600 text-white hover:bg-red-700 btn-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-3">{course.description}</p>
                    <div className="flex gap-6 text-sm text-gray-600">
                      <span>👨‍🏫 {course.instructor}</span>
                      <span className="font-bold text-primary">৳{course.price}</span>
                      <span>📚 {course.syllabus?.length || 0} modules</span>
                      <span>🏷️ {course.tags?.join(', ')}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">
                {editingCourse ? 'Edit Course' : 'Create New Course'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Course Title</label>
                  <input
                    type="text"
                    required
                    className="input w-full"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Description</label>
                  <textarea
                    required
                    rows="3"
                    className="input w-full"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  ></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Instructor</label>
                    <input
                      type="text"
                      required
                      className="input w-full"
                      value={formData.instructor}
                      onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Price (৳)</label>
                    <input
                      type="number"
                      required
                      className="input w-full"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Category</label>
                  <select
                    className="input w-full"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Programming">Programming</option>
                    <option value="Design">Design</option>
                    <option value="Business">Business</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Data Science">Data Science</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    required
                    className="input w-full"
                    placeholder="javascript, web, react"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Thumbnail URL</label>
                  <input
                    type="url"
                    required
                    className="input w-full"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="submit" className="btn btn-primary flex-1">
                    {editingCourse ? 'Update Course' : 'Create Course'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditingCourse(null);
                    }}
                    className="btn btn-outline flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
