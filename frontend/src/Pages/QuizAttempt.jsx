import { useState, useEffect } from "react";
import axios from "axios";

export default function QuizAttempt() {
  const [quizId, setQuizId] = useState("");
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Fetch quiz data
  const fetchQuiz = async () => {
    if (!quizId || quizId.length !== 6) {
      setError("Please enter a valid 6-digit quiz ID");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const response = await axios.get(`http://localhost:8080/api/quizzes/${quizId}`);
      setQuiz(response.data);
      // Reset state when loading a new quiz
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setQuizSubmitted(false);
      setScore(0);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load quiz. Please check the ID and try again.");
      setQuiz(null);
    } finally {
      setLoading(false);
    }
  };

  // Handle answer selection
  const handleAnswerSelect = (questionId, answerNumber) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answerNumber
    });
  };

  // Navigate to next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Navigate to previous question
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Submit quiz and calculate score
  const handleSubmitQuiz = () => {
    let correctAnswers = 0;
    
    quiz.questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    setScore(correctAnswers);
    setQuizSubmitted(true);
  };

  // Check if current question has been answered
  const isCurrentQuestionAnswered = () => {
    if (!quiz) return false;
    const currentQuestion = quiz.questions[currentQuestionIndex];
    return selectedAnswers[currentQuestion.id] !== undefined;
  };

  // Check if all questions have been answered
  const areAllQuestionsAnswered = () => {
    if (!quiz) return false;
    return quiz.questions.every(q => selectedAnswers[q.id] !== undefined);
  };

  // Reset the quiz
  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setQuizSubmitted(false);
    setScore(0);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-8 text-indigo-700">Quiz Challenge</h1>

      {!quiz && (
        <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Enter Quiz ID</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={quizId}
              onChange={(e) => setQuizId(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="flex-grow p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              placeholder="Enter 6-digit quiz ID"
              maxLength="6"
            />
            <button
              onClick={fetchQuiz}
              disabled={loading || quizId.length !== 6}
              className={`px-6 py-3 font-medium rounded-md text-white transition-colors ${
                loading || quizId.length !== 6 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loading ? "Loading..." : "Start Quiz"}
            </button>
          </div>
          {error && <p className="mt-3 text-red-500">{error}</p>}
        </div>
      )}

      {quiz && !quizSubmitted && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">{quiz.name}</h2>
            <div className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-700">
              Difficulty: {quiz.difficulty}
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm font-medium text-gray-500">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0}
                className={`p-2 rounded-md ${
                  currentQuestionIndex === 0 
                    ? "text-gray-400 cursor-not-allowed" 
                    : "text-indigo-600 hover:bg-indigo-50"
                }`}
              >
                Previous
              </button>
              <button
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex === quiz.questions.length - 1 || !isCurrentQuestionAnswered()}
                className={`p-2 rounded-md ${
                  currentQuestionIndex === quiz.questions.length - 1 || !isCurrentQuestionAnswered()
                    ? "text-gray-400 cursor-not-allowed" 
                    : "text-indigo-600 hover:bg-indigo-50"
                }`}
              >
                Next
              </button>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
            <div className="mb-6">
              <h3 className="text-xl font-medium text-gray-800 mb-2">
                {quiz.questions[currentQuestionIndex].title}
              </h3>
              
              <div className="space-y-3">
                {[1, 2, 3, 4].map((num) => (
                  <div 
                    key={num}
                    onClick={() => handleAnswerSelect(quiz.questions[currentQuestionIndex].id, num)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedAnswers[quiz.questions[currentQuestionIndex].id] === num
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-indigo-300 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-6 h-6 flex items-center justify-center rounded-full mr-3 ${
                        selectedAnswers[quiz.questions[currentQuestionIndex].id] === num
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}>
                        {num}
                      </div>
                      <span>{quiz.questions[currentQuestionIndex][`answer${num}`]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex gap-1">
              {quiz.questions.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index === currentQuestionIndex
                      ? "bg-indigo-600"
                      : selectedAnswers[quiz.questions[index].id] !== undefined
                        ? "bg-green-500"
                        : "bg-gray-300"
                  }`}
                ></div>
              ))}
            </div>
            
            {currentQuestionIndex === quiz.questions.length - 1 && (
              <button
                onClick={handleSubmitQuiz}
                disabled={!areAllQuestionsAnswered()}
                className={`px-6 py-3 font-medium rounded-md text-white ${
                  areAllQuestionsAnswered()
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-400 cursor-not-allowed"
                } transition-colors`}
              >
                Submit Quiz
              </button>
            )}
          </div>
        </div>
      )}
      
      {quiz && quizSubmitted && (
        <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 shadow-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-indigo-100 rounded-full mb-4">
              <span className="text-3xl font-bold text-indigo-700">{score}/{quiz.questions.length}</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Quiz Completed!</h2>
            <p className="text-gray-600">
              {score === quiz.questions.length
                ? "Perfect score! You got all questions right."
                : score >= quiz.questions.length / 2
                  ? "Good job! You passed the quiz."
                  : "Keep practicing. You'll do better next time."}
            </p>
          </div>
          
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Question Review</h3>
            <div className="space-y-6">
              {quiz.questions.map((question, index) => (
                <div key={index} className="p-4 border rounded-lg bg-white">
                  <h4 className="font-medium mb-2">{question.title}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                    {[1, 2, 3, 4].map(num => (
                      <div 
                        key={num}
                        className={`p-3 border rounded-md ${
                          num === question.correctAnswer && selectedAnswers[question.id] === num
                            ? "bg-green-100 border-green-300"
                            : num === question.correctAnswer
                              ? "bg-green-50 border-green-200"
                              : selectedAnswers[question.id] === num
                                ? "bg-red-50 border-red-200"
                                : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-5 h-5 flex items-center justify-center rounded-full mr-2 ${
                            num === question.correctAnswer
                              ? "bg-green-500 text-white"
                              : selectedAnswers[question.id] === num
                                ? "bg-red-500 text-white"
                                : "bg-gray-200 text-gray-700"
                          }`}>
                            {num}
                          </div>
                          <span>{question[`answer${num}`]}</span>
                          {num === question.correctAnswer && (
                            <span className="ml-2 text-green-600 text-xs">(Correct)</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-sm text-gray-500">
                    {selectedAnswers[question.id] === question.correctAnswer
                      ? "You answered correctly!"
                      : `Your answer: ${selectedAnswers[question.id] || "None"}, Correct answer: ${question.correctAnswer}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center space-x-4">
            
            <button
              onClick={() => {
                setQuiz(null);
                setQuizId("");
              }}
              className="px-6 py-3 font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              New Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
}