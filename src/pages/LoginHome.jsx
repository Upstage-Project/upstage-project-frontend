import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase'; 
import { GoogleAuthProvider, signInWithPopup, getAdditionalUserInfo } from 'firebase/auth'; 
import { socialLogin } from '../api/authApi'; // ★ [1] API 함수 추가
import styles from './LoginHome.module.css';

export default function LoginHome() {
  const useNavigateHook = useNavigate(); // 변수명 충돌 방지 (선택사항)

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });

      // 1. 파이어베이스 팝업 로그인 (프론트 인증)
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // 2. ★ 백엔드에 보낼 '주민등록증(ID Token)' 꺼내기
      const idToken = await user.getIdToken(); 
      console.log("백엔드로 보낼 토큰 준비 완료!");

      // 3. ★ 백엔드 API 호출 (로그인 검증 요청)
      // "백엔드야, 이 토큰 확인하고 내 정보(DB)랑 진짜 토큰(JWT) 줘!"
      const backendResponse = await socialLogin('google', idToken);

      // 4. 백엔드 응답 처리
      if (backendResponse) { // (성공 여부는 백엔드 응답 구조에 따라 .success 체크 등을 추가)
        
        // ★ [중요] 백엔드가 준 진짜 토큰을 저장해야 합니다.
        // (만약 백엔드가 accessToken이라는 이름으로 준다면 아래처럼 저장)
        const tokenToSave = backendResponse.accessToken || idToken; 
        localStorage.setItem('accessToken', tokenToSave);

        // 5. 신규 유저 확인 및 페이지 이동
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
      alert("서버와 통신 중 문제가 발생했습니다.");
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