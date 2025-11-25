import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Discovery from './pages/Discovery';
import Collection from './pages/Collection';
import QuizHub from './pages/QuizHub';
import GeneralQuiz from './pages/GeneralQuiz';
import CharacterQuiz from './pages/CharacterQuiz';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/discovery" element={<Discovery />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/quizzes" element={<QuizHub />} />
          <Route path="/quizzes/general" element={<GeneralQuiz />} />
          <Route path="/quizzes/character" element={<CharacterQuiz />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
