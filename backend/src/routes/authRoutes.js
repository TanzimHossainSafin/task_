const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const { validate, schemas } = require('../middlewares/validationMiddleware');

router.post('/register', validate(schemas.register), register);
router.post('/login', validate(schemas.login), login);
router.get('/me', protect, getMe);

module.exports = router;
