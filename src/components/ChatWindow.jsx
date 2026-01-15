import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // 표(Table) 지원 플러그인
import styles from './ChatWindow.module.css';

export default function ChatWindow({ messages }) {
  const messagesEndRef = useRef(null);

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
            {msg.sender === 'ai' ? (
              /* ★ AI 답변은 마크다운으로 렌더링 (표, 리스트 지원) */
              <div className={styles.markdownContent}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.text}
                </ReactMarkdown>
                
                {/* 추론 횟수가 있으면 하단에 표시 */}
                {msg.loopCount > 0 && (
                  <div className={styles.loopInfo}>
                    🔍 {msg.loopCount}번의 심층 분석 과정을 거쳤습니다.
                  </div>
                )}
              </div>
            ) : (
              /* 내 메시지는 그냥 텍스트로 출력 */
              msg.text
            )}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}