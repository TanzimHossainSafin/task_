const asyncHandler = require('express-async-handler');
const QuizResult = require('../models/QuizResult');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// @desc    Submit quiz
// @route   POST /api/quizzes/:courseId
// @access  Private/Student
exports.submitQuiz = asyncHandler(async (req, res) => {
  const { moduleIndex, answers } = req.body;

  // Check if enrolled
  const enrollment = await Enrollment.findOne({
    student: req.user._id,
    course: req.params.courseId
  });

  if (!enrollment) {
    res.status(403);
    throw new Error('Not enrolled in this course');
  }

  // Get course and quiz
  const course = await Course.findById(req.params.courseId);
  
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  const module = course.syllabus[moduleIndex];
  
  if (!module || !module.quiz || module.quiz.length === 0) {
    res.status(404);
    throw new Error('Quiz not found for this module');
  }

  // Calculate score
  let correctAnswers = 0;
  const quiz = module.quiz;

  answers.forEach(answer => {
    if (quiz[answer.questionIndex] && 
        quiz[answer.questionIndex].correctAnswer === answer.selectedAnswer) {
      correctAnswers++;
    }
  });

  const score = Math.round((correctAnswers / quiz.length) * 100);

  // Save result
  const quizResult = await QuizResult.create({
    student: req.user._id,
    course: req.params.courseId,
    moduleIndex,
    answers,
    score,
    totalQuestions: quiz.length
  });

  res.status(201).json({
    success: true,
    data: {
      score,
      correctAnswers,
      totalQuestions: quiz.length,
      result: quizResult
    }
  });
});

// @desc    Get my quiz results for a course
// @route   GET /api/quizzes/:courseId/my
// @access  Private/Student
exports.getMyQuizResults = asyncHandler(async (req, res) => {
  const results = await QuizResult.find({
    student: req.user._id,
    course: req.params.courseId
  }).sort('moduleIndex');

  res.json({
    success: true,
    data: results
  });
});

// @desc    Get all quiz results for a course (Admin)
// @route   GET /api/quizzes/:courseId/all
// @access  Private/Admin
exports.getAllQuizResults = asyncHandler(async (req, res) => {
  const results = await QuizResult.find({
    course: req.params.courseId
  })
    .populate('student', 'name email')
    .sort('-submittedAt');

  res.json({
    success: true,
    data: results
  });
});
