# 1. Build 단계 (Node 이미지 사용)
FROM node:18-alpine as builder

# 작업 디렉토리 설정
WORKDIR /app

# 의존성 파일 복사 및 설치
COPY package.json package-lock.json ./
RUN npm install

# 소스 코드 복사 및 빌드 (dist 폴더 생성됨)
COPY . .
# docker-compose에서 보낸 값을 받습니다 (ARG)

RUN npm run build

# 2. Production 단계 (Nginx 이미지 사용)
FROM nginx:alpine

# 위에서 만든 nginx 설정 파일을 컨테이너 내부로 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 빌드 단계에서 생성된 dist 폴더의 파일들을 Nginx의 서빙 디렉토리로 복사
COPY --from=builder /app/dist /usr/share/nginx/html

# 80번 포트 노출
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]