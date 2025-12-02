const asyncHandler = require('express-async-handler');
const AssignmentSubmission = require('../models/AssignmentSubmission');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

// @desc    Submit assignment
// @route   POST /api/assignments/:courseId
// @access  Private/Student
exports.submitAssignment = asyncHandler(async (req, res) => {
  const { moduleIndex, submissionType, submissionContent } = req.body;

  // Check if enrolled
  const enrollment = await Enrollment.findOne({
    student: req.user._id,
    course: req.params.courseId
  });

  if (!enrollment) {
    res.status(403);
    throw new Error('Not enrolled in this course');
  }

  // Check if already submitted
  const existingSubmission = await AssignmentSubmission.findOne({
    student: req.user._id,
    course: req.params.courseId,
    moduleIndex
  });

  if (existingSubmission) {
    res.status(400);
    throw new Error('Assignment already submitted for this module');
  }

  const submission = await AssignmentSubmission.create({
    student: req.user._id,
    course: req.params.courseId,
    moduleIndex,
    submissionType,
    submissionContent
  });

  res.status(201).json({
    success: true,
    data: submission
  });
});

// @desc    Get my assignment submissions for a course
// @route   GET /api/assignments/:courseId/my
// @access  Private/Student
exports.getMySubmissions = asyncHandler(async (req, res) => {
  const submissions = await AssignmentSubmission.find({
    student: req.user._id,
    course: req.params.courseId
  }).sort('moduleIndex');

  res.json({
    success: true,
    data: submissions
  });
});

// @desc    Get all assignment submissions for a course (Admin)
// @route   GET /api/assignments/:courseId/all
// @access  Private/Admin
exports.getAllSubmissions = asyncHandler(async (req, res) => {
  const submissions = await AssignmentSubmission.find({
    course: req.params.courseId
  })
    .populate('student', 'name email')
    .sort('-submittedAt');

  res.json({
    success: true,
    data: submissions
  });
});

// @desc    Review/Grade assignment (Admin)
// @route   PUT /api/assignments/:id/review
// @access  Private/Admin
exports.reviewAssignment = asyncHandler(async (req, res) => {
  const { grade, feedback } = req.body;

  const submission = await AssignmentSubmission.findById(req.params.id);

  if (!submission) {
    res.status(404);
    throw new Error('Assignment submission not found');
  }

  submission.grade = grade;
  submission.feedback = feedback;
  submission.status = 'graded';

  await submission.save();

  res.json({
    success: true,
    data: submission
  });
});
