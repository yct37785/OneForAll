@echo off
setlocal

pushd "%~dp0"

call "..\OneForAll\templates\scripts\build-release-aab.bat"
set "ERR=%ERRORLEVEL%"

popd
endlocal

exit /b %ERR%