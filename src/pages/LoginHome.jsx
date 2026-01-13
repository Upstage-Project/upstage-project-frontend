import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase'; 
// ★ getAdditionalUserInfo 추가 임포트 필수!
import { GoogleAuthProvider, signInWithPopup, getAdditionalUserInfo } from 'firebase/auth'; 
import styles from './LoginHome.module.css';

export default function LoginHome() {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });

      // 1. 팝업 로그인 실행
      const result = await signInWithPopup(auth, provider);
      
      // 2. ★ 신규 유저 여부 확인 (핵심 코드)
      const details = getAdditionalUserInfo(result);
      const isNewUser = details?.isNewUser; // true면 첫 가입, false면 기존 유저

      localStorage.setItem('accessToken', 'dev-test-token');

      // 3. 분기 처리
      if (isNewUser) {
        // [첫 방문] 환영 메시지 띄우고 -> 내 정보 페이지로 납치
        alert("환영합니다! 서비스 이용을 위해 관심 주식을 먼저 등록해주세요.");
        navigate('/userinfo'); 
      } else {
        // [기존 방문] 그냥 홈으로 이동
        console.log("기존 회원입니다. 홈으로 이동합니다.");
        navigate('/home');
      }

    } catch (error) {
      console.error("로그인 에러:", error);
      alert("로그인 중 문제가 발생했습니다.");
    }
  };

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.logo}>FinMate</div>
      </header>

      <main className={styles.main}>
        <div className={styles.description}>
          <h1 className={styles.title}>
            더 똑똑한 주식 투자,<br />
            <span>AI와 함께 시작하세요</span>
          </h1>
          <p className={styles.subtitle}>
            초보 투자자도 이해할 수 있는 친절한 AI 투자 가이드.
          </p>
        </div>
      </main>

      <footer className={styles.footer}>
        <button className={styles.loginBtn} onClick={handleGoogleLogin}>
          <span style={{ marginRight: '8px' }}>G</span> 
          구글 계정으로 시작하기
        </button>
      </footer>
    </div>
  );
}