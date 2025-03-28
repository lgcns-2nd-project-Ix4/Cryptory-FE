#FROM node:23 AS builder
#
#WORKDIR /app
#
## VITE는 빌드할 때 변수를 지정한다고 한다...
#ARG VITE_REST_API_HOST
#ARG VITE_REST_API_PORT
#ARG VITE_GPT_API_PORT
#
#ENV VITE_REST_API_HOST=${VITE_REST_API_HOST}
#ENV VITE_REST_API_PORT=${VITE_REST_API_PORT}
#ENV VITE_GPT_API_PORT=${VITE_GPT_API_PORT}
#
## package.json이랑 package-lock.json 복사해서 의존성 설치(필요한거 가져옴)
#COPY package.json package-lock.json ./
#RUN npm install
#
## 소스 복사
#COPY . .
#RUN npm run build
#
## nginx 통해서 정적 파일
#FROM nginx:stable-alpine
#COPY --from=builder /app/dist /usr/share/nginx/html
#COPY nginx/nginx.conf /etc/nginx/nginx.conf
#
#EXPOSE 80
#
#CMD ["nginx", "-g", "daemon off;"]

FROM node:18-alpine AS builder
WORKDIR /app

# VITE 환경 변수
ARG VITE_REST_API_HOST
ARG VITE_REST_API_PORT
ARG VITE_GPT_API_PORT

ENV VITE_REST_API_HOST=${VITE_REST_API_HOST}
ENV VITE_REST_API_PORT=${VITE_REST_API_PORT}
ENV VITE_GPT_API_PORT=${VITE_GPT_API_PORT}

# 패키지 설치 (esbuild 문제 방지)
COPY package.json package-lock.json ./
RUN npm ci --no-cache --unsafe-perm

# 소스 복사 및 빌드
COPY . .
RUN npm run build

# Nginx로 빌드 결과 복사
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]