const express = require('express');
const router = express.Router();
const {
  submitQuiz,
  getMyQuizResults,
  getAllQuizResults
} = require('../controllers/quizController');
const { protect, student, admin } = require('../middlewares/authMiddleware');
const { validate, schemas } = require('../middlewares/validationMiddleware');

router.post('/:courseId', protect, student, validate(schemas.submitQuiz), submitQuiz);
router.get('/:courseId/my', protect, student, getMyQuizResults);
router.get('/:courseId/all', protect, admin, getAllQuizResults);

module.exports = router;
