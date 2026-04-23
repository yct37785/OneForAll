@echo off
setlocal

pushd "%~dp0"

set "CLEAN_INSTALL="

call "..\OneForAll\templates\scripts\run-android-dev.bat"

popd
endlocal
