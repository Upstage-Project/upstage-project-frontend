// src/api/authApi.js
import client from './client';

export const socialLogin = async (provider, idToken) => {
  // 백엔드의 /api/auth/social-login (예시) 엔드포인트로 토큰 전송
  const response = await client.post('/api/auth/login', {
    provider: provider,
    token: idToken
  });
  return response.data; 
};