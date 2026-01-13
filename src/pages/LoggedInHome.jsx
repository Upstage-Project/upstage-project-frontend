import { useState } from 'react';
import ChatWindow from '../components/ChatWindow';
import QuestionInput from '../components/QuestionInput';
import UserInfoBtn from '../components/UserInfoBtn';
import ChatLogs from '../components/ChatLogs';
// ★ API 함수 임포트 (경로 확인해주세요)
import { sendChatMessage } from '../api/chatApi'; 
import styles from './LoggedInHome.module.css';

export default function LoggedInHome() {
  const INITIAL_MESSAGE = { 
    id: 1, 
    sender: 'ai', 
    text: '안녕하세요! FinMate AI입니다. 📈\n무엇을 도와드릴까요?' 
  };

  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  
  // ★ 로딩 상태 추가 (AI가 생각 중인지)
  const [isLoading, setIsLoading] = useState(false);

  // ★ API 연동된 메시지 전송 핸들러
  const handleSendMessage = async (text) => {
    // 1. 내 메시지 즉시 화면에 추가 (낙관적 업데이트)
    const userMessage = { id: Date.now(), sender: 'user', text: text };
    setMessages((prev) => [...prev, userMessage]);
    
    // 2. 로딩 시작
    setIsLoading(true);

    try {
      // 3. API 호출 (여기서 1.5초 딜레이가 걸림)
      const response = await sendChatMessage(text);

      // 4. API 응답을 UI 형식으로 변환하여 추가
      // (API는 role/content를 주고, UI는 sender/text를 씀)
      const aiMessage = { 
        id: response.id, 
        sender: 'ai', // 무조건 AI 응답이므로 'ai' 고정
        text: response.content 
      };
      
      setMessages((prev) => [...prev, aiMessage]);

    } catch (error) {
      console.error("메시지 전송 에러:", error);
      // 에러 메시지 표시
      const errorMsg = { 
        id: Date.now(), 
        sender: 'ai', 
        text: "죄송합니다. 오류가 발생하여 답변을 가져오지 못했습니다." 
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      // 5. 로딩 끝
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([INITIAL_MESSAGE]);
    setIsSidebarOpen(false);
    setIsReadOnly(false); 
  };

  const handleSelectLog = (log) => {
    // (이 부분은 나중에 API가 나오면 수정)
    const oldMessages = [
      { id: 10, sender: 'user', text: log.title }, 
      { id: 11, sender: 'ai', text: `"${log.title}"에 대한 과거 상담 내역입니다.\n(이 내용은 읽기 전용입니다)` }
    ];
    setMessages(oldMessages);
    setIsSidebarOpen(false);
    setIsReadOnly(true); 
  };

  return (
    <div className={styles.layout}>
      <ChatLogs 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onSelectLog={handleSelectLog}
        onNewChat={handleNewChat}
      />

      <header className={styles.header}>
        <div className={styles.logo}>FinMate</div>
        <div className={styles.rightHeader}>
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
          <UserInfoBtn />
        </div>
      </header>

      <main className={styles.chatSection}>
        <div className={styles.chatContent}>
           <ChatWindow messages={messages} />
           
           {/* ★ 로딩 인디케이터 추가 */}
           {isLoading && (
             <div className={styles.typingIndicator}>
               <span>AI가 답변을 생성하고 있습니다... 💬</span>
             </div>
           )}
        </div>
      </main>

      <footer className={styles.inputSection}>
        <div className={styles.inputWrapper}>
          {!isReadOnly ? (
            // 로딩 중일 때는 전송 버튼 막으려면 disabled={isLoading} 전달 가능
            <QuestionInput onSendMessage={handleSendMessage} disabled={isLoading} />
          ) : (
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