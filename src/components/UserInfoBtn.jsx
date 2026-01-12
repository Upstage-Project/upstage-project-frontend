// src/components/UserInfoBtn.jsx
import { useNavigate } from 'react-router-dom';
import styles from './UserInfoBtn.module.css';

export default function UserInfoBtn() {
  const navigate = useNavigate();

  const handleClick = () => {
    // '/userinfo' 경로는 라우터 설정에 맞게 수정하세요 (예: /mypage, /user 등)
    navigate('/userinfo'); 
  };

  return (
    <button className={styles.btn} onClick={handleClick}>
      <span className={styles.icon}>👤</span>
      <span className={styles.text}>내 정보</span>
    </button>
  );
}