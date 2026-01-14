// src/pages/LoginHome.jsx
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase'; 
import { GoogleAuthProvider, signInWithPopup, getAdditionalUserInfo, signOut } from 'firebase/auth'; 
import { socialLogin } from '../api/authApi'; 
import styles from './LoginHome.module.css';

export default function LoginHome() {
  // window.location.href를 쓰더라도 hook은 남겨두는 게 좋습니다 (추후 확장성 위해)
  const useNavigateHook = useNavigate(); 

  const handleGoogleLogin = async () => {
    try {
      // 1. 청소: 로그인 시도 전, 혹시 남아있을지 모를 쓰레기 토큰 삭제
      localStorage.removeItem('accessToken'); 

      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });

      // 2. 파이어베이스 팝업 로그인
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // 3. 백엔드에 보낼 임시 신분증(ID Token) 준비
      const idToken = await user.getIdToken(); 
      console.log("백엔드로 보낼 토큰 준비 완료!");

      // 4. 백엔드 API 호출 (로그인 요청)
      // (백엔드가 401을 뱉지 않도록 authApi.js나 백엔드 설정이 되어 있어야 합니다)
      const backendResponse = await socialLogin('google', idToken);

      // 5. 백엔드 응답 처리 (성공 시)
      if (backendResponse) { 
        // 백엔드가 준 '진짜 토큰'을 저장
        const tokenToSave = backendResponse.accessToken || idToken; 
        localStorage.setItem('accessToken', tokenToSave);

        // 신규 유저인지 확인
        const details = getAdditionalUserInfo(result);
        const isNewUser = details?.isNewUser; 

        // ★ [핵심] 페이지를 새로고침하며 이동 (window.location.href)
        // 이렇게 하면 App.jsx가 처음부터 다시 실행되면서 
        // localStorage에 방금 저장한 토큰을 확실하게 인식합니다.
        if (isNewUser) {
          alert("환영합니다! 서비스 이용을 위해 관심 주식을 먼저 등록해주세요.");
          window.location.href = '/userinfo'; 
        } else {
          console.log("기존 회원입니다. 홈으로 이동합니다.");
          window.location.href = '/home';
        }
      }

    } catch (error) {
      console.error("로그인 프로세스 에러:", error);

      // 에러 발생 시: 파이어베이스 로그인 상태도 강제로 풉니다.
      // 이걸 안 하면, 다음 시도 때 '이미 로그인됨'으로 착각할 수 있습니다.
      await signOut(auth);
      localStorage.removeItem('accessToken'); 

      alert("서버 연결 실패! 로그인이 취소되었습니다.\n(백엔드 연결 상태를 확인해주세요)");
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