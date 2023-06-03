import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Signup from './pages/signup';
import Home from './pages/home';


function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route exact path='/login' element={<Login/>} />
          <Route exact path="/signup" element={<Signup/>}/>
          <Route exact path="/" element={<Home/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;