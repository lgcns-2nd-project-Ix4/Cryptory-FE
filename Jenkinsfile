pipeline {
    agent any

    environment {
        AWS_REGION = 'ap-northeast-1'
        IMAGE_NAME = 'react-frontend'
        ECR_REGISTRY = '050314037804.dkr.ecr.ap-northeast-1.amazonaws.com'
        ECR_REPO = "${ECR_REGISTRY}/ix4-frontend"

        // 빌드에 넘겨줄 환경 변수 값 
        VITE_REST_API_HOST = credentials('VITE_REST_API_HOST')
        VITE_REST_API_PORT = credentials('VITE_REST_API_PORT')
        VITE_GPT_API_PORT = credentials('VITE_GPT_API_PORT')

        VITE_KAKAO_CLIENT_ID = credentials('VITE_KAKAO_CLIENT_ID')
        VITE_KAKAO_SECRET = credentials('VITE_KAKAO_SECRET')
        VITE_NAVER_CLIENT_ID = credentials('VITE_NAVER_CLIENT_ID')
        VITE_NAVER_SECRET = credentials('VITE_NAVER_SECRET')
        VITE_OPENAI_API_KEY = credentials('VITE_OPENAI_API_KEY')
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/lgcns-2nd-project-Ix4/Cryptory-FE.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh """
                    docker build \
                    --build-arg VITE_REST_API_HOST=${VITE_REST_API_HOST} \
                    --build-arg VITE_REST_API_PORT=${VITE_REST_API_PORT} \
                    --build-arg VITE_GPT_API_PORT=${VITE_GPT_API_PORT} \
                    --build-arg VITE_KAKAO_CLIENT_ID=${VITE_KAKAO_CLIENT_ID} \
                    --build-arg VITE_KAKAO_SECRET=${VITE_KAKAO_SECRET} \
                    --build-arg VITE_NAVER_CLIENT_ID=${VITE_NAVER_CLIENT_ID} \
                    --build-arg VITE_NAVER_SECRET=${VITE_NAVER_SECRET} \
                    --build-arg VITE_OPENAI_API_KEY=${VITE_OPENAI_API_KEY} \
                    -t $IMAGE_NAME .

                    docker tag $IMAGE_NAME:latest $ECR_REPO:latest
                """
            }
        }

        stage('Login to ECR') {
            steps {
                sh 'aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REGISTRY'
            }
        }

        stage('Push Docker Image') {
            steps {
                sh 'docker push $ECR_REPO:latest'
            }
        }
    }
}