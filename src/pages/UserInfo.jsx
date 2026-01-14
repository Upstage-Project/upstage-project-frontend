import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

// API 파일명 확인! (userStockApi.js 인지 stockApi.js 인지 본인 파일명에 맞추세요)
import { searchStock, getMyStocks, addMyStock, deleteMyStock } from '../api/userStockApi';

import StockRetrieve from '../components/StockRetrieve';
import RetrievedStock from '../components/RetrievedStock';
import UserStock from '../components/UserStock';
import styles from './UserInfo.module.css';

export default function UserInfo() {
    const navigate = useNavigate();
    const user = auth?.currentUser;
    const userEmail = user ? user.email : "test@finmate.com (게스트)";

    // ★ [변경 1] 검색 결과를 배열([])로 관리
    const [searchResults, setSearchResults] = useState([]); 
    const [myStocks, setMyStocks] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadMyStocks();
    }, []);

    const loadMyStocks = async () => {
        try {
            setLoading(true);
            const data = await getMyStocks();
            setMyStocks(data);
        } catch (error) {
            console.error("데이터 로드 실패:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            if (confirm("정말 로그아웃 하시겠습니까?")) {
                if (auth) await signOut(auth);
                localStorage.removeItem('accessToken');
                navigate('/');
            }
        } catch (error) {
            console.error("로그아웃 실패:", error);
        }
    };

    // ★ [변경 2] 검색 함수: 결과를 통째로 배열에 담음
    const handleSearch = async (keyword) => {
        try {
            setSearchResults([]); // 기존 결과 초기화
            const resultList = await searchStock(keyword); // API가 배열을 줌
            
            // 결과가 배열인지 확인하고 상태 업데이트
            if (resultList && Array.isArray(resultList)) {
                setSearchResults(resultList);
            } else if (resultList) {
                // 혹시라도 배열이 아니라 객체 하나만 올 경우를 대비
                setSearchResults([resultList]);
            } else {
                alert("검색 결과가 없습니다.");
            }
        } catch (error) {
            alert(error.message);
        }
    };

    const handleAddStock = async (stock) => {
        // 이미 있는지 중복 체크 (stock_id 또는 code 기준)
        const codeToCheck = stock.stock_id || stock.code;
        
        if (myStocks.some(item => (item.stock_id || item.code) === codeToCheck)) {
            alert("이미 등록된 종목입니다.");
            return;
        }

        try {
            await addMyStock(stock);
            
            // ★ 선택사항: 추가하고 나서 검색 결과를 닫을지 말지 결정
            // 여기서는 '하나 추가하면 검색창 닫기'로 구현 (원하면 이 줄 삭제)
            setSearchResults([]); 

            loadMyStocks(); // 목록 갱신
        } catch (error) {
            alert("추가 중 오류가 발생했습니다.");
        }
    };

    const handleDeleteStock = async (code) => {
        if (confirm("삭제하시겠습니까?")) {
            await deleteMyStock(code);
            loadMyStocks();
        }
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
                    <button className={styles.logoutBtn} onClick={handleLogout}>
                        로그아웃
                    </button>
                </div>

                <div className={styles.stockSection}>
                    <StockRetrieve onSearch={handleSearch} />

                    {/* ★ [변경 3] 검색 결과가 여러 개일 때 반복문(map)으로 렌더링 */}
                    {searchResults.length > 0 && (
                        <div className={styles.searchResultList}>
                            <h4 style={{ margin: '0 0 10px 0', color: '#555' }}>
                                🔍 검색 결과 ({searchResults.length}건)
                            </h4>
                            {searchResults.map((stock) => (
                                <RetrievedStock
                                    // 백엔드 데이터에 따라 고유한 key 값 설정 (중요!)
                                    key={stock.stock_id || stock.code} 
                                    stock={stock}
                                    onAdd={handleAddStock}
                                />
                            ))}
                        </div>
                    )}

                    <div className={styles.userStockArea}>
                        <h3 className={styles.listTitle}>내 주식 리스트 ({myStocks.length})</h3>

                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                                데이터 불러오는 중... ⏳
                            </div>
                        ) : myStocks.length === 0 ? (
                            <div className={styles.stockListPlaceholder}>
                                <p style={{ fontSize: '3rem', margin: '0 0 10px 0' }}>📂</p>
                                <strong>아직 관리 중인 주식이 없네요!</strong>
                                <p style={{ marginTop: '8px', color: '#666' }}>
                                    위 검색창에서 관심 있는 종목을 찾아<br />
                                    나만의 포트폴리오를 만들어보세요.
                                </p>
                            </div>
                        ) : (
                            <div className={styles.stockList}>
                                {myStocks.map((stock, index) => (
                                    <UserStock
                                        key={stock.stock_id || stock.code || index}
                                        stock={stock}
                                        onDelete={() => handleDeleteStock(stock.stock_id || stock.code)}
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