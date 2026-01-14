import styles from './UserStock.module.css';

export default function UserStock({ stock, onDelete }) {
  // ★ [핵심 수정] 여기도 안전하게 둘 다 체크
  const stockName = stock.stock_name || stock.name;
  const stockCode = stock.stock_id || stock.code;

  return (
    <div className={styles.itemContainer}>
      <div className={styles.info}>
        <span className={styles.name}>{stockName}</span>
        <span className={styles.code}>{stockCode}</span>
      </div>
      
      <button 
        className={styles.deleteBtn} 
        // ★ 삭제할 때도 정확한 코드를 넘겨줘야 함
        onClick={() => onDelete(stockCode)} 
      >
        삭제
      </button>
    </div>
  );
}