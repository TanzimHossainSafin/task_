const express = require('express');
const router = express.Router();
const {
  enrollCourse,
  getMyEnrollments,
  markLessonComplete,
  getEnrollmentByCourse,
  getCourseEnrollments
} = require('../controllers/enrollmentController');
const { protect, student, admin } = require('../middlewares/authMiddleware');

router.get('/my', protect, student, getMyEnrollments);
router.get('/course/:courseId/students', protect, admin, getCourseEnrollments);
router.post('/:courseId', protect, student, enrollCourse);
router.get('/:courseId', protect, getEnrollmentByCourse);
router.put('/:courseId/progress', protect, student, markLessonComplete);

module.exports = router;
