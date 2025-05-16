import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import Profile from './pages/Profile';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';

function App() {
  return (
    <Router>
      <Header />
      <main style={{ minHeight: '80vh', padding: 16 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/posts/:postId" element={<PostDetail />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
