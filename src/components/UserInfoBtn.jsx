// src/components/UserInfoBtn.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase'; // firebase 설정 가져오기
import { onAuthStateChanged } from 'firebase/auth'; // 로그인 상태 감지
import styles from './UserInfoBtn.module.css';

export default function UserInfoBtn() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // 유저 상태 관리

  // 1. 컴포넌트가 켜지면 로그인 상태인지 확인
  useEffect(() => {
    // auth가 초기화되지 않았을 때(null)를 대비한 방어 코드
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // 유저 정보가 있으면 넣고, 없으면 null
    });

    return () => unsubscribe(); // 청소
  }, []);

  const handleClick = () => {
    // '/userinfo' 경로는 라우터 설정에 맞게 수정하세요 (예: /mypage, /user 등)
    navigate('/userinfo'); 
  };

  return (
    <button className={styles.btn} onClick={handleClick} title="내 정보">
      
      {/* 2. 조건부 렌더링: 프사가 있으면 사진을, 없으면 기존 SVG 아이콘을 보여줌 */}
      {user?.photoURL ? (
        <img 
          src={user.photoURL} 
          alt="프사" 
          className={styles.avatar} // CSS 추가 필요 (아래 참고)
        />
      ) : (
        // 기존 흑백 SVG 아이콘 (로그인 안했거나 프사 없을 때)
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      )}

      {/* 3. 텍스트: 로그인했으면 '이름', 아니면 '내 정보' */}
      <span className={styles.text}>
        {user ? user.displayName : "내 정보"}
      </span>
    </button>
  );
}