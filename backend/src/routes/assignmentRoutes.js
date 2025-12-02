const express = require('express');
const router = express.Router();
const {
  submitAssignment,
  getMySubmissions,
  getAllSubmissions,
  reviewAssignment
} = require('../controllers/assignmentController');
const { protect, student, admin } = require('../middlewares/authMiddleware');
const { validate, schemas } = require('../middlewares/validationMiddleware');

router.post('/:courseId', protect, student, validate(schemas.submitAssignment), submitAssignment);
router.get('/:courseId/my', protect, student, getMySubmissions);
router.get('/:courseId/all', protect, admin, getAllSubmissions);
router.put('/:id/review', protect, admin, reviewAssignment);

module.exports = router;
