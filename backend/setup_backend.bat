@echo off
echo Setting up HireHerHands Flask environment...

REM Check Python is installed
python --version >nul 2>&1
IF ERRORLEVEL 1 (
    echo [ERROR] Python is not installed or not added to PATH.
    pause
    exit /b
)

REM Create virtual environment
echo Creating virtual environment...
python -m venv venv

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate

REM Upgrade pip
echo Upgrading pip...
python -m pip install --upgrade pip

REM Install dependencies
echo Installing dependencies...
IF EXIST requirements.txt (
    pip install -r requirements.txt
) ELSE (
    echo [ERROR] requirements.txt not found.
    pause
    exit /b
)

REM Check if .env exists
IF NOT EXIST .env (
    echo Creating .env file...
    echo DATABASE_URL=postgresql://postgres:your_password@localhost:5432/hireherhands>>.env
    echo JWT_SECRET_KEY=super-secret>>.env
    echo ALLOWED_ADMIN_EMAILS=admin@example.com>>.env
) ELSE (
    echo .env file already exists.
)

REM Run migrations
echo Running database migrations...
flask db upgrade

REM Start Flask server
echo Starting Flask server...
python app.py

pause
