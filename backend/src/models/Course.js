const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a course title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a course description']
  },
  instructor: {
    type: String,
    required: [true, 'Please provide instructor name']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: 0
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['Programming', 'Design', 'Business', 'Marketing', 'Data Science', 'Other']
  },
  tags: [{
    type: String
  }],
  thumbnail: {
    type: String,
    default: 'https://via.placeholder.com/400x300?text=Course+Thumbnail'
  },
  syllabus: [{
    moduleTitle: {
      type: String,
      required: true
    },
    lessons: [{
      lessonTitle: {
        type: String,
        required: true
      },
      videoUrl: {
        type: String,
        required: true
      },
      duration: {
        type: String
      }
    }],
    assignment: {
      question: String,
      type: {
        type: String,
        enum: ['text', 'file']
      }
    },
    quiz: [{
      question: String,
      options: [String],
      correctAnswer: Number
    }]
  }],
  batch: {
    batchNumber: {
      type: Number,
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date
    }
  },
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isPublished: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for search and filter
courseSchema.index({ title: 'text', instructor: 'text' });
courseSchema.index({ category: 1 });
courseSchema.index({ price: 1 });
courseSchema.index({ tags: 1 });

module.exports = mongoose.model('Course', courseSchema);
