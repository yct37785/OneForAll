@echo off
setlocal

echo ==========================================
echo Expo Android Build Script
echo CLEAN_INSTALL=%CLEAN_INSTALL%
echo ==========================================
echo.

REM ------------------------------------------
REM Step 1 - CLEAN INSTALL (optional)
REM ------------------------------------------
if /I "%CLEAN_INSTALL%"=="true" (
    goto :do_clean_install
) else (
    echo [1/2] CLEAN_INSTALL not set to "true" ^(skipping clean prebuild step^).
    goto :do_build
)

:do_clean_install
echo [1/2] CLEAN_INSTALL=true ^> Performing full clean prebuild...
echo    - Removing android folder...
if exist "android" (
    rmdir /S /Q "android"
    echo      android folder removed.
) else (
    echo      android folder not found, skipping.
)

echo    - Removing .expo folder...
if exist ".expo" (
    rmdir /S /Q ".expo"
    echo      .expo folder removed.
) else (
    echo      .expo folder not found, skipping.
)

echo    - Running expo prebuild...
set "CI=1"
call npx expo prebuild -p android --clean
set "CI="
if errorlevel 1 (
    echo [x] Prebuild failed
    exit /b 1
)
echo.

REM After clean step, continue to build
goto :do_build

REM ------------------------------------------
REM Step 2 - BUILD & INSTALL
REM ------------------------------------------
:do_build
echo [2/2] Building ^& installing ^(Metro will start automatically^)...
REM IMPORTANT: do NOT set CI here, so Metro starts normally

REM npx expo run:android --variant debug
npx expo run:android --variant debugOptimized
if errorlevel 1 (
    echo [x] Build/install failed
    exit /b 1
)

echo.
echo [DONE] Build complete.
echo.

endlocal
pause
