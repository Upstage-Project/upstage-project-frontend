import { useState } from 'react';
import styles from './StockRetrieve.module.css';

// onSearch: 검색어가 입력되었을 때 실행할 부모의 함수
export default function StockRetrieve({ onSearch }) {
  const [keyword, setKeyword] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // 공백만 있는 경우 검색 막기
    if (!keyword.trim()) return;
    
    // 부모에게 검색어 전달
    onSearch(keyword);
    setKeyword(''); // 검색 후 입력창 비우기 (선택사항)
  };

  return (
    <form className={styles.searchContainer} onSubmit={handleSearch}>
      <input 
        type="text" 
        className={styles.searchInput}
        placeholder="종목명 또는 코드를 입력하세요 (예: 삼성전자)"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <button type="submit" className={styles.searchBtn}>
        🔍
      </button>
    </form>
  );
}