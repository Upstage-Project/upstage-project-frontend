import { useNavigate } from 'react-router-dom';
import styles from './LoginHome.module.css';

export default function LoginHome() {
  const navigate = useNavigate();

  return (
    <div className={styles.wrapper}>
      {/* 1. 왼쪽 상단 로고 */}
      <header className={styles.header}>
        <div className={styles.logo}>FinMate</div>
      </header>

      {/* 2. 중앙 서비스 설명 */}
      <main className={styles.main}>
        <div className={styles.description}>
          <h1 className={styles.title}>
            더 똑똑한 주식 투자,<br />
            <span>AI와 함께 시작하세요</span>
          </h1>
          <p className={styles.subtitle}>
          초보 투자자도 이해할 수 있는 친절한 AI 투자 가이드.<br />
            FinMate와 함께하세요.
          </p>
        </div>
      </main>

      {/* 3. 하단 로그인 버튼 */}
      <footer className={styles.footer}>
        <button className={styles.loginBtn} onClick={() => navigate('/home')}>
          구글 계정으로 시작하기
        </button>
      </footer>
    </div>
  );
}