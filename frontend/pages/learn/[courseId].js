import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import api from '../../utils/api';
import { toast } from 'react-toastify';

export default function LearnCourse() {
  const router = useRouter();
  const { courseId } = router.query;
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentModule, setCurrentModule] = useState(0);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showAssignment, setShowAssignment] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResults, setQuizResults] = useState(null);
  const [assignmentData, setAssignmentData] = useState({
    moduleIndex: 0,
    submissionType: 'text',
    submissionContent: ''
  });

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'student') {
      router.push('/auth/login');
      return;
    }
    if (courseId) {
      fetchCourseAndEnrollment();
    }
  }, [courseId, isAuthenticated, user]);

  const fetchCourseAndEnrollment = async () => {
    try {
      const [courseRes, enrollmentRes] = await Promise.all([
        api.get(`/courses/${courseId}`),
        api.get(`/enrollments/${courseId}`)
      ]);
      setCourse(courseRes.data.data);
      setEnrollment(enrollmentRes.data.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load course. Please enroll first.');
      router.push('/student/dashboard');
    }
  };

  const markLessonComplete = async (moduleIdx, lessonIdx) => {
    try {
      const { data } = await api.put(`/enrollments/${courseId}/progress`, {
        moduleIndex: moduleIdx,
        lessonIndex: lessonIdx
      });
      setEnrollment(data.data);
      toast.success('Lesson marked as complete! 🎉');
      
      // Auto-advance to next lesson after marking complete
      setTimeout(() => {
        handleNextLesson();
      }, 1000);
    } catch (error) {
      toast.error('Failed to update progress');
    }
  };

  const handleNextLesson = () => {
    const module = course.syllabus[currentModule];
    if (currentLesson < module.lessons.length - 1) {
      setCurrentLesson(currentLesson + 1);
    } else if (currentModule < course.syllabus.length - 1) {
      setCurrentModule(currentModule + 1);
      setCurrentLesson(0);
    } else {
      toast.info('You have completed all lessons!');
    }
  };

  const handlePreviousLesson = () => {
    if (currentLesson > 0) {
      setCurrentLesson(currentLesson - 1);
    } else if (currentModule > 0) {
      setCurrentModule(currentModule - 1);
      const prevModule = course.syllabus[currentModule - 1];
      setCurrentLesson(prevModule.lessons.length - 1);
    }
  };

  const submitQuiz = async () => {
    const module = course.syllabus[currentModule];
    const answers = Object.keys(quizAnswers).map(key => ({
      questionIndex: parseInt(key),
      selectedAnswer: quizAnswers[key]
    }));

    try {
      const { data } = await api.post(`/quizzes/${courseId}`, {
        moduleIndex: currentModule,
        answers
      });
      
      setQuizResults(data.data);
      setQuizSubmitted(true);
      
      const score = data.data.score;
      const total = data.data.totalQuestions;
      const percentage = (score / total) * 100;
      
      if (percentage === 100) {
        toast.success(`🎉 Perfect Score! ${score}/${total}`, { autoClose: 5000 });
      } else if (percentage >= 70) {
        toast.success(`✅ Good Job! Score: ${score}/${total}`, { autoClose: 5000 });
      } else {
        toast.warning(`📝 Score: ${score}/${total}. Keep learning!`, { autoClose: 5000 });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit quiz');
    }
  };

  const resetQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizResults(null);
    setShowQuiz(false);
  };

  const submitAssignment = async () => {
    try {
      await api.post(`/assignments/${courseId}`, {
        moduleIndex: assignmentData.moduleIndex,
        submissionType: assignmentData.submissionType,
        submissionContent: assignmentData.submissionContent
      });
      toast.success('✅ Assignment submitted successfully!');
      setShowAssignment(false);
      setAssignmentData({ moduleIndex: 0, submissionType: 'text', submissionContent: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit assignment');
    }
  };

  const isLessonCompleted = (moduleIdx, lessonIdx) => {
    if (!enrollment?.progress?.completedLessons) return false;
    return enrollment.progress.completedLessons.some(
      lesson => lesson.moduleIndex === moduleIdx && lesson.lessonIndex === lessonIdx
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading course...</p>
      </div>
    );
  }

  const currentModuleData = course?.syllabus[currentModule];
  const currentLessonData = currentModuleData?.lessons[currentLesson];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/student/dashboard" className="text-2xl font-bold text-primary">
              CourseMaster
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">{course?.title}</span>
              <Link href="/student/dashboard" className="btn btn-outline">
                Dashboard
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar - Course Navigation */}
        <div className="w-80 bg-white border-r overflow-y-auto">
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Course Content</h2>
            <div className="space-y-2">
              {course?.syllabus.map((module, moduleIdx) => (
                <div key={moduleIdx} className="border rounded-lg">
                  <div className="p-3 bg-gray-50 font-semibold">
                    Module {moduleIdx + 1}: {module.moduleTitle}
                  </div>
                  <div className="p-2">
                    {module.lessons.map((lesson, lessonIdx) => {
                      const isCompleted = isLessonCompleted(moduleIdx, lessonIdx);
                      return (
                        <button
                          key={lessonIdx}
                          onClick={() => {
                            setCurrentModule(moduleIdx);
                            setCurrentLesson(lessonIdx);
                            setShowQuiz(false);
                            setShowAssignment(false);
                          }}
                          className={`w-full text-left p-2 rounded mb-1 ${
                            currentModule === moduleIdx && currentLesson === lessonIdx
                              ? 'bg-primary text-white'
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {isCompleted ? (
                              <span className="text-green-500">✓</span>
                            ) : (
                              <span>▶</span>
                            )}
                            <span className={`text-sm ${isCompleted ? 'line-through opacity-75' : ''}`}>
                              {lesson.lessonTitle}
                            </span>
                          </div>
                          <span className="text-xs opacity-75">{lesson.duration}</span>
                        </button>
                      );
                    })}
                    
                    {/* Assignment Button */}
                    {module.assignment && (
                      <button
                        onClick={() => {
                          setCurrentModule(moduleIdx);
                          setShowAssignment(true);
                          setShowQuiz(false);
                          setAssignmentData({ ...assignmentData, moduleIndex: moduleIdx });
                        }}
                        className={`w-full text-left p-2 rounded mb-1 ${
                          showAssignment && currentModule === moduleIdx
                            ? 'bg-blue-500 text-white'
                            : 'bg-blue-50 hover:bg-blue-100 text-blue-900'
                        }`}
                      >
                        📝 Assignment
                      </button>
                    )}

                    {/* Quiz Button */}
                    {module.quiz && module.quiz.length > 0 && (
                      <button
                        onClick={() => {
                          setCurrentModule(moduleIdx);
                          setShowQuiz(true);
                          setShowAssignment(false);
                        }}
                        className={`w-full text-left p-2 rounded ${
                          showQuiz && currentModule === moduleIdx
                            ? 'bg-green-500 text-white'
                            : 'bg-green-50 hover:bg-green-100 text-green-900'
                        }`}
                      >
                        ✅ Quiz ({module.quiz.length} questions)
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          {!showQuiz && !showAssignment && (
            <div className="p-8">
              <h1 className="text-3xl font-bold mb-2">{currentLessonData?.lessonTitle}</h1>
              <p className="text-gray-600 mb-6">
                Module {currentModule + 1}: {currentModuleData?.moduleTitle}
              </p>

              {/* Video Player */}
              <div className="bg-black rounded-lg mb-6" style={{ aspectRatio: '16/9' }}>
                <iframe
                  src={currentLessonData?.videoUrl}
                  className="w-full h-full rounded-lg"
                  allowFullScreen
                  title={currentLessonData?.lessonTitle}
                ></iframe>
              </div>

              {/* Lesson Controls */}
              <div className="flex items-center justify-between mb-8">
                <button
                  onClick={handlePreviousLesson}
                  disabled={currentModule === 0 && currentLesson === 0}
                  className="btn btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Previous Lesson
                </button>

                <button
                  onClick={() => markLessonComplete(currentModule, currentLesson)}
                  disabled={isLessonCompleted(currentModule, currentLesson)}
                  className={`btn ${
                    isLessonCompleted(currentModule, currentLesson)
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  } text-white`}
                >
                  {isLessonCompleted(currentModule, currentLesson) 
                    ? '✓ Completed' 
                    : '✓ Mark as Complete'}
                </button>

                <button
                  onClick={handleNextLesson}
                  className="btn btn-primary"
                >
                  Next Lesson →
                </button>
              </div>

              {/* Progress Bar */}
              <div className="card">
                <h3 className="font-bold mb-2">Your Progress</h3>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-primary h-3 rounded-full transition-all"
                    style={{ width: `${enrollment?.progress.completionPercentage || 0}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {Math.round(enrollment?.progress.completionPercentage || 0)}% Complete
                </p>
              </div>
            </div>
          )}

          {/* Quiz View */}
          {showQuiz && (
            <div className="p-8">
              <h1 className="text-3xl font-bold mb-2">Quiz: {currentModuleData?.moduleTitle}</h1>
              <p className="text-gray-600 mb-6">
                {quizSubmitted ? 'Review your answers below' : 'Answer all questions to submit'}
              </p>

              {quizSubmitted && quizResults && (
                <div className={`card mb-6 ${
                  quizResults.score === quizResults.totalQuestions 
                    ? 'bg-green-50 border-green-300' 
                    : quizResults.score / quizResults.totalQuestions >= 0.7
                    ? 'bg-blue-50 border-blue-300'
                    : 'bg-yellow-50 border-yellow-300'
                }`}>
                  <h2 className="text-2xl font-bold mb-2">
                    Score: {quizResults.score}/{quizResults.totalQuestions}
                  </h2>
                  <p className="text-lg">
                    {quizResults.score === quizResults.totalQuestions 
                      ? '🎉 Perfect! You got all answers correct!'
                      : `You answered ${quizResults.score} out of ${quizResults.totalQuestions} questions correctly.`}
                  </p>
                </div>
              )}

              <div className="space-y-6">
                {currentModuleData?.quiz.map((question, qIdx) => {
                  const userAnswer = quizAnswers[qIdx];
                  const isCorrect = quizSubmitted && userAnswer === question.correctAnswer;
                  const isWrong = quizSubmitted && userAnswer !== question.correctAnswer;

                  return (
                    <div key={qIdx} className={`card ${
                      quizSubmitted 
                        ? isCorrect 
                          ? 'border-2 border-green-500 bg-green-50' 
                          : 'border-2 border-red-500 bg-red-50'
                        : ''
                    }`}>
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="font-bold flex-1">
                          Question {qIdx + 1}: {question.question}
                        </h3>
                        {quizSubmitted && (
                          <span className={`text-2xl ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                            {isCorrect ? '✓' : '✗'}
                          </span>
                        )}
                      </div>
                      <div className="space-y-2">
                        {question.options.map((option, optIdx) => {
                          const isSelected = userAnswer === optIdx;
                          const isCorrectOption = optIdx === question.correctAnswer;
                          
                          let optionClass = 'flex items-center gap-3 p-3 border rounded cursor-pointer';
                          
                          if (quizSubmitted) {
                            if (isCorrectOption) {
                              optionClass += ' bg-green-100 border-green-500 border-2';
                            } else if (isSelected && !isCorrectOption) {
                              optionClass += ' bg-red-100 border-red-500 border-2';
                            } else {
                              optionClass += ' opacity-60';
                            }
                          } else {
                            optionClass += isSelected ? ' bg-blue-100 border-blue-500' : ' hover:bg-gray-50';
                          }

                          return (
                            <label
                              key={optIdx}
                              className={optionClass}
                            >
                              <input
                                type="radio"
                                name={`question-${qIdx}`}
                                value={optIdx}
                                checked={isSelected}
                                disabled={quizSubmitted}
                                onChange={(e) => setQuizAnswers({
                                  ...quizAnswers,
                                  [qIdx]: parseInt(e.target.value)
                                })}
                                className="w-4 h-4"
                              />
                              <span className="flex-1">{option}</span>
                              {quizSubmitted && isCorrectOption && (
                                <span className="text-green-600 font-bold">✓ Correct Answer</span>
                              )}
                              {quizSubmitted && isSelected && !isCorrectOption && (
                                <span className="text-red-600 font-bold">✗ Wrong</span>
                              )}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-4 mt-6">
                {!quizSubmitted ? (
                  <>
                    <button
                      onClick={() => setShowQuiz(false)}
                      className="btn btn-outline"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={submitQuiz}
                      disabled={Object.keys(quizAnswers).length !== currentModuleData?.quiz.length}
                      className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Submit Quiz
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={resetQuiz}
                      className="btn btn-outline"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        setQuizAnswers({});
                        setQuizSubmitted(false);
                        setQuizResults(null);
                      }}
                      className="btn btn-primary"
                    >
                      Retake Quiz
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Assignment View */}
          {showAssignment && (
            <div className="p-8">
              <h1 className="text-3xl font-bold mb-2">Assignment: {currentModuleData?.moduleTitle}</h1>
              <p className="text-gray-600 mb-6">Submit your assignment below</p>

              <div className="card mb-6">
                <h3 className="font-bold mb-4">Assignment Question:</h3>
                <p className="text-lg">{currentModuleData?.assignment.question}</p>
                <p className="text-sm text-gray-600 mt-2">
                  Submission Type: {currentModuleData?.assignment.type}
                </p>
              </div>

              <div className="card">
                <label className="block mb-2 font-semibold">Your Answer:</label>
                <textarea
                  value={assignmentData.submissionContent}
                  onChange={(e) => setAssignmentData({
                    ...assignmentData,
                    submissionContent: e.target.value
                  })}
                  className="w-full border rounded-lg p-4 min-h-[200px]"
                  placeholder="Type your answer here or paste a link to your file..."
                ></textarea>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setShowAssignment(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  onClick={submitAssignment}
                  disabled={!assignmentData.submissionContent.trim()}
                  className="btn btn-primary"
                >
                  Submit Assignment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
