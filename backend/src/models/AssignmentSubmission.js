const mongoose = require('mongoose');

const assignmentSubmissionSchema = new mongoose.Schema({
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
  submissionType: {
    type: String,
    enum: ['text', 'file'],
    required: true
  },
  submissionContent: {
    type: String,
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'graded'],
    default: 'pending'
  },
  grade: {
    type: Number,
    min: 0,
    max: 100
  },
  feedback: {
    type: String
  }
}, {
  timestamps: true
});

// Index for faster queries
assignmentSubmissionSchema.index({ student: 1, course: 1, moduleIndex: 1 });

module.exports = mongoose.model('AssignmentSubmission', assignmentSubmissionSchema);
