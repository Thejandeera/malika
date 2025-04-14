import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import QuizCreator from './Pages/QuizCreator';
import QuizAttempt from './Pages/QuizAttempt';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-indigo-600 p-4 shadow-md">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <Link to="/" className="text-white text-2xl font-bold">QuizApp</Link>
            <div className="space-x-4">
              <Link to="/" className="text-white hover:text-indigo-200 transition-colors">Home</Link>
              <Link to="/create" className="text-white hover:text-indigo-200 transition-colors">Create Quiz</Link>
              <Link to="/attempt" className="text-white hover:text-indigo-200 transition-colors">Take Quiz</Link>
            </div>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto p-4 md:p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<QuizCreator />} />
            <Route path="/attempt" element={<QuizAttempt />} />
          </Routes>
        </div>

        <footer className="bg-gray-800 text-white p-4 mt-12">
          <div className="max-w-6xl mx-auto text-center">
            <p>&copy; {new Date().getFullYear()} Quiz Application</p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

// Simple Home component
const Home = () => {
  return (
    <div className="text-center py-12">
      <h1 className="text-4xl font-bold text-indigo-700 mb-6">Welcome to Quiz App</h1>
      <p className="text-xl text-gray-700 mb-8">Create or attempt quizzes with our easy-to-use platform</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        <Link to="/create" className="p-8 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold text-indigo-600 mb-3">Create a Quiz</h2>
          <p className="text-gray-600">Design your own custom quiz with multiple-choice questions</p>
        </Link>
        
        <Link to="/attempt" className="p-8 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold text-indigo-600 mb-3">Take a Quiz</h2>
          <p className="text-gray-600">Enter a quiz ID to test your knowledge and see your results</p>
        </Link>
      </div>
    </div>
  );
};

export default App;