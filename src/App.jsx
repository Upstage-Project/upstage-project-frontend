import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; // Navigate 추가
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

import LoginHome from './pages/LoginHome';
import LoggedInHome from './pages/LoggedInHome';
import UserInfo from './pages/UserInfo';

import './App.css';

// 🔒 로그인한 사람만 들어갈 수 있는 경로 (Home, UserInfo 등)
function PrivateRoute({ children }) {
  const token = localStorage.getItem('accessToken');
  // 토큰이 없으면 로그인 페이지("/")로 보내고, 현재 히스토리를 교체(replace)함
  return token ? children : <Navigate to="/" replace />;
}

// 🔓 로그인 안 한 사람만 들어갈 수 있는 경로 (Login 페이지)
function PublicRoute({ children }) {
  const token = localStorage.getItem('accessToken');
  // 이미 토큰이 있으면 홈("/home")으로 보냄
  return token ? <Navigate to="/home" replace /> : children;
}

function App() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("✅ 로그인 감지됨:", user.email);
        const token = await user.getIdToken();
        localStorage.setItem('accessToken', token);
      } else {
        console.log("👋 로그아웃 상태입니다.");
        localStorage.removeItem('accessToken');
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* 1. 로그인 페이지: 로그인 된 사람은 못 들어감 */}
        <Route 
          path="/" 
          element={
            <PublicRoute>
              <LoginHome />
            </PublicRoute>
          } 
        />
        
        {/* 2. 메인 홈: 로그인 안 된 사람은 못 들어감 */}
        <Route 
          path="/home" 
          element={
            <PrivateRoute>
              <LoggedInHome />
            </PrivateRoute>
          } 
        />
        
        {/* 3. 내 정보: 로그인 안 된 사람은 못 들어감 */}
        <Route 
          path="/userinfo" 
          element={
            <PrivateRoute>
              <UserInfo />
            </PrivateRoute>
          } 
        />

        {/* 잘못된 경로로 접근 시 홈으로 이동 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;