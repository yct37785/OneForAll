@echo off
echo ================================
echo Building Android Release AAB...
echo ================================

REM Check if android folder exists
if not exist android (
    echo ERROR: android folder not found.
    echo Run: npx expo prebuild -p android
    pause
    exit /b 1
)

REM Move into android folder
cd android

REM Clean previous build (optional but recommended)
echo Cleaning previous build...
call gradlew clean

REM Build release AAB
echo Building release bundle...
call gradlew bundleRelease

REM Check if build succeeded
if exist app\build\outputs\bundle\release\app-release.aab (
    echo.
    echo ================================
    echo SUCCESS! AAB generated at:
    echo android\app\build\outputs\bundle\release\app-release.aab
    echo ================================
) else (
    echo.
    echo Build failed. Check errors above.
)

pause
