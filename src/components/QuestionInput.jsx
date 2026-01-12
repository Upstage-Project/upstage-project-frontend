// src/components/QuestionInput.jsx
import { useState } from 'react';
import styles from './QuestionInput.module.css';

// 부모에게서 onSendMessage 함수를 받아옴
export default function QuestionInput({ onSendMessage }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    // ★ 부모에게 입력한 텍스트 전달!
    onSendMessage(text);
    
    setText(''); // 입력창 비우기
  };

  return (
    <form className={styles.inputContainer} onSubmit={handleSubmit}>
      <input
        type="text"
        className={styles.input}
        placeholder="주식에 대해 궁금한 점을 물어보세요..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit" className={styles.sendBtn} disabled={!text.trim()}>
        전송
      </button>
    </form>
  );
}