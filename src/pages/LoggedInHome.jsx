import { useState } from 'react';
import ChatWindow from '../components/ChatWindow';
import QuestionInput from '../components/QuestionInput';
import UserInfoBtn from '../components/UserInfoBtn';
import ChatLogs from '../components/ChatLogs';

// ★ [수정 1] 함수 이름을 agentApi.js 에 정의된 것과 똑같이 맞춤
import { sendAgentChat } from '../api/agentApi'; 

import styles from './LoggedInHome.module.css';

export default function LoggedInHome() {
  const INITIAL_MESSAGE = { 
    id: 1, 
    sender: 'ai', 
    text: '안녕하세요! FinMate AI입니다. 📈\n궁금한 종목을 물어보시면 분석해 드립니다.' 
  };

  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  
  // AI가 분석 중인지 여부
  const [isLoading, setIsLoading] = useState(false);

  // ★ API 연동된 메시지 전송 핸들러
  const handleSendMessage = async (text) => {
    // 1. 내 메시지 즉시 화면에 추가 (낙관적 업데이트)
    const userMessage = { id: Date.now(), sender: 'user', text: text };
    setMessages((prev) => [...prev, userMessage]);
    
    // 2. 로딩 시작 (입력창 비활성화됨)
    setIsLoading(true);

    try {
      // 3. ★ [수정 2] 실제 에이전트 API 호출 (분석 시간이 꽤 걸립니다)
      const response = await sendAgentChat(text);

      // 4. ★ [수정 3] API 응답 구조 매핑
      // 명세서: { answer: "...", loop_count: 3, ... }
      const aiMessage = { 
        id: Date.now() + 1, // 유저 메시지와 ID 겹침 방지
        sender: 'ai', 
        // 백엔드 명세서상 content가 아니라 answer 입니다.
        text: response.answer, 
        // (선택사항) 추론 횟수가 있다면 나중에 표시에 활용 가능
        loopCount: response.loop_count 
      };
      
      setMessages((prev) => [...prev, aiMessage]);

    } catch (error) {
      console.error("메시지 전송 에러:", error);
      
      // 에러 메시지 표시
      const errorMsg = { 
        id: Date.now() + 2, 
        sender: 'ai', 
        text: `죄송합니다. 답변을 가져오는 데 실패했습니다.\n오류 내용: ${error.message}` 
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      // 5. 로딩 끝 (입력창 다시 활성화)
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([INITIAL_MESSAGE]);
    setIsSidebarOpen(false);
    setIsReadOnly(false); 
  };

  const handleSelectLog = (log) => {
    // (추후 로그 API 연동 시 수정될 부분)
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
           
           {/* 로딩 멘트 구체화 */}
           {isLoading && (
             <div className={styles.typingIndicator}>
               <span>🤖 AI가 시장 데이터를 정밀 분석 중입니다... (최대 1~3분 소요)</span>
             </div>
           )}
        </div>
      </main>

      <footer className={styles.inputSection}>
        <div className={styles.inputWrapper}>
          {!isReadOnly ? (
            // 로딩 중일 때는 전송 버튼 막으려면 disabled={isLoading} 전달
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