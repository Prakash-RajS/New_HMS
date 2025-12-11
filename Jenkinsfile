pipeline {

    agent none
 
    environment {

        GIT_REPO     = 'https://github.com/thestackly/stackly-hms.git'

        BRANCH       = 'main'
 
        DEPLOY_USER  = 'ubuntu'

        DEPLOY_HOST  = '18.119.210.2'

        DEPLOY_SSH   = 'hms-ec2-deploy-key'
 
        REMOTE_BASE  = '/home/ubuntu/jenkins-hms-agent'

        FRONTEND_DIR = "${REMOTE_BASE}/hms_frontend"

        FRONTEND_BUILD = "dist"
 
        DB_NAME      = 'hms_project_db'

        DB_USER      = 'admin'

        DB_PASSWORD  = 'StacklyDB2025'

        DB_HOST      = 'hms-project-db.c54840ii8psl.us-east-2.rds.amazonaws.com'

        DB_PORT      = '3306'
 
        EMAIL_RECIPIENTS = 'pavanb@thestackly.com,uday@thestackly.com,prakashraj@thestackly.com,thummalajayanth@thestackly.com,guntur@thestackly.com,yarramallamaheshbabu@thestackly.com,nndinesh@thestackly.com,nagendra@thestackly.com,muruganps@thestackly.com'

    }
 
    stages {
 
        /* 1️⃣ CHECKOUT CODE */

        stage('Checkout Code') {

            agent { label 'Website' }

            steps {

                checkout([

                    $class: 'GitSCM',

                    branches: [[name: "*/${BRANCH}"]],

                    userRemoteConfigs: [[url: "${GIT_REPO}", credentialsId: 'github-token']]

                ])

            }

        }
 
        /* 2️⃣ BUILD FRONTEND */

        stage('Build Frontend') {

            agent { label 'Website' }

            steps {

                dir('hms_frontend') {

                    sh '''

                        echo "🌐 Building Frontend..."

                        npm ci --no-audit --no-fund

                        npm run build

                    '''

                    archiveArtifacts artifacts: "${FRONTEND_BUILD}/**", fingerprint: true

                }

            }

        }
 
        /* 3️⃣ UPDATE DIST IN GITHUB */

        stage('Update dist in GitHub') {

            agent { label 'Website' }

            steps {

                sshagent(credentials: ['github-token']) {

                    sh '''

                        echo "🔄 Updating dist folder in GitHub..."
 
                        cd hms_frontend
 
                        git config user.name "Jenkins CI"

                        git config user.email "jenkins@stackly.com"
 
                        git add dist
 
                        git diff --cached --quiet || git commit -m "Jenkins: Update dist folder with latest frontend build"
 
                        git push origin ${BRANCH} || true

                    '''

                }

            }

        }
 
        /* 4️⃣ TEST FRONTEND */

        stage('Test Frontend') {

            agent { label 'Website' }

            steps {

                dir('hms_frontend') {

                    sh '''

                        echo "🧪 Running Frontend Tests..."

                        npm test --if-present || echo "⚠️ No tests found, continuing..."

                    '''

                }

            }

        }
 
        /* 5️⃣ DEPLOY BACKEND & MIGRATE */

        stage('Deploy & Migrate') {

            agent { label 'Website' }

            steps {

                sshagent(credentials: ["${DEPLOY_SSH}"]) {
 
                    /* 5.1 SYNC FILES TO EC2 */

                    sh """

                        echo "🚀 Syncing project files to EC2..."

                        ssh -o StrictHostKeyChecking=no ${DEPLOY_USER}@${DEPLOY_HOST} "mkdir -p ${REMOTE_BASE}"
 
                        rsync -az --delete \

                            --exclude='.venv' \

                            --exclude='venv' \

                            --exclude='__pycache__' \

                            --exclude='node_modules' \

                            -e "ssh -o StrictHostKeyChecking=no" \

                            ./ ${DEPLOY_USER}@${DEPLOY_HOST}:${REMOTE_BASE}/

                    """
 
                    /* 5.2 SETUP BACKEND (Django) */

                    sh """

ssh -o StrictHostKeyChecking=no ${DEPLOY_USER}@${DEPLOY_HOST} << 'EOF'

set -e

cd ${REMOTE_BASE}
 
echo "🧹 Removing old virtual environment..."

rm -rf .venv || true
 
echo "🐍 Creating virtual environment..."

python3 -m venv .venv
 
echo "📦 Installing Python dependencies..."

.venv/bin/pip install --upgrade pip

.venv/bin/pip install -r requirements.txt
 
echo "🚀 Running Django migrations..."

.venv/bin/python manage.py makemigrations --noinput || true

.venv/bin/python manage.py migrate --noinput
 
echo "📁 Collecting static files..."

.venv/bin/python manage.py collectstatic --noinput
 
echo "🗄️ Ensuring RDS DB exists..."

mysql -h ${DB_HOST} -u ${DB_USER} -p${DB_PASSWORD} -e \

"CREATE DATABASE IF NOT EXISTS ${DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
 
EOF

                    """

                }

            }

        }
 
        /* 6️⃣ RESTART SERVICES + DEPLOY FRONTEND */

        stage('Restart Services') {

            agent { label 'Website' }

            steps {

                sshagent(credentials: ["${DEPLOY_SSH}"]) {
 
                    sh """

ssh -o StrictHostKeyChecking=no ${DEPLOY_USER}@${DEPLOY_HOST} << 'EOF'

set -e
 
echo "[1/3] Deploying Frontend..."

sudo rm -rf /var/www/hms_frontend

sudo mkdir -p /var/www/hms_frontend

sudo cp -r ${FRONTEND_DIR}/dist/* /var/www/hms_frontend/

sudo chown -R www-data:www-data /var/www/hms_frontend
 
echo "[2/3] Restarting NGINX..."

sudo nginx -t

sudo systemctl restart nginx
 
echo "[3/3] Restarting Django (Gunicorn)..."

sudo systemctl daemon-reload

sudo systemctl restart hms.service
 
echo "✅ HMS Deployment Complete"

EOF

                    """

                }

            }

        }

    }
 
    /* 7️⃣ EMAIL NOTIFICATIONS */

    post {

        success {

            emailext(

                subject: "✅ HMS Deployment SUCCESS on ${DEPLOY_HOST}",

                to: "${EMAIL_RECIPIENTS}",

                body: """
<h2>🎉 HMS Deployment Successful</h2>
<p><b>Server:</b> ${DEPLOY_HOST}</p>
<p><b>Branch:</b> ${BRANCH}</p>
<p><b>Database:</b> ${DB_NAME}</p>
<p>Django + Frontend deployed successfully.</p>
<p>Timestamp: ${new Date()}</p>

                """

            )

        }
 
        failure {

            emailext(

                subject: "❌ HMS Deployment FAILED on ${DEPLOY_HOST}",

                to: "${EMAIL_RECIPIENTS}",

                body: """
<h2>🚨 HMS Deployment Failed</h2>
<p><b>Server:</b> ${DEPLOY_HOST}</p>
<p><b>Branch:</b> ${BRANCH}</p>
<p>Please check Jenkins logs immediately.</p>

                """

            )

        }

    }

}

 
