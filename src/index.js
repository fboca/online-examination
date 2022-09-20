import React from 'react';
import ReactDOM from 'react-dom/client';
import { initializeApp } from "firebase/app";
import { getPerformance } from "firebase/performance";
import { getAnalytics } from "firebase/analytics";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/register';
import Login from './pages/login';
import Home from './pages/home';
import Account from './pages/account';
import Welcome from './pages/welcome';
import ForgotPassword from './authentication/forgotpassword';
import PrivacyPolicy from './legal/privacy-policy';

const firebaseConfig = {
  apiKey: "AIzaSyDKT-4G51nJ5cJ_KYfsiGFpABJOmgapqgk",
  authDomain: "online-examination-platform.firebaseapp.com",
  projectId: "online-examination-platform",
  storageBucket: "online-examination-platform.appspot.com",
  messagingSenderId: "1006680708051",
  appId: "1:1006680708051:web:083d3d86418b01c43d9526",
  measurementId: "G-CP9FE23VY2"
  //i9uqWdWgQyQbaJt
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const perf = getPerformance(app);

const root = ReactDOM.createRoot(document.querySelector('body'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/login/success' element={<Welcome />} />
        <Route path='/account' element={<Account />} />
        <Route path='/auth/reset-password' element={<ForgotPassword />} />
        <Route path='/privacy-policy' element={<PrivacyPolicy />} />
      </Routes>
    </Router>
  </React.StrictMode>
);