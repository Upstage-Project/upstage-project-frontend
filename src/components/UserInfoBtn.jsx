import { useNavigate } from 'react-router-dom';
import styles from './UserInfoBtn.module.css';

export default function UserInfoBtn() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/userinfo'); 
  };

  return (
    <button className={styles.btn} onClick={handleClick} title="내 정보">
      {/* 이모지 대신 SVG 아이콘 사용 (흑백) */}
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

      {/* 텍스트 (모바일에서는 CSS로 숨겨짐) */}
      <span className={styles.text}>내 정보</span>
    </button>
  );
}