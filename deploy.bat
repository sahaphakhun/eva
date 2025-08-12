@echo off
echo 🚀 Starting EvA Cloud deployment to Railway...

REM Check if Railway CLI is installed
railway --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Railway CLI is not installed. Installing...
    npm install -g @railway/cli
)

REM Check if user is logged in
railway whoami >nul 2>&1
if errorlevel 1 (
    echo 🔐 Please login to Railway...
    railway login
)

REM Deploy to Railway
echo 📦 Deploying to Railway...
railway up

echo ✅ Deployment completed!
echo 🌐 Your app should be available at the Railway URL
pause
