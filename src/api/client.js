// src/api/client.js
import axios from 'axios';

// 1. axios 인스턴스 생성 (기본 설정)
const client = axios.create({
  baseURL: 'http://localhost:8000', // FastAPI 백엔드 주소 (보통 8000번)
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. 요청 가로채기 (Interceptors)
// 요청을 보내기 직전에 토큰을 자동으로 헤더에 넣어줍니다.
client.interceptors.request.use((config) => {
  // 나중에 로그인 기능 만들면 'accessToken'에 토큰을 저장할 겁니다.
  const token = localStorage.getItem('accessToken');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 3. 응답 가로채기 (Interceptors) - 선택사항
// 에러가 났을 때 공통적으로 처리할 로직 (예: 토큰 만료시 로그아웃)
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // 인증 에러(401)가 나면 로그아웃 시키기 등의 처리
      console.log('로그인이 필요합니다.');
    }
    return Promise.reject(error);
  }
);

export default client;