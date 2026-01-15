import client from './client';

/**
 * [2.1 Health Check]
 * 에이전트 서버가 살아있는지 확인합니다.
 * URL: GET /agent/health
 * Auth: 불필요 (하지만 client가 토큰 있으면 보냄, 문제없음)
 */
export const checkAgentHealth = async () => {
  try {
    const response = await client.get('/api/agent/health');
    return response.data; 
    // 예상 응답: { status: "healthy", message: "..." }
  } catch (error) {
    console.error('에이전트 헬스 체크 실패:', error);
    throw error;
  }
};

/**
 * [2.2 Agent Chat (동기 방식)]
 * 사용자의 질문을 보내고, AI의 분석이 끝날 때까지 기다렸다가 답변을 받습니다.
 * URL: POST /agent/chat
 * Auth: 필수 (client.js가 자동으로 처리)
 * * @param {string} query - 사용자 질문 (예: "삼성전자 분석해줘")
 */
export const sendAgentChat = async (query) => {
  try {
    // 명세서 권장사항: Timeout 60초 이상
    // LLM 분석은 오래 걸리므로 3분(180000ms) 정도로 넉넉하게 설정합니다.
    const response = await client.post(
      '/api/agent/chat', 
      { 
        query: query 
      },
    );

    // 명세서에 따르면 200 OK라도 process_status가 'error'일 수 있음
    if (response.data.process_status === 'error') {
      throw new Error(response.data.answer || "에이전트 처리 중 오류 발생");
    }

    return response.data;
    /* 예상 응답 구조:
      {
        answer: "분석 결과...",
        user_query: "질문 원본",
        process_status: "completed",
        loop_count: 3
      }
    */
  } catch (error) {
    // 타임아웃 에러 (ECONNABORTED) 처리
    if (error.code === 'ECONNABORTED') {
      console.error('응답 시간 초과 (Timeout)');
      throw new Error("분석 시간이 너무 오래 걸려 연결이 종료되었습니다.");
    }
    console.error('에이전트 채팅 실패:', error);
    throw error;
  }
};