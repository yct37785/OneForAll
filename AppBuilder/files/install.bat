@echo off
setlocal

pushd "%~dp0"

REM Run cross-platform setup (sync first, then install)
call npm run setup
set ERR=%ERRORLEVEL%

echo.
if %ERR% neq 0 (
  echo [install] FAILED with exit code %ERR%.
) else (
  echo [install] Finished successfully.
)

endlocal
pause
