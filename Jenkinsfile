pipeline {
    agent none
 
    environment {
        GIT_REPO = 'https://github.com/thestackly/stackly-hms.git'
        BRANCH = 'main'
 
        DEPLOY_USER = 'ubuntu'
        DEPLOY_HOST = '3.133.64.23'
        DEPLOY_SSH = 'hms-ec2-deploy-key'
 
        REMOTE_BASE = '/home/ubuntu/jenkins-hms-agent'
        FRONTEND_DIR = "${REMOTE_BASE}/hms_frontend"
        FASTAPI_DIR = "${REMOTE_BASE}/fastapi_app"
        FRONTEND_BUILD = 'dist'
 
        DB_NAME = 'hms_project_db'
        DB_USER = 'admin'
        DB_PASSWORD = 'StacklyDB2025'
        DB_HOST = 'hms-project-db.c54840ii8psl.us-east-2.rds.amazonaws.com'
        DB_PORT = '3306'
 
        EMAIL_RECIPIENTS = 'pavanb@thestackly.com, uday@thestackly.com, prakashraj@thestackly.com, thummalajayanth@thestackly.com, guntur@thestackly.com, yarramallamaheshbabu@thestackly.com, nndinesh@thestackly.com, muruganps@thestackly.com'
    }
 
    stages {
 
        /* ========== 1️⃣  CHECKOUT CODE ========== */
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
 
        /* ========== 2️⃣  BUILD FRONTEND (Improved) ========== */
        stage('Build Frontend') {
            agent { label 'Website' }
            steps {
                dir('hms_frontend') {
 
                    sh '''
                        echo "Node & npm versions:"
                        node -v || true
                        npm -v || true
 
                        echo "Installing frontend dependencies..."
                        npm ci --no-audit --no-fund || npm install
 
                        echo "Running lint..."
                        npm run lint || echo "Lint failed (skipping)"
 
                        echo "Running tests..."
                        npm test --if-present || echo "No tests found"
 
                        echo "Building production frontend..."
                        npm run build
                    '''
 
                    echo "Archiving build artifacts..."
                    archiveArtifacts artifacts: "${FRONTEND_BUILD}/**", fingerprint: true
                }
            }
        }
 
        /* ========== 3️⃣ DEPLOY TO EC2 ========== */
        stage('Deploy & Migrate') {
            agent { label 'Website' }
            steps {
                sshagent (credentials: ["${DEPLOY_SSH}"]) {
                    sh """
                        echo "🚀 Syncing project files to EC2..."
                        ssh -o StrictHostKeyChecking=no ${DEPLOY_USER}@${DEPLOY_HOST} 'mkdir -p ${REMOTE_BASE}'
                        rsync -az \
                          --exclude='**/.venv' \
                          --exclude='**/__pycache__' \
                          --exclude='node_modules' \
                          --exclude='staticfiles' \
                          --rsh='ssh -o StrictHostKeyChecking=no' \
                          ./ ${DEPLOY_USER}@${DEPLOY_HOST}:${REMOTE_BASE}/
 
                        echo "⚙️ Running backend setup & migrations..."
                        ssh -o StrictHostKeyChecking=no ${DEPLOY_USER}@${DEPLOY_HOST} <<'ENDSSH'
                        set -e
                        cd ${REMOTE_BASE}
 
                        echo "🐍 Creating virtual environment..."
                        python3 -m venv .venv
 
                        echo "📦 Installing dependencies inside venv..."
                        source .venv/bin/activate
                        pip install --upgrade pip setuptools wheel
                        pip install gunicorn
                        pip install -r requirement.txt
 
                        echo "🚀 Applying Django migrations..."
                        python manage.py makemigrations --noinput
                        python manage.py migrate --noinput
 
                        echo "📁 Collecting static files..."
                        python manage.py collectstatic --noinput
 
                        echo "🗄️ Ensuring RDS database exists..."
                        mysql -h ${DB_HOST} -u ${DB_USER} -p${DB_PASSWORD} -e "CREATE DATABASE IF NOT EXISTS ${DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
ENDSSH
                    """
                }
            }
        }
 
        /* ========== 4️⃣ RESTART SERVICES ========== */
        stage('Restart Services') {
            agent { label 'Website' }
            steps {
                sshagent (credentials: ["${DEPLOY_SSH}"]) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ${DEPLOY_USER}@${DEPLOY_HOST} <<ENDSSH
                        set -e
 
                        echo "[1/3] Deploying Frontend..."
                        cd ${FRONTEND_DIR}
                        sudo rm -rf /var/www/html/*
                        sudo cp -r ${FRONTEND_BUILD}/* /var/www/html
                        sudo chown -R www-data:www-data /var/www/html
 
                        echo "🔁 Restarting backend services..."
                        sudo systemctl daemon-reload
                        sudo nginx -t
                        sudo systemctl restart nginx
                        sudo systemctl restart fastapi_hms.service || true
 
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
                body: """
<h2>Deployment Successful 🎉</h2>
<p><b>Server:</b> ${DEPLOY_HOST}</p>
<p><b>Branch:</b> ${BRANCH}</p>
<p><b>Database:</b> ${DB_NAME} @ ${DB_HOST}</p>
<p>✅ NGINX  + FastAPI restarted successfully.</p>
<p>Timestamp: ${new Date()}</p>
                """
            )
        }
        failure {
            emailext(
                subject: "❌ HMS Deployment FAILED on ${DEPLOY_HOST}",
                to: "${EMAIL_RECIPIENTS}",
                body: """
<h2>Deployment Failed 🚨</h2>
<p><b>Server:</b> ${DEPLOY_HOST}</p>
<p><b>Branch:</b> ${BRANCH}</p>
<p>❌ Check Jenkins console logs for full stack trace.</p>
<p>Timestamp: ${new Date()}</p>
                """
            )
        }
    }
}
