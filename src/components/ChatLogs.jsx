import { useEffect, useState } from 'react';
import styles from './ChatLogs.module.css';

export default function ChatLogs({ isOpen, onClose, onSelectLog, onNewChat }) {
  // 1. 채팅 목록을 저장할 상태
  const [chatHistory, setChatHistory] = useState([]);
  
  // 2. 로딩 상태 (데이터 불러오는 중일 때 표시)
  const [isLoading, setIsLoading] = useState(false);

  // ★ isOpen이 true로 변할 때마다 실행됨
  useEffect(() => {
    if (isOpen) {
      fetchChatLogs();
    }
  }, [isOpen]);

  const fetchChatLogs = async () => {
    setIsLoading(true);
    
    try {
      // --- [나중에 실제 백엔드 API 연결 시 사용할 코드] ---
      // const response = await fetch('/api/chat/sessions');
      // const data = await response.json();
      // setChatHistory(data);
      
      // --- [지금은 가짜 데이터로 흉내내기] ---
      // 네트워크 딜레이 0.5초 흉내
      await new Promise(resolve => setTimeout(resolve, 500)); 
      
      const mockData = [
        { id: 1, title: '삼성전자 전망 분석', date: '2026.01.12' },
        { id: 2, title: '2차전지 관련주 질문', date: '2026.01.10' },
        { id: 3, title: '미국 금리 인상 영향', date: '2026.01.05' },
        { id: 4, title: '포트폴리오 상담', date: '2025.12.28' },
        // 확인을 위해 항목을 하나 더 추가해봄
        { id: 5, title: '새로운 대화 기록', date: '방금 전' },
      ];
      setChatHistory(mockData);

    } catch (error) {
      console.error("채팅 기록 불러오기 실패:", error);
    } finally {
      setIsLoading(false); // 로딩 끝
    }
  };

  return (
    <>
      <div 
        className={`${styles.overlay} ${isOpen ? styles.showOverlay : ''}`} 
        onClick={onClose} 
      />

      <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.header}>
          <h2 className={styles.title}>채팅 기록</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <ul className={styles.list}>
          {/* 로딩 중일 때 메시지 표시 */}
          {isLoading ? (
            <li className={styles.loadingItem}>불러오는 중...</li>
          ) : (
            chatHistory.map((log) => (
              <li 
                key={log.id} 
                className={styles.item}
                onClick={() => onSelectLog(log)}
              >
                <span className={styles.logTitle}>{log.title}</span>
                <span className={styles.logDate}>{log.date}</span>
              </li>
            ))
          )}
          
          {/* 데이터가 비었을 때 안내 */}
          {!isLoading && chatHistory.length === 0 && (
             <li className={styles.emptyItem}>기록이 없습니다.</li>
          )}
        </ul>
        
        <div className={styles.footer}>
          <button className={styles.newChatBtn} onClick={onNewChat}>
            + 새 채팅 시작
          </button>
        </div>
      </div>
    </>
  );
}