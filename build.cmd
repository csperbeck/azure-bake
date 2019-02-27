call npm ls --global --depth=0
if %ERRORLEVEL% == 0 (    
    call npm ls lerna --global --depth=0 | findstr /i lerna
    if %ERRORLEVEL% == 1 (
        call npm run clean:build
        if %ERRORLEVEL% == 0 echo The Azure-Bake Project has built successfully with LERNA
    ) else (
        call npm run preinstall && npm run clean:build 
        if %ERRORLEVEL% == 0 echo The Azure-Bake Project has installed necessary tools and built successfully with LERNA.
    )
) else ( echo "Please download and install NPM from https://nodejs.org/en/" )
