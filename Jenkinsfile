pipeline {
    agent none

    environment {
        GIT_REPO = 'https://github.com/thestackly/stackly-hms.git'
        BRANCH = 'main'
        DEPLOY_USER = 'ubuntu'
        DEPLOY_HOST = '3.133.64.23'
        DEPLOY_SSH = 'hms-ec2-deploy-key'

        REMOTE_BASE = '/home/ubuntu/stackly-hms'
        FRONTEND_DIR = "${REMOTE_BASE}/hms_frontend"
        FASTAPI_DIR = "${REMOTE_BASE}/Fastapi_app"
        FRONTEND_BUILD = 'dist'

        DB_NAME = 'hms_database'
        DB_USER = 'admin'
        DB_PASSWORD = 'StacklyDB2026'
        DB_HOST = 'hms-prod-database.c54840ii8psl.us-east-2.rds.amazonaws.com'
        DB_PORT = '3306'

        EMAIL_RECIPIENTS = 'awsdevops@thestackly.com, pavanb@thestackly.com, uday@thestackly.com, prakashraj@thestackly.com, thummalajayanth@thestackly.com, guntur@thestackly.com, yarramallamaheshbabu@thestackly.com, nndinesh@thestackly.com, muruganps@thestackly.com'
    }

    stages {

        stage('Checkout Code') {
            agent { label 'Website' }
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: "*/${BRANCH}"]],
                    userRemoteConfigs: [[url: "${GIT_REPO}", credentialsId: 'github-token-hms']]
                ])
            }
        }

        stage('Build Frontend') {
            agent { label 'Website' }
            environment {
                VITE_API_BASE_URL = 'https://hms.stacklycloud.com/api'
            }
            steps {
                dir('hms_frontend') {
                    sh '''
                      set -e
                      echo "🔧 Node version:"
                      node -v
                      npm -v

                      echo "🌐 API Base URL: $VITE_API_BASE_URL"

                      echo "📦 Installing dependencies..."
                      npm ci --no-audit --no-fund

                      echo "🏗️ Building frontend..."
                      npm run build
                    '''
                }
            }
        }

        stage('Deploy & Migrate') {
            agent { label 'Website' }
            steps {
                sshagent (credentials: ["${DEPLOY_SSH}"]) {
                    sh """
                        set -e
                        echo "🚀 Syncing project files to EC2..."
                        ssh -o StrictHostKeyChecking=no ${DEPLOY_USER}@${DEPLOY_HOST} 'mkdir -p ${REMOTE_BASE}'
                        rsync -az \
                          --exclude='.venv' \
                          --exclude='__pycache__' \
                          --exclude='node_modules' \
                          --exclude='staticfiles' \
                          ./ ${DEPLOY_USER}@${DEPLOY_HOST}:${REMOTE_BASE}/

                        echo "⚙️ Running backend setup & migrations..."
                        ssh -o StrictHostKeyChecking=no ${DEPLOY_USER}@${DEPLOY_HOST} <<'ENDSSH'
                          set -e
                          cd ${REMOTE_BASE}

                          if [ ! -d ".venv" ]; then
                            python3 -m venv .venv
                          fi

                          source .venv/bin/activate
                          pip install --upgrade pip setuptools wheel
                          pip install -r requirement.txt

                          echo "🚀 Applying Django migrations..."
                          python manage.py migrate
ENDSSH
                    """
                }
            }
        }

        stage('Restart Services') {
            agent { label 'Website' }
            steps {
                sshagent (credentials: ["${DEPLOY_SSH}"]) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ${DEPLOY_USER}@${DEPLOY_HOST} <<ENDSSH
                          set -e

                          echo "[1/3] Deploying Frontend..."
                          sudo rm -rf /var/www/html/*
                          sudo cp -r ${FRONTEND_DIR}/${FRONTEND_BUILD}/* /var/www/html/
                          sudo chown -R www-data:www-data /var/www/html/

                          echo "🔁 Restarting backend services..."
                          sudo systemctl daemon-reload
                          sudo nginx -t
                          sudo systemctl restart nginx
                          sudo systemctl restart fastapi.service

                          echo "✅ Deployment Complete — FastAPI (8000) + NGINX (443)"
ENDSSH
                    """
                }
            }
        }
    }

    post {
        success {
            emailext(
                subject: "✅ HMS Deployment SUCCESS on ${DEPLOY_HOST}",
                to: "${EMAIL_RECIPIENTS}",
                body: "Deployment completed successfully at ${new Date()}"
            )
        }
        failure {
            emailext(
                subject: "❌ HMS Deployment FAILED on ${DEPLOY_HOST}",
                to: "${EMAIL_RECIPIENTS}",
                body: "Deployment failed. Check Jenkins logs."
            )
        }
    }
}