// src/components/RetrievedStock.jsx
import styles from './RetrievedStock.module.css';

// stock: 검색된 주식 정보 객체 (예: { name: '삼성전자', code: '005930' })
// onAdd: 등록 버튼을 눌렀을 때 실행될 함수
export default function RetrievedStock({ stock, onAdd }) {
  if (!stock) return null; // 검색 결과가 없으면 아무것도 안 보여줌

  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <span className={styles.name}>{stock.name}</span>
        <span className={styles.code}>{stock.code}</span>
      </div>
      
      <button 
        className={styles.addBtn} 
        onClick={() => onAdd(stock)}
      >
        등록
      </button>
    </div>
  );
}