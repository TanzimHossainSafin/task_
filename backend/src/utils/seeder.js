require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/database');
const User = require('../models/User');
const Course = require('../models/Course');

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Course.deleteMany();

    console.log('Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: process.env.ADMIN_EMAIL || 'admin@coursemaster.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@123456',
      role: 'admin'
    });

    // Create sample student
    const student = await User.create({
      name: 'John Doe',
      email: 'student@test.com',
      password: 'Student@123',
      role: 'student'
    });

    console.log('Created users');

    // Create sample courses
    const courses = [
      {
        title: 'Complete Web Development Bootcamp',
        description: 'Learn full-stack web development from scratch with HTML, CSS, JavaScript, React, Node.js, and MongoDB.',
        instructor: 'Sarah Johnson',
        price: 4999,
        category: 'Programming',
        tags: ['web', 'javascript', 'react', 'node'],
        thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop',
        syllabus: [
          {
            moduleTitle: 'Introduction to Web Development',
            lessons: [
              {
                lessonTitle: 'What is Web Development?',
                videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                duration: '15:30'
              },
              {
                lessonTitle: 'Setting Up Your Environment',
                videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                duration: '20:45'
              }
            ],
            assignment: {
              question: 'Create a simple HTML page with basic tags',
              type: 'file'
            },
            quiz: [
              {
                question: 'What does HTML stand for?',
                options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlinks and Text Markup Language'],
                correctAnswer: 0
              },
              {
                question: 'Which tag is used for creating a paragraph?',
                options: ['<p>', '<paragraph>', '<pg>', '<para>'],
                correctAnswer: 0
              }
            ]
          },
          {
            moduleTitle: 'JavaScript Fundamentals',
            lessons: [
              {
                lessonTitle: 'Variables and Data Types',
                videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                duration: '25:00'
              },
              {
                lessonTitle: 'Functions and Scope',
                videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                duration: '30:15'
              }
            ],
            assignment: {
              question: 'Write a JavaScript function to calculate factorial',
              type: 'text'
            },
            quiz: [
              {
                question: 'Which keyword is used to declare a constant in JavaScript?',
                options: ['var', 'let', 'const', 'constant'],
                correctAnswer: 2
              }
            ]
          }
        ],
        batch: {
          batchNumber: 1,
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-06-30')
        }
      },
      {
        title: 'UI/UX Design Masterclass',
        description: 'Master user interface and user experience design principles with Figma and Adobe XD.',
        instructor: 'Michael Chen',
        price: 3999,
        category: 'Design',
        tags: ['ui', 'ux', 'figma', 'design'],
        thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop',
        syllabus: [
          {
            moduleTitle: 'Design Fundamentals',
            lessons: [
              {
                lessonTitle: 'Introduction to UI/UX',
                videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                duration: '18:20'
              }
            ],
            assignment: {
              question: 'Create a wireframe for a mobile app',
              type: 'file'
            },
            quiz: [
              {
                question: 'What does UX stand for?',
                options: ['User Experience', 'User Experiment', 'Universal Experience', 'Unified Extension'],
                correctAnswer: 0
              }
            ]
          }
        ],
        batch: {
          batchNumber: 1,
          startDate: new Date('2024-02-01'),
          endDate: new Date('2024-05-31')
        }
      },
      {
        title: 'Data Science with Python',
        description: 'Learn data analysis, visualization, and machine learning with Python, Pandas, and Scikit-learn.',
        instructor: 'Dr. Emily Roberts',
        price: 5999,
        category: 'Data Science',
        tags: ['python', 'data', 'ml', 'analytics'],
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
        syllabus: [
          {
            moduleTitle: 'Python Basics for Data Science',
            lessons: [
              {
                lessonTitle: 'NumPy and Pandas Introduction',
                videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                duration: '35:00'
              }
            ],
            assignment: {
              question: 'Analyze a dataset and create visualizations',
              type: 'file'
            },
            quiz: [
              {
                question: 'Which library is primarily used for data manipulation in Python?',
                options: ['NumPy', 'Pandas', 'Matplotlib', 'TensorFlow'],
                correctAnswer: 1
              }
            ]
          }
        ],
        batch: {
          batchNumber: 1,
          startDate: new Date('2024-03-01'),
          endDate: new Date('2024-08-31')
        }
      },
      {
        title: 'Digital Marketing Fundamentals',
        description: 'Master SEO, SEM, social media marketing, and content marketing strategies.',
        instructor: 'Amanda Martinez',
        price: 2999,
        category: 'Marketing',
        tags: ['seo', 'marketing', 'social media', 'content'],
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
        syllabus: [
          {
            moduleTitle: 'Introduction to Digital Marketing',
            lessons: [
              {
                lessonTitle: 'What is Digital Marketing?',
                videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                duration: '22:30'
              }
            ],
            assignment: {
              question: 'Create a marketing plan for a product',
              type: 'text'
            },
            quiz: [
              {
                question: 'What does SEO stand for?',
                options: ['Search Engine Optimization', 'Social Engine Optimization', 'Search Engine Operation', 'Site Engine Optimization'],
                correctAnswer: 0
              }
            ]
          }
        ],
        batch: {
          batchNumber: 1,
          startDate: new Date('2024-01-15'),
          endDate: new Date('2024-04-15')
        }
      },
      {
        title: 'Business Strategy and Management',
        description: 'Learn business fundamentals, strategic planning, and effective management techniques.',
        instructor: 'Robert Thompson',
        price: 3499,
        category: 'Business',
        tags: ['business', 'strategy', 'management', 'leadership'],
        thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop',
        syllabus: [
          {
            moduleTitle: 'Business Basics',
            lessons: [
              {
                lessonTitle: 'Understanding Business Models',
                videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                duration: '28:00'
              }
            ],
            assignment: {
              question: 'Develop a business model canvas for a startup',
              type: 'file'
            },
            quiz: [
              {
                question: 'What is a SWOT analysis?',
                options: ['Strengths, Weaknesses, Opportunities, Threats', 'Sales, Work, Objectives, Targets', 'Strategy, Work, Operations, Training', 'None of the above'],
                correctAnswer: 0
              }
            ]
          }
        ],
        batch: {
          batchNumber: 1,
          startDate: new Date('2024-02-15'),
          endDate: new Date('2024-07-15')
        }
      }
    ];

    await Course.insertMany(courses);

    console.log('Created sample courses');
    console.log('\n=== Seeding Complete ===');
    console.log(`Admin Email: ${admin.email}`);
    console.log(`Admin Password: ${process.env.ADMIN_PASSWORD || 'Admin@123456'}`);
    console.log(`Student Email: ${student.email}`);
    console.log(`Student Password: Student@123`);
    console.log('========================\n');

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
