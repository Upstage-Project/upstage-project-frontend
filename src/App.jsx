// src/App.jsx 수정본
import { useEffect, useState } from 'react'; // useState 추가
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

import LoginHome from './pages/LoginHome';
import LoggedInHome from './pages/LoggedInHome';
import UserInfo from './pages/UserInfo';

import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ★ 인증 확인 중임을 나타내는 상태

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        console.log("✅ 로그인 감지됨:", firebaseUser.email);
        const token = await firebaseUser.getIdToken();
        localStorage.setItem('accessToken', token);
        setUser(firebaseUser);
      } else {
        console.log("👋 로그아웃 또는 유저 삭제됨");
        localStorage.removeItem('accessToken');
        setUser(null);
      }
      setLoading(false); // ★ 확인이 끝나면 로딩 완료
    });

    return () => unsubscribe();
  }, []);

  // ★ 아주 중요: 파이어베이스가 "이 사람 유효한가?" 검사하는 동안은 아무것도 안 보여줌
  if (loading) return <div className="loading-screen">인증 확인 중...</div>;

  // 🔒 내부 함수로 보호 로직 이동 (App 상태인 user를 직접 사용)
  const PrivateRoute = ({ children }) => {
    return user ? children : <Navigate to="/" replace />;
  };

  const PublicRoute = ({ children }) => {
    return user ? <Navigate to="/home" replace /> : children;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicRoute><LoginHome /></PublicRoute>} />
        <Route path="/home" element={<PrivateRoute><LoggedInHome /></PrivateRoute>} />
        <Route path="/userinfo" element={<PrivateRoute><UserInfo /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;