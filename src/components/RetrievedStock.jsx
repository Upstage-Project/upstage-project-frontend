import styles from './RetrievedStock.module.css';

export default function RetrievedStock({ stock, onAdd }) {
  if (!stock) return null;

  // ★ [핵심 수정] 백엔드 변수명(stock_name)과 프론트 변수명(name)을 둘 다 체크
  const stockName = stock.stock_name || stock.name;
  const stockCode = stock.stock_id || stock.code;

  return (
    <div className={styles.container}>
      <div className={styles.info}>
        {/* 수정된 변수 사용 */}
        <span className={styles.name}>{stockName}</span>
        <span className={styles.code}>{stockCode}</span>
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