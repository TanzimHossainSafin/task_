const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  getCategories
} = require('../controllers/courseController');
const { protect, admin } = require('../middlewares/authMiddleware');
const { validate, schemas } = require('../middlewares/validationMiddleware');

router.get('/categories', getCategories);
router.route('/')
  .get(getCourses)
  .post(protect, admin, validate(schemas.createCourse), createCourse);

router.route('/:id')
  .get(getCourse)
  .put(protect, admin, updateCourse)
  .delete(protect, admin, deleteCourse);

module.exports = router;
