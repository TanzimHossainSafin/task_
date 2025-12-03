import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { fetchCourses } from '../store/slices/courseSlice';

export default function Home() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { courses, pagination, isLoading } = useSelector(state => state.courses);
  const { isAuthenticated, user } = useSelector(state => state.auth);
  
  const [filters, setFilters] = useState({
    page: 1,
    limit: 9,
    search: '',
    category: '',
    sort: 'createdAt',
    order: 'desc'
  });
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    dispatch(fetchCourses(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    // Get search suggestions when user types
    if (filters.search.length > 0) {
      const suggestions = courses.filter(course => 
        course.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        course.category.toLowerCase().includes(filters.search.toLowerCase()) ||
        course.instructor.toLowerCase().includes(filters.search.toLowerCase())
      );
      setSearchSuggestions(suggestions.slice(0, 5)); // Show top 5 suggestions
      setShowSuggestions(true);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [filters.search, courses]);

  const handleSearch = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    dispatch(fetchCourses(filters));
  };

  const handleSuggestionClick = (course) => {
    setFilters({ ...filters, search: course.title });
    setShowSuggestions(false);
    router.push(`/courses/${course._id}`);
  };

  return (
    <div className="min-h-screen">
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
                  <button onClick={() => dispatch({ type: 'auth/logout' })} className="btn btn-primary">
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

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Learn Without Limits</h1>
          <p className="text-xl mb-8">Discover thousands of courses from expert instructors</p>
          <Link href="#courses" className="btn bg-white text-primary hover:bg-gray-100 text-lg px-8 py-3">
            Explore Courses
          </Link>
        </div>
      </section>

      {/* Filters & Search */}
      <section id="courses" className="container mx-auto px-4 py-12">
        <div className="card mb-8">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search courses..."
                className="input"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                onFocus={() => filters.search && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              />
              {/* Search Suggestions Dropdown */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                  {searchSuggestions.map((course) => (
                    <div
                      key={course._id}
                      onClick={() => handleSuggestionClick(course)}
                      className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={course.thumbnail} 
                          alt={course.title}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{course.title}</p>
                          <p className="text-xs text-gray-600">
                            {course.category} • {course.instructor}
                          </p>
                        </div>
                        <span className="text-primary font-bold text-sm">৳{course.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <select
              className="input"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            >
              <option value="">All Categories</option>
              <option value="Programming">Programming</option>
              <option value="Design">Design</option>
              <option value="Business">Business</option>
              <option value="Marketing">Marketing</option>
              <option value="Data Science">Data Science</option>
            </select>
            <select
              className="input"
              value={filters.sort}
              onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
            >
              <option value="createdAt">Newest</option>
              <option value="price">Price</option>
              <option value="title">Title</option>
            </select>
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </form>
        </div>

        {/* Course Grid */}
        {isLoading ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600">Loading courses...</p>
          </div>
        ) : courses && courses.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map(course => (
                <div key={course._id} className="card hover:shadow-lg transition-shadow">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <span className="inline-block bg-primary text-white text-xs px-2 py-1 rounded mb-2">
                    {course.category}
                  </span>
                  <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                  <p className="text-sm text-gray-500 mb-4">By {course.instructor}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-primary">৳{course.price}</span>
                    <Link href={`/courses/${course._id}`} className="btn btn-primary">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {[...Array(pagination.pages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setFilters({ ...filters, page: i + 1 })}
                    className={`px-4 py-2 rounded ${
                      filters.page === i + 1
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600">No courses found</p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 CourseMaster. All rights reserved.</p>
          <p className="text-sm text-gray-400 mt-2">Built for MISUN Academy Technical Assessment</p>
        </div>
      </footer>
    </div>
  );
}
