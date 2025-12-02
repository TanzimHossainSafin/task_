const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  moduleIndex: {
    type: Number,
    required: true
  },
  answers: [{
    questionIndex: Number,
    selectedAnswer: Number
  }],
  score: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
quizResultSchema.index({ student: 1, course: 1, moduleIndex: 1 });

module.exports = mongoose.model('QuizResult', quizResultSchema);
