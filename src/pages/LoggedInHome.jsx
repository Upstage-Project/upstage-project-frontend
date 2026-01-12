import { useState } from 'react';
import ChatWindow from '../components/ChatWindow';
import QuestionInput from '../components/QuestionInput';
import UserInfoBtn from '../components/UserInfoBtn';
import ChatLogs from '../components/ChatLogs';
import styles from './LoggedInHome.module.css';

export default function LoggedInHome() {
  // 초기 메시지 상수
  const INITIAL_MESSAGE = { 
    id: 1, 
    sender: 'ai', 
    text: '안녕하세요! FinMate AI입니다. 📈\n무엇을 도와드릴까요?' 
  };

  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ★ 읽기 전용 모드 상태 (true면 입력창 대신 안내 문구 표시)
  const [isReadOnly, setIsReadOnly] = useState(false);

  // 메시지 전송 핸들러
  const handleSendMessage = (text) => {
    const userMessage = { id: Date.now(), sender: 'user', text: text };
    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      const aiMessage = { 
        id: Date.now() + 1, 
        sender: 'ai', 
        text: `"${text}"에 대한 분석을 시작합니다...` 
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  // 새 채팅 시작 핸들러
  const handleNewChat = () => {
    setMessages([INITIAL_MESSAGE]);
    setIsSidebarOpen(false);
    
    // ★ 새 채팅이므로 입력 가능하도록 변경
    setIsReadOnly(false); 
  };

  // 과거 기록 클릭 핸들러
  const handleSelectLog = (log) => {
    // 실제로는 API로 log.id에 해당하는 대화 내용을 받아와야 합니다.
    // 여기서는 테스트용 가짜 데이터를 넣습니다.
    const oldMessages = [
      { id: 10, sender: 'user', text: log.title }, 
      { id: 11, sender: 'ai', text: `"${log.title}"에 대한 과거 상담 내역입니다.\n(이 내용은 읽기 전용입니다)` }
    ];
    setMessages(oldMessages);
    setIsSidebarOpen(false);
    
    // ★ 과거 기록이므로 읽기 전용으로 변경 (입력 불가)
    setIsReadOnly(true); 
  };

  return (
    <div className={styles.layout}>
      {/* 사이드바 */}
      <ChatLogs 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onSelectLog={handleSelectLog}
        onNewChat={handleNewChat}
      />

      {/* 헤더 */}
      <header className={styles.header}>
        <div className={styles.logo}>FinMate</div>

        <div className={styles.rightHeader}>
          {/* 채팅 기록 버튼 */}
          <button 
            className={styles.historyBtn} 
            onClick={() => setIsSidebarOpen(true)}
            title="채팅 기록"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span className={styles.btnText}>채팅 기록</span>
          </button>

          {/* 내 정보 버튼 */}
          <UserInfoBtn />
        </div>
      </header>

      {/* 메인 채팅 영역 */}
      <main className={styles.chatSection}>
        <div className={styles.chatContent}>
           <ChatWindow messages={messages} />
        </div>
      </main>

      {/* 하단 영역 (입력창 or 읽기전용 안내) */}
      <footer className={styles.inputSection}>
        <div className={styles.inputWrapper}>
          
          {/* 읽기 전용이 아닐 때만 입력창 렌더링 */}
          {!isReadOnly ? (
            <QuestionInput onSendMessage={handleSendMessage} />
          ) : (
            /* 읽기 전용일 때 보여줄 UI */
            <div className={styles.readOnlyMessage}>
              <p>지난 대화 기록을 보고 계십니다.</p>
              <button className={styles.restartBtn} onClick={handleNewChat}>
                새 채팅 시작하기
              </button>
            </div>
          )}

        </div>
      </footer>
    </div>
  );
}