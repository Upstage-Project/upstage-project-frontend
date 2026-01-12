// src/components/ChatWindow.jsx
import { useEffect, useRef } from 'react'; // 스크롤용 훅 추가
import styles from './ChatWindow.module.css';

// 부모에게서 messages 배열을 받아옴
export default function ChatWindow({ messages }) {
  const messagesEndRef = useRef(null);

  // ★ 메시지가 바뀔 때마다 맨 아래로 스크롤 이동
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className={styles.chatContainer}>
      {messages.map((msg) => (
        <div 
          key={msg.id} 
          className={`${styles.messageRow} ${msg.sender === 'user' ? styles.myRow : styles.aiRow}`}
        >
          {msg.sender === 'ai' && <div className={styles.aiIcon}>🤖</div>}
          <div className={styles.bubble}>
            {msg.text}
          </div>
        </div>
      ))}
      {/* 스크롤의 기준점이 될 보이지 않는 태그 */}
      <div ref={messagesEndRef} />
    </div>
  );
}