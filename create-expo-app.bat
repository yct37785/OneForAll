@echo off
setlocal

echo ================================================
echo Launching OneForAll Expo App Generator
echo ================================================
echo.

node "%~dp0AppBuilder\create-expo-app.cjs"
set EXIT_CODE=%ERRORLEVEL%

if not "%EXIT_CODE%"=="0" (
  echo.
  echo Script failed with exit code %EXIT_CODE%
  exit /b %EXIT_CODE%
)

echo.
echo Script completed successfully.
echo Press any key to close this window...
pause >nul
exit /b 0
