import client from './client';

/**
 * [⑤ 종목 검색]
 * 키워드로 주식 종목을 검색합니다.
 * URL: GET /user-stock/stocks/search
 * Param: q (예: ?q=삼성)
 */
export const searchStock = async (keyword) => {
  try {
    const response = await client.get('/api/user-stock/stocks/search', {
      params: { q: keyword } // 명세서에 따라 query param 이름을 'q'로 설정
    });
    
    // 주의: 명세서에 따르면 응답은 'List'(배열) 형태입니다.
    // 예: [{ stock_id: "005930", stock_name: "삼성전자" }, ...]
    return response.data; 
  } catch (error) {
    console.error('검색 실패:', error);
    throw error;
  }
};

/**
 * [④ 전체 종목 리스트 조회] (필요 시 사용)
 * URL: GET /user-stock/stocks
 */
export const getAllStocks = async () => {
  try {
    const response = await client.get('/api/user-stock/stocks');
    return response.data;
  } catch (error) {
    console.error('전체 종목 조회 실패:', error);
    throw error;
  }
};

/**
 * [② 내 포트폴리오 목록 조회]
 * URL: GET /user-stock/items
 */
export const getMyStocks = async () => {
  try {
    const response = await client.get('/api/user-stock/items');
    return response.data;
  } catch (error) {
    console.error('포트폴리오 조회 실패:', error);
    throw error;
  }
};

/**
 * [① 내 포트폴리오에 종목 추가]
 * URL: POST /user-stock/items
 * Body: { identifier: "..." }
 */
export const addMyStock = async (stock) => {
  try {
    // UserInfo.jsx에서 넘겨준 stock 객체에서 식별자(코드 또는 이름)를 추출
    // 백엔드가 주는 데이터 필드명에 맞춰서 수정이 필요할 수 있습니다.
    // (예: stock.stock_id 또는 stock.code)
    const identifier = stock.stock_id || stock.code || stock.stock_name; 

    const response = await client.post('/api/user-stock/items', {
      identifier: identifier
    });
    return response.data;
  } catch (error) {
    console.error('종목 추가 실패:', error);
    throw error;
  }
};

/**
 * [③ 내 포트폴리오에서 종목 삭제]
 * URL: DELETE /user-stock/items
 * Param: identifier
 */
export const deleteMyStock = async (code) => {
  try {
    const response = await client.delete('/api/user-stock/items', {
      params: { identifier: code } 
    });
    return response.data;
  } catch (error) {
    console.error('종목 삭제 실패:', error);
    throw error;
  }
};