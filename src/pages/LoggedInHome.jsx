import { useState } from 'react';
import ChatWindow from '../components/ChatWindow';
import QuestionInput from '../components/QuestionInput';
import UserInfoBtn from '../components/UserInfoBtn';
import ChatLogs from '../components/ChatLogs';
import styles from './LoggedInHome.module.css';

export default function LoggedInHome() {
  // 초기 메시지를 상수로 정의 (리셋할 때 사용)
  const INITIAL_MESSAGE = { 
    id: 1, 
    sender: 'ai', 
    text: '안녕하세요! FinMate AI입니다. 📈\n무엇을 도와드릴까요?' 
  };

  // 메시지 상태 관리
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  
  // 사이드바 열림/닫힘 상태 관리
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 메시지 전송 핸들러
  const handleSendMessage = (text) => {
    // 1. 사용자 메시지 추가
    const userMessage = { id: Date.now(), sender: 'user', text: text };
    setMessages((prev) => [...prev, userMessage]);

    // 2. AI 응답 시뮬레이션 (나중에 API 연결)
    setTimeout(() => {
      const aiMessage = { 
        id: Date.now() + 1, 
        sender: 'ai', 
        text: `"${text}"에 대한 분석을 시작합니다...` 
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  // ★ 새 채팅 시작 핸들러
  const handleNewChat = () => {
    // 대화 내용 초기화
    setMessages([INITIAL_MESSAGE]);
    // 사이드바 닫기
    setIsSidebarOpen(false);
    console.log("새로운 대화가 시작되었습니다.");
  };

  // 과거 기록 클릭 핸들러 (나중에 구현)
  const handleSelectLog = (log) => {
    console.log("선택한 기록:", log);
    alert(`"${log.title}" 대화를 불러옵니다. (구현 예정)`);
    setIsSidebarOpen(false);
  };

  return (
    <div className={styles.layout}>
      {/* 사이드바 컴포넌트 */}
      <ChatLogs 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onSelectLog={handleSelectLog}
        onNewChat={handleNewChat} // ★ 함수 전달
      />

      <header className={styles.header}>
        {/* 왼쪽: 로고 */}
        <div className={styles.logo}>FinMate</div>

        {/* 오른쪽: 버튼 그룹 */}
        <div className={styles.rightHeader}>
          
          {/* 1. 채팅 기록 버튼 */}
          <button 
            className={styles.historyBtn} 
            onClick={() => setIsSidebarOpen(true)}
            title="채팅 기록"
          >
            {/* 시계 아이콘 (SVG) */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span className={styles.btnText}>채팅 기록</span>
          </button>

          {/* 2. 내 정보 버튼 */}
          <UserInfoBtn />
          
        </div>
      </header>

      {/* 메인 채팅 영역 */}
      <main className={styles.chatSection}>
        <div className={styles.chatContent}>
           <ChatWindow messages={messages} />
        </div>
      </main>

      {/* 하단 입력창 */}
      <footer className={styles.inputSection}>
        <div className={styles.inputWrapper}>
          <QuestionInput onSendMessage={handleSendMessage} />
        </div>
      </footer>
    </div>
  );
}