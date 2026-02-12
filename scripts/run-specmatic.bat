@echo off
echo Running Specmatic Async Contract Tests...

cd ..

docker run --rm ^
  --network specmatic-network ^
  -v "%cd%\specmatic.yaml:/usr/src/app/specmatic.yaml" ^
  -v "%cd%\spec:/usr/src/app/spec" ^
  -v "%cd%\spec_overlay.yaml:/usr/src/app/spec_overlay.yaml" ^
  -v "%cd%\examples:/usr/src/app/examples" ^
  -v "%cd%\build:/usr/src/app/build" ^
  specmatic/specmatic-async test ^
  --overlay=/usr/src/app/spec_overlay.yaml ^
  --examples=/usr/src/app/examples

set TIMESTAMP=%date:~-4%%date:~-7,2%%date:~-10,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set TIMESTAMP=%TIMESTAMP: =0%
set HISTORY_DIR=build\history\%TIMESTAMP%
mkdir "%HISTORY_DIR%" 2>nul
xcopy "build\reports" "%HISTORY_DIR%\reports\" /E /I /Q >nul 2>nul
echo Report saved to %HISTORY_DIR%

echo Done.
