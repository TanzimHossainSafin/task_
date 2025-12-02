const Joi = require('joi');

// Validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map(detail => detail.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }
    
    next();
  };
};

// Validation schemas
const schemas = {
  register: Joi.object({
    name: Joi.string().required().trim().min(2).max(50),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    role: Joi.string().valid('student', 'admin').default('student')
  }),

  login: Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required()
  }),

  createCourse: Joi.object({
    title: Joi.string().required().trim(),
    description: Joi.string().required(),
    instructor: Joi.string().required(),
    price: Joi.number().required().min(0),
    category: Joi.string().required().valid('Programming', 'Design', 'Business', 'Marketing', 'Data Science', 'Other'),
    tags: Joi.array().items(Joi.string()),
    thumbnail: Joi.string().uri(),
    syllabus: Joi.array().items(Joi.object({
      moduleTitle: Joi.string().required(),
      lessons: Joi.array().items(Joi.object({
        lessonTitle: Joi.string().required(),
        videoUrl: Joi.string().required(),
        duration: Joi.string()
      })),
      assignment: Joi.object({
        question: Joi.string(),
        type: Joi.string().valid('text', 'file')
      }),
      quiz: Joi.array().items(Joi.object({
        question: Joi.string(),
        options: Joi.array().items(Joi.string()),
        correctAnswer: Joi.number()
      }))
    })),
    batch: Joi.object({
      batchNumber: Joi.number().required(),
      startDate: Joi.date().required(),
      endDate: Joi.date()
    }).required()
  }),

  submitAssignment: Joi.object({
    moduleIndex: Joi.number().required().min(0),
    submissionType: Joi.string().required().valid('text', 'file'),
    submissionContent: Joi.string().required()
  }),

  submitQuiz: Joi.object({
    moduleIndex: Joi.number().required().min(0),
    answers: Joi.array().items(Joi.object({
      questionIndex: Joi.number().required(),
      selectedAnswer: Joi.number().required()
    })).required()
  })
};

module.exports = { validate, schemas };
