const asyncHandler = require('express-async-handler');
const Course = require('../models/Course');

// @desc    Get all courses with pagination, search, filter, sort
// @route   GET /api/courses
// @access  Public
exports.getCourses = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Build query
  let query = { isPublished: true };

  // Search by title or instructor
  if (req.query.search) {
    query.$text = { $search: req.query.search };
  }

  // Filter by category
  if (req.query.category) {
    query.category = req.query.category;
  }

  // Filter by tags
  if (req.query.tags) {
    query.tags = { $in: req.query.tags.split(',') };
  }

  // Sort options
  let sort = {};
  if (req.query.sort) {
    const sortField = req.query.sort;
    sort[sortField] = req.query.order === 'desc' ? -1 : 1;
  } else {
    sort.createdAt = -1; // Default: newest first
  }

  // Execute query
  const courses = await Course.find(query)
    .select('-syllabus.quiz.correctAnswer') // Don't send correct answers
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total = await Course.countDocuments(query);

  res.json({
    success: true,
    data: courses,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Public
exports.getCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id)
    .select('-syllabus.quiz.correctAnswer')
    .populate('enrolledStudents', 'name email');

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  res.json({
    success: true,
    data: course
  });
});

// @desc    Create new course
// @route   POST /api/courses
// @access  Private/Admin
exports.createCourse = asyncHandler(async (req, res) => {
  const course = await Course.create(req.body);

  res.status(201).json({
    success: true,
    data: course
  });
});

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Admin
exports.updateCourse = asyncHandler(async (req, res) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.json({
    success: true,
    data: course
  });
});

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
exports.deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  await course.deleteOne();

  res.json({
    success: true,
    data: {}
  });
});

// @desc    Get course categories
// @route   GET /api/courses/categories
// @access  Public
exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await Course.distinct('category');

  res.json({
    success: true,
    data: categories
  });
});
