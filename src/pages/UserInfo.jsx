// src/pages/UserInfo.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StockRetrieve from '../components/StockRetrieve';
import RetrievedStock from '../components/RetrievedStock';
import UserStock from '../components/UserStock'; // ★ 추가
import styles from './UserInfo.module.css';

export default function UserInfo() {
  const navigate = useNavigate();
  const userEmail = "test@finmate.com"; 

  // 검색 결과 상태
  const [searchResult, setSearchResult] = useState(null);
  
  // ★ 내 주식 목록 상태 (초기엔 빈 배열 [])
  const [myStocks, setMyStocks] = useState([]);

  // 가짜 API 검색 함수
  const fetchStockInfo = (keyword) => {
    // 이미 내 목록에 있는 종목인지 확인하는 로직을 추가하면 더 좋습니다.
    const mockData = {
      name: keyword,
      code: '005930', // 테스트용 고정 코드 (실제론 API가 줌)
      id: Date.now() // 고유 ID용 (테스트용)
    };
    setSearchResult(mockData);
  };

  // ★ 주식 등록 함수
  const handleAddStock = (stock) => {
    // 중복 체크 (선택사항): 이미 있는 종목이면 등록 안 함
    if (myStocks.some(item => item.name === stock.name)) {
      alert("이미 등록된 종목입니다.");
      return;
    }

    setMyStocks([...myStocks, stock]); // 목록에 추가
    setSearchResult(null); // 등록했으니 검색 결과창은 닫기
  };

  // ★ 주식 삭제 함수
  const handleDeleteStock = (code) => {
    // 선택한 코드와 다른 것들만 남김 (=선택한 것 삭제)
    setMyStocks(myStocks.filter(stock => stock.code !== code));
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo} onClick={() => navigate('/home')}>FinMate</div>
        <button className={styles.closeBtn} onClick={() => navigate(-1)}>닫기 ✕</button>
      </header>

      <main className={styles.content}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.pageTitle}>
            <span className={styles.emailText}>{userEmail}</span> 
          </h1>
        </div>

        <div className={styles.stockSection}>
          {/* 1. 검색창 */}
          <StockRetrieve onSearch={fetchStockInfo} />
          
          {/* 2. 검색 결과 (있을 때만 표시) */}
          {searchResult && (
            <RetrievedStock 
              stock={searchResult} 
              onAdd={handleAddStock} 
            />
          )}

          {/* 3. 내 주식 목록 영역 */}
          <div className={styles.userStockArea}>
            <h3 className={styles.listTitle}>내 주식 리스트 ({myStocks.length})</h3>
            
            {myStocks.length === 0 ? (
              <div className={styles.stockListPlaceholder}>
                아직 등록된 주식이 없습니다. <br/>
                위에서 검색하여 추가해보세요!
              </div>
            ) : (
              <div className={styles.stockList}>
                {myStocks.map((stock, index) => (
                  <UserStock 
                    key={index} // 실제론 unique ID 사용 권장
                    stock={stock} 
                    onDelete={() => handleDeleteStock(stock.code)} 
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}