// src/pages/UserInfo.jsx
import { useState, useEffect } from 'react'; // useEffect 추가
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

// ★ 우리가 만든 API 함수들 임포트
import { searchStock, getMyStocks, addMyStock, deleteMyStock } from '../api/stockApi';

import StockRetrieve from '../components/StockRetrieve';
import RetrievedStock from '../components/RetrievedStock';
import UserStock from '../components/UserStock';
import styles from './UserInfo.module.css';

export default function UserInfo() {
    const navigate = useNavigate();
    const user = auth?.currentUser;
    const userEmail = user ? user.email : "test@finmate.com (게스트)";

    const [searchResult, setSearchResult] = useState(null);
    const [myStocks, setMyStocks] = useState([]);
    const [loading, setLoading] = useState(false); // ★ 로딩 상태 추가

    // 1. 화면이 켜지면 내 주식 리스트를 불러옴 (API 호출)
    useEffect(() => {
        loadMyStocks();
    }, []);

    // 목록 불러오기 함수
    const loadMyStocks = async () => {
        try {
            setLoading(true); // 로딩 시작
            const data = await getMyStocks(); // API 심부름 시키기
            setMyStocks(data);
        } catch (error) {
            console.error("데이터 로드 실패:", error);
        } finally {
            setLoading(false); // 로딩 끝
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

    // 검색 함수 (API 연동)
    const handleSearch = async (keyword) => {
        try {
            setSearchResult(null); // 이전 결과 지우기
            const result = await searchStock(keyword); // API 호출
            setSearchResult(result);
        } catch (error) {
            alert(error.message);
        }
    };

    // 추가 함수 (API 연동)
    const handleAddStock = async (stock) => {
        if (myStocks.some(item => item.code === stock.code)) {
            alert("이미 등록된 종목입니다.");
            return;
        }

        // 1. API에 저장 요청
        await addMyStock(stock);

        // 2. 검색 결과 닫기
        setSearchResult(null);

        // 3. 목록 다시 불러오기 (최신화)
        loadMyStocks();
    };

    // 삭제 함수 (API 연동)
    const handleDeleteStock = async (code) => {
        if (confirm("삭제하시겠습니까?")) {
            await deleteMyStock(code); // API에 삭제 요청
            loadMyStocks(); // 목록 다시 불러오기 (최신화)
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
                    {/* props 이름이 handleSearch 로 바뀐 것 주의! */}
                    <StockRetrieve onSearch={handleSearch} />

                    {searchResult && (
                        <RetrievedStock
                            stock={searchResult}
                            onAdd={handleAddStock}
                        />
                    )}

                    <div className={styles.userStockArea}>
                        <h3 className={styles.listTitle}>내 주식 리스트 ({myStocks.length})</h3>

                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                                데이터 불러오는 중... ⏳
                            </div>
                        ) : myStocks.length === 0 ? (

                            /* ★ 여기가 바로 [주식이 없을 때] 보여주는 부분입니다 ★ */
                            <div className={styles.stockListPlaceholder}>
                                <p style={{ fontSize: '3rem', margin: '0 0 10px 0' }}>📂</p>
                                <strong>아직 관리 중인 주식이 없네요!</strong>
                                <p style={{ marginTop: '8px', color: '#666' }}>
                                    위 검색창에서 관심 있는 종목을 찾아<br />
                                    나만의 포트폴리오를 만들어보세요.
                                </p>
                            </div>

                        ) : (
                            /* 주식이 있을 때는 리스트를 보여줌 */
                            <div className={styles.stockList}>
                                {myStocks.map((stock, index) => (
                                    <UserStock
                                        key={index}
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