import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase'; 
// ★ signOut 추가됨
import { GoogleAuthProvider, signInWithPopup, getAdditionalUserInfo, signOut } from 'firebase/auth'; 
import { socialLogin } from '../api/authApi'; 
import styles from './LoginHome.module.css';

export default function LoginHome() {
  const useNavigateHook = useNavigate(); 

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });

      // 1. 파이어베이스 팝업 로그인
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // 2. 백엔드에 보낼 토큰 준비
      const idToken = await user.getIdToken(); 
      console.log("백엔드로 보낼 토큰 준비 완료!");

      // 3. 백엔드 API 호출
      const backendResponse = await socialLogin('google', idToken);

      // 4. 백엔드 응답 처리 (성공 시)
      if (backendResponse) { 
        const tokenToSave = backendResponse.accessToken || idToken; 
        localStorage.setItem('accessToken', tokenToSave);

        // 신규 유저 확인 및 이동
        const details = getAdditionalUserInfo(result);
        const isNewUser = details?.isNewUser; 

        if (isNewUser) {
          alert("환영합니다! 서비스 이용을 위해 관심 주식을 먼저 등록해주세요.");
          useNavigateHook('/userinfo'); 
        } else {
          console.log("기존 회원입니다. 홈으로 이동합니다.");
          useNavigateHook('/home');
        }
      }

    } catch (error) {
      console.error("로그인 프로세스 에러:", error);

      // ★ [핵심 수정] 에러 발생 시 파이어베이스 로그인도 강제 취소
      // 이걸 해야 새로고침 했을 때 홈으로 안 넘어갑니다.
      await signOut(auth);
      localStorage.removeItem('accessToken'); // 혹시 모를 쓰레기 토큰 삭제

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