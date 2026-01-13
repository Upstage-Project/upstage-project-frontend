// src/api/chatApi.js

/**
 * [채팅 API 구조]
 * 1. getChatHistory: 과거 채팅 기록 불러오기
 * 2. sendChatMessage: 내 질문 보내고 AI 답변 받기
 * 3. clearChatHistory: 대화 내용 초기화
 */

// 로컬 스토리지 키 (나중에는 DB에서 가져오므로 필요 없음)
const STORAGE_KEY = 'finmate_chat_history';

// 1. 채팅 기록 가져오기 (가짜 API)
export const getChatHistory = async () => {
  return new Promise((resolve) => {
    console.log("[API] 채팅 기록 로딩 중...");
    
    setTimeout(() => {
      // 로컬 스토리지에서 불러오기
      const saved = localStorage.getItem(STORAGE_KEY);
      // 없으면 기본 인사말 하나 넣어주기
      const initialData = saved ? JSON.parse(saved) : [
        { 
          id: Date.now(), 
          role: 'assistant', // AI는 보통 'assistant'라고 칭함
          content: '안녕하세요! 저는 FinMate AI입니다. 종목 분석을 도와드릴까요?',
          timestamp: new Date().toISOString()
        }
      ];
      resolve(initialData);
    }, 500); // 0.5초 로딩 시뮬레이션
  });
};

// 2. 메시지 전송 & AI 응답 받기 (핵심 가짜 API)
export const sendChatMessage = async (userMessage) => {
  return new Promise((resolve) => {
    console.log(`[API] 메시지 전송: ${userMessage}`);

    // (1) 먼저 사용자의 메시지를 로컬 스토리지에 저장 (실제론 백엔드가 함)
    const history = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const newHistory = [
      ...history, 
      { 
        id: Date.now(), 
        role: 'user', 
        content: userMessage,
        timestamp: new Date().toISOString()
      }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));

    // (2) AI가 생각하는 시간 (1.5초 딜레이)
    setTimeout(() => {
      // (3) 가짜 AI 답변 생성
      let aiResponseText = "죄송해요, 아직 백엔드와 연결되지 않아서 잘 모르겠어요 😅";
      
      if (userMessage.includes("삼성전자")) {
        aiResponseText = "삼성전자는 현재 반도체 업황 개선 기대감으로 상승 추세입니다. 목표가는 9만원으로 예상됩니다.";
      } else if (userMessage.includes("안녕")) {
        aiResponseText = "안녕하세요! 오늘 주식 시장 분위기가 참 좋네요.";
      } else if (userMessage.includes("추천")) {
        aiResponseText = "현재 저평가된 우량주 위주로 포트폴리오를 구성하는 것을 추천드립니다.";
      }

      // (4) AI 답변 객체 생성
      const aiResponse = {
        id: Date.now() + 1,
        role: 'assistant',
        content: aiResponseText,
        timestamp: new Date().toISOString()
      };

      // (5) AI 답변도 저장
      newHistory.push(aiResponse);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));

      // (6) 결과 반환 (프론트엔드는 이 데이터만 받아서 화면에 그림)
      resolve(aiResponse);
      
    }, 1500); // 1.5초 뒤에 답변 옴
  });
};

// 3. 대화 내용 초기화 (가짜 API)
export const clearChatHistory = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      localStorage.removeItem(STORAGE_KEY);
      resolve({ success: true, message: "대화 내용이 초기화되었습니다." });
    }, 300);
  });
};