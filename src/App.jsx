// src/App.jsx (최종 수정본)
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

import LoginHome from './pages/LoginHome';
import LoggedInHome from './pages/LoggedInHome';
import UserInfo from './pages/UserInfo';

import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 파이어베이스 상태 변화 감지
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      
      // ★ 핵심 수정: 파이어베이스 유저가 있어도, 백엔드 토큰이 없으면 로그인으로 안 침!
      const backendToken = localStorage.getItem('accessToken');

      if (firebaseUser && backendToken) {
        // 1. 파이어베이스도 로그인 상태고
        // 2. 백엔드 토큰도 로컬스토리지에 잘 있을 때만
        // -> 진짜 로그인 성공으로 인정!
        console.log("✅ 인증 완료: 홈으로 접근 허용");
        setUser(firebaseUser);
      } else {
        // 둘 중 하나라도 없으면 로그아웃 상태로 간주
        // (LoginHome에서 백엔드 통신 중일 때는 아직 토큰이 없으므로 여기 걸림 -> 납치 안 당함)
        console.log("👋 미인증 상태 (로그인 진행 중이거나 로그아웃)");
        setUser(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div className="loading-screen">인증 확인 중...</div>;

  // 로그인 상태(user가 있음)면 홈으로, 아니면 로그인화면으로
  const PrivateRoute = ({ children }) => {
    return user ? children : <Navigate to="/" replace />;
  };

  const PublicRoute = ({ children }) => {
    return user ? <Navigate to="/home" replace /> : children;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* PublicRoute는 user가 null일 때만 LoginHome을 보여줌 */}
        <Route path="/" element={<PublicRoute><LoginHome /></PublicRoute>} />
        
        {/* PrivateRoute는 user가 있을 때만 접근 가능 */}
        <Route path="/home" element={<PrivateRoute><LoggedInHome /></PrivateRoute>} />
        <Route path="/userinfo" element={<PrivateRoute><UserInfo /></PrivateRoute>} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;