pipeline {
    agent any

    options {
        // Handle checkout manually to inject git configs and retries
        skipDefaultCheckout()
        timeout(time: 30, unit: 'MINUTES')
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    // Resolve 'curl 18 transfer closed' by increasing Git buffer
                    // Using 'bat' because Jenkins is detected to be running on Windows
                    bat 'git config --global http.postBuffer 1048576000'
                    bat 'git config --global http.lowSpeedLimit 0'
                    bat 'git config --global http.lowSpeedTime 999999'
                    
                    retry(3) {
                        checkout scm
                    }
                }
            }
        }

        stage('Backend Build') {
            steps {
                dir('wheelio-backend') {
                    // Using 'bat' for Windows environment
                    bat 'mvn clean install -DskipTests'
                }
            }
        }

        stage('Frontend Build') {
            steps {
                dir('frontend') {
                    bat 'npm install'
                    bat 'npm run build'
                }
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
            // Only clean if workspace exists to avoid context errors
            script {
                try {
                    cleanWs()
                } catch (e) {
                    echo "Skipping workspace cleanup: ${e.message}"
                }
            }
        }
    }
}
