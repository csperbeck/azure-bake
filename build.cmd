call npm ls --global --depth=0
if %ERRORLEVEL% NEQ 0 (
    echo "Please download and install NPM from https://nodejs.org/en/"
) else (
    call npm run preinstall && npm run clean:build
    if NOT %ERRORLEVEL% NEQ 0 (
        echo The Azure-Bake Project has built successfully with LERNA.
    ) else ( 
        echo The Azure-Bake Project failed to build. Please view console and logging errors for additional information.
    )
)
