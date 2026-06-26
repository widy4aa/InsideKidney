@echo off
echo ===================================
echo   InsideKidney - Local Server
echo ===================================
echo.

:: Try Python (paling umum tersedia)
python --version >nul 2>&1
IF %ERRORLEVEL% == 0 (
    echo Menjalankan InsideKidney server dengan Python...
    echo Buka browser: http://localhost:8000
    echo 3D Explorer: http://localhost:8000/viewer.html
    echo Tekan Ctrl+C untuk berhenti.
    echo.
    python server.py --host 127.0.0.1 --port 8000
    goto :end
)

:: Coba Python3
python3 --version >nul 2>&1
IF %ERRORLEVEL% == 0 (
    echo Menjalankan InsideKidney server dengan Python3...
    echo Buka browser: http://localhost:8000
    echo 3D Explorer: http://localhost:8000/viewer.html
    echo Tekan Ctrl+C untuk berhenti.
    echo.
    python3 server.py --host 127.0.0.1 --port 8000
    goto :end
)

:: Coba Node.js / npx serve
npx --version >nul 2>&1
IF %ERRORLEVEL% == 0 (
    echo Menjalankan server dengan npx serve...
    echo Buka browser: http://localhost:3000
    echo Tekan Ctrl+C untuk berhenti.
    echo.
    npx serve .
    goto :end
)

echo [ERROR] Python atau Node.js tidak ditemukan!
echo Pasang salah satu:
echo   - Python: https://www.python.org/downloads/
echo   - Node.js: https://nodejs.org/
pause

:end
