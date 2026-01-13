// src/api/stockApi.js

// ★ 실제 백엔드가 나오면 이 부분만 axios로 바꾸면 됩니다.
// 지금은 setTimeout을 써서 "서버랑 통신하는 척" 흉내를 냅니다.

// 1. 주식 검색 (가짜 API)
export const searchStock = async (keyword) => {
    return new Promise((resolve, reject) => {
      console.log(`[API] '${keyword}' 검색 중...`);
      
      setTimeout(() => {
        // 30% 확률로 검색 실패(에러) 테스트
        if (!keyword) {
          reject(new Error("검색어를 입력해주세요."));
          return;
        }
  
        // 성공 시 가짜 데이터 반환
        resolve({
          name: keyword,
          code: Math.floor(Math.random() * 1000000).toString().padStart(6, '0'), // 랜덤 종목코드
          price: Math.floor(Math.random() * 100000) + 1000, // 랜덤 가격
          change: (Math.random() * 10 - 5).toFixed(2), // 랜덤 등락률
          id: Date.now()
        });
      }, 500); // 0.5초 뒤에 응답 옴 (네트워크 지연 시뮬레이션)
    });
  };
  
  // 2. 내 주식 목록 가져오기 (가짜 API)
  export const getMyStocks = async () => {
    return new Promise((resolve) => {
      console.log("[API] 내 주식 리스트 불러오는 중...");
      
      setTimeout(() => {
        // 로컬 스토리지에 저장된 게 있으면 그거 주고, 없으면 빈 배열
        // (실제로는 백엔드 DB에서 가져올 데이터입니다)
        const saved = localStorage.getItem('myStocks');
        const data = saved ? JSON.parse(saved) : [];
        resolve(data);
      }, 800); // 0.8초 로딩
    });
  };
  
  // 3. 주식 추가하기 (가짜 API)
  export const addMyStock = async (stock) => {
    return new Promise((resolve) => {
      console.log("[API] 주식 추가 요청:", stock);
      
      setTimeout(() => {
        // 실제로는 백엔드 DB에 저장 요청을 보냄
        // 지금은 로컬 스토리지에 저장하는 척 함
        const current = JSON.parse(localStorage.getItem('myStocks') || "[]");
        const updated = [...current, stock];
        localStorage.setItem('myStocks', JSON.stringify(updated));
        
        resolve({ success: true, message: "저장되었습니다." });
      }, 500);
    });
  };
  
  // 4. 주식 삭제하기 (가짜 API)
  export const deleteMyStock = async (code) => {
    return new Promise((resolve) => {
      console.log("[API] 주식 삭제 요청:", code);
      
      setTimeout(() => {
        const current = JSON.parse(localStorage.getItem('myStocks') || "[]");
        const updated = current.filter(s => s.code !== code);
        localStorage.setItem('myStocks', JSON.stringify(updated));
        
        resolve({ success: true, message: "삭제되었습니다." });
      }, 500);
    });
  };