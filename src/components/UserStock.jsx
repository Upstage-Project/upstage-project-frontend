// src/components/UserStock.jsx
import styles from './UserStock.module.css';

// stock: 주식 정보 객체
// onDelete: 삭제 버튼 눌렀을 때 실행될 함수
export default function UserStock({ stock, onDelete }) {
  return (
    <div className={styles.itemContainer}>
      <div className={styles.info}>
        <span className={styles.name}>{stock.name}</span>
        <span className={styles.code}>{stock.code}</span>
      </div>
      
      <button 
        className={styles.deleteBtn} 
        onClick={() => onDelete(stock.code)} // 삭제 시 고유 ID(코드)를 전달
      >
        삭제
      </button>
    </div>
  );
}