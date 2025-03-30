pipeline {
    agent any

    environment {
        AWS_REGION = 'ap-northeast-1'

        // 빌드에 넘겨줄 환경 변수 값 
        VITE_REST_API_HOST = credentials('VITE_REST_API_HOST')
        VITE_REST_API_PORT = credentials('VITE_REST_API_PORT')
        VITE_GPT_API_PORT = credentials('VITE_GPT_API_PORT')
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