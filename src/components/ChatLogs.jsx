import styles from './ChatLogs.module.css';

// Props로 onNewChat 함수를 받음
export default function ChatLogs({ isOpen, onClose, onSelectLog, onNewChat }) {
  
  // 임시 데이터 (나중에 DB나 LocalStorage에서 불러옴)
  const chatHistory = [
    { id: 1, title: '삼성전자 전망 분석', date: '2026.01.12' },
    { id: 2, title: '2차전지 관련주 질문', date: '2026.01.10' },
    { id: 3, title: '미국 금리 인상 영향', date: '2026.01.05' },
    { id: 4, title: '포트폴리오 상담', date: '2025.12.28' },
  ];

  return (
    <>
      {/* 1. 배경 오버레이 */}
      <div 
        className={`${styles.overlay} ${isOpen ? styles.showOverlay : ''}`} 
        onClick={onClose} 
      />

      {/* 2. 사이드바 본체 */}
      <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        
        {/* 상단 헤더 */}
        <div className={styles.header}>
          <h2 className={styles.title}>채팅 기록</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* 기록 리스트 */}
        <ul className={styles.list}>
          {chatHistory.map((log) => (
            <li 
              key={log.id} 
              className={styles.item}
              onClick={() => onSelectLog(log)}
            >
              <span className={styles.logTitle}>{log.title}</span>
              <span className={styles.logDate}>{log.date}</span>
            </li>
          ))}
        </ul>
        
        {/* 하단 버튼 */}
        <div className={styles.footer}>
          <button 
            className={styles.newChatBtn} 
            onClick={onNewChat} // ★ 클릭 시 부모의 handleNewChat 실행
          >
            + 새 채팅 시작
          </button>
        </div>
      </div>
    </>
  );
}