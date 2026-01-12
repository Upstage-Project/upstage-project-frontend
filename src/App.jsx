import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginHome from './pages/LoginHome';
import LoggedInHome from './pages/LoggedInHome';
import UserInfo from './pages/UserInfo'; // ★ 추가

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 로그인 화면 (첫 화면) */}
        <Route path="/" element={<LoginHome />} />
        
        {/* 메인 채팅 화면 */}
        <Route path="/home" element={<LoggedInHome />} />
        
        {/* ★ 내 정보 화면 (새로 추가됨) */}
        <Route path="/userinfo" element={<UserInfo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;