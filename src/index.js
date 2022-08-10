import React from 'react';
import ReactDOM from 'react-dom/client';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/register';
import Login from './pages/login';
import Home from './pages/home';

const firebaseConfig = {
  apiKey: "AIzaSyDKT-4G51nJ5cJ_KYfsiGFpABJOmgapqgk",
  authDomain: "online-examination-platform.firebaseapp.com",
  projectId: "online-examination-platform",
  storageBucket: "online-examination-platform.appspot.com",
  messagingSenderId: "1006680708051",
  appId: "1:1006680708051:web:083d3d86418b01c43d9526",
  measurementId: "G-CP9FE23VY2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const root = ReactDOM.createRoot(document.querySelector('body'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </Router>
  </React.StrictMode>
);