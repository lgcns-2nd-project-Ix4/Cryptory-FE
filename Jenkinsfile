pipeline {
    agent any

    environment {
        AWS_REGION = 'ap-northeast-1'

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

        stage('Install & Build') {
            steps {
                sh """
                    npm ci

                    # .env.production 파일 생성
                    echo "VITE_REST_API_HOST=${VITE_REST_API_HOST}" > .env.production
                    echo "VITE_REST_API_PORT=${VITE_REST_API_PORT}" >> .env.production
                    echo "VITE_GPT_API_PORT=${VITE_GPT_API_PORT}" >> .env.production
                    echo "VITE_KAKAO_CLIENT_ID=${VITE_KAKAO_CLIENT_ID}" >> .env.production
                    echo "VITE_KAKAO_SECRET=${VITE_KAKAO_SECRET}" >> .env.production
                    echo "VITE_NAVER_CLIENT_ID=${VITE_NAVER_CLIENT_ID}" >> .env.production
                    echo "VITE_NAVER_SECRET=${VITE_NAVER_SECRET}" >> .env.production
                    echo "VITE_OPENAI_API_KEY=${VITE_OPENAI_API_KEY}" >> .env.production

                    # Vite 빌드
                    npm run build
                """
            }
        }

        stage('Upload to S3') {
            steps {
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'AWS-CREDENTIALS'
                ]]) {
                    sh """
                        aws s3 sync dist/ s3://ix4-fe-bucket/ \
                            --region $AWS_REGION \
                            --delete
                    """
                }
            }
        }

    }
}