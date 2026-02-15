@echo off
setlocal

pushd "%~dp0"

call npm install
set ERR=%ERRORLEVEL%

echo.
if %ERR% neq 0 (
  echo [install] FAILED with exit code %ERR%.
) else (
  echo [install] Finished successfully.
)

endlocal
pause
