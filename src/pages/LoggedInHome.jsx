// src/pages/LoggedInHome.jsx
import { useState } from 'react'; // ★ 상태 관리 추가
import ChatWindow from '../components/ChatWindow';
import QuestionInput from '../components/QuestionInput';
import UserInfoBtn from '../components/UserInfoBtn';
import styles from './LoggedInHome.module.css';

export default function LoggedInHome() {
  // 1. 대화 기록을 저장할 State (초기값으로 인사말 하나 넣어둠)
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: '안녕하세요! FinMate입니다. 📈\n무엇을 도와드릴까요?' }
  ]);

  // 2. 사용자가 메시지를 보냈을 때 실행될 함수
  const handleSendMessage = (text) => {
    // (1) 사용자 메시지 추가
    const userMessage = { id: Date.now(), sender: 'user', text: text };
    setMessages((prev) => [...prev, userMessage]);

    // (2) 1초 뒤에 AI가 답장하는 척 (임시)
    setTimeout(() => {
      const aiMessage = { 
        id: Date.now() + 1, 
        sender: 'ai', 
        text: `"${text}"에 대한 분석을 시작합니다... (임시 답변)` 
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.logo}>FinMate</div>
        
        {/* ★ 여기에 버튼 추가 */}
        <UserInfoBtn />
      </header>

      <main className={styles.chatSection}>
        <div className={styles.chatContent}>
           {/* 3. ChatWindow에 대화 기록(messages)을 전달 */}
           <ChatWindow messages={messages} />
        </div>
      </main>

      <footer className={styles.inputSection}>
        <div className={styles.inputWrapper}>
          {/* 4. QuestionInput에 "메시지 보내는 함수"를 전달 */}
          <QuestionInput onSendMessage={handleSendMessage} />
        </div>
      </footer>
    </div>
  );
}