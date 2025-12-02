const asyncHandler = require('express-async-handler');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');

// @desc    Enroll in a course
// @route   POST /api/enrollments/:courseId
// @access  Private/Student
exports.enrollCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.courseId);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  // Check if already enrolled
  const existingEnrollment = await Enrollment.findOne({
    student: req.user._id,
    course: req.params.courseId
  });

  if (existingEnrollment) {
    res.status(400);
    throw new Error('Already enrolled in this course');
  }

  // Create enrollment
  const enrollment = await Enrollment.create({
    student: req.user._id,
    course: req.params.courseId
  });

  // Add to user's enrolled courses
  await User.findByIdAndUpdate(req.user._id, {
    $push: { enrolledCourses: req.params.courseId }
  });

  // Add to course's enrolled students
  await Course.findByIdAndUpdate(req.params.courseId, {
    $push: { enrolledStudents: req.user._id }
  });

  res.status(201).json({
    success: true,
    data: enrollment
  });
});

// @desc    Get my enrollments
// @route   GET /api/enrollments/my
// @access  Private/Student
exports.getMyEnrollments = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({ student: req.user._id })
    .populate('course', 'title description instructor thumbnail category price')
    .sort('-enrolledAt');

  res.json({
    success: true,
    data: enrollments
  });
});

// @desc    Mark lesson as completed
// @route   PUT /api/enrollments/:courseId/progress
// @access  Private/Student
exports.markLessonComplete = asyncHandler(async (req, res) => {
  const { moduleIndex, lessonIndex } = req.body;

  const enrollment = await Enrollment.findOne({
    student: req.user._id,
    course: req.params.courseId
  });

  if (!enrollment) {
    res.status(404);
    throw new Error('Enrollment not found');
  }

  // Check if already marked
  const existingProgress = enrollment.progress.find(
    p => p.moduleIndex === moduleIndex && p.lessonIndex === lessonIndex
  );

  if (!existingProgress) {
    enrollment.progress.push({
      moduleIndex,
      lessonIndex,
      completed: true,
      completedAt: Date.now()
    });
  } else {
    existingProgress.completed = true;
    existingProgress.completedAt = Date.now();
  }

  // Calculate completion percentage
  const course = await Course.findById(req.params.courseId);
  let totalLessons = 0;
  course.syllabus.forEach(module => {
    totalLessons += module.lessons.length;
  });

  const completedLessons = enrollment.progress.filter(p => p.completed).length;
  enrollment.completionPercentage = Math.round((completedLessons / totalLessons) * 100);

  await enrollment.save();

  res.json({
    success: true,
    data: enrollment
  });
});

// @desc    Get enrollment by course ID
// @route   GET /api/enrollments/:courseId
// @access  Private
exports.getEnrollmentByCourse = asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.findOne({
    student: req.user._id,
    course: req.params.courseId
  }).populate('course');

  if (!enrollment) {
    res.status(404);
    throw new Error('Enrollment not found');
  }

  res.json({
    success: true,
    data: enrollment
  });
});

// @desc    Get all enrollments for a course (Admin)
// @route   GET /api/enrollments/course/:courseId/students
// @access  Private/Admin
exports.getCourseEnrollments = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({ course: req.params.courseId })
    .populate('student', 'name email')
    .sort('-enrolledAt');

  res.json({
    success: true,
    data: enrollments
  });
});
