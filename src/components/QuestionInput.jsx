import { useState } from 'react';
import styles from './QuestionInput.module.css';

// ★ 부모로부터 disabled prop을 추가로 받음
export default function QuestionInput({ onSendMessage, disabled }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // 로딩 중이거나 텍스트가 없으면 전송 불가
    if (disabled || !text.trim()) return;
    
    onSendMessage(text);
    setText(''); 
  };

  return (
    <form className={styles.inputContainer} onSubmit={handleSubmit}>
      <input
        type="text"
        className={styles.input}
        placeholder={disabled ? "AI가 답변을 생각하는 중입니다..." : "주식에 대해 궁금한 점을 물어보세요..."}
        value={text}
        onChange={(e) => setText(e.target.value)}
        // ★ 로딩 중엔 입력 막기
        disabled={disabled} 
      />
      {/* ★ 로딩 중엔 버튼 비활성화 */}
      <button 
        type="submit" 
        className={styles.sendBtn} 
        disabled={disabled || !text.trim()}
      >
        전송
      </button>
    </form>
  );
}