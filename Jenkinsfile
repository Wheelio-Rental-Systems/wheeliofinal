pipeline {
    agent any

    tools {
        maven 'maven-3.9.6'
        jdk 'jdk-17'
        nodejs 'node-20'
    }

    environment {
        DOCKER_CREDENTIALS_ID = 'docker-hub-credentials'
        GIT_CREDENTIALS_ID = 'github-credentials'
        // SVN_CREDENTIALS_ID = 'svn-credentials'
    }

    stages {
        stage('Checkout') {
            steps {
                // Default: Git (based on your recent push)
                checkout scm

                /* 
                // SVN EXAMPLE: If you switch to SVN, use this instead:
                checkout([$class: 'SubversionSCM', 
                    locations: [[credentialsId: "${SVN_CREDENTIALS_ID}", 
                    remote: "https://your-svn-repo-url/trunk"]], 
                    workspaceUpdater: [$class: 'UpdateUpdater']])
                */
            }
        }

        stage('Backend Build & Test') {
            steps {
                dir('wheelio-backend') {
                    sh 'mvn clean install'
                }
            }
        }

        stage('Frontend Build') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Docker Build (Optional)') {
            when {
                branch 'main'
            }
            steps {
                sh 'docker-compose build'
            }
        }

        stage('Archive Artifacts') {
            steps {
                archiveArtifacts artifacts: 'wheelio-backend/target/*.jar', fingerprint: true
                archiveArtifacts artifacts: 'frontend/dist/**/*', allowEmptyArchive: true
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo 'Build Successful!'
        }
        failure {
            echo 'Build Failed! Check logs.'
        }
    }
}
