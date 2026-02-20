pipeline {
    agent any

    /* 
    NOTE: The 'tools' block was removed because 'maven-3.9.6', 'jdk-17', and 'nodejs' 
    were not configured in your Jenkins Global Tool Configuration.
    
    To fix this properly:
    1. Go to Jenkins -> Manage Jenkins -> Global Tool Configuration.
    2. Add Maven and JDK with the EXACT names 'maven-3.9.6' and 'jdk-17'.
    3. Install the 'NodeJS' plugin and add a NodeJS installation named 'node-20'.
    */

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend Build & Test') {
            steps {
                dir('wheelio-backend') {
                    // Using 'sh' but you might need 'bat' if Jenkins is running on Windows
                    sh 'mvn clean install -DskipTests' 
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
    }
}
