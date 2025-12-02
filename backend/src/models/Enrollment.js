const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
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
  enrolledAt: {
    type: Date,
    default: Date.now
  },
  progress: [{
    moduleIndex: {
      type: Number,
      required: true
    },
    lessonIndex: {
      type: Number,
      required: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: {
      type: Date
    }
  }],
  completionPercentage: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate enrollments
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
