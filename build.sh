#!/bin/bash

if npm ls --global --depth=0
    then echo "NPM is already installed. Continuing to the build."
    else
    #Install NPM
    n=0
    echo "Installing distribution appropriate NPM package"
    until [ $n -gt 5 ]
    do
        if [ n = 0 ]
            then echo "Attempting NPM install via apt-get" && apt-get update && apt-get npm && break
            n=$[$n+1]
            sleep 2
        fi

        if [ n = 1 ] 
            then echo "Attempting NPM install via apt" && apt update && apt npm && break
            n=$[$n+1]
            sleep 2
        fi

        if [ n = 2 ] 
            then echo "Attempting NPM install via apk" && apk update && apk npm && break
            n=$[$n+1]
            sleep 2
        fi

        if [ n = 3 ] 
            then echo "Attempting NPM install via aptitude" && aptitude update && aptitude npm && break
            n=$[$n+1]
            sleep 2
        fi

        if [ n = 4 ] 
            then echo "Attempting NPM install via emerge" && emerge update && emerge npm && break
            n=$[$n+1]
            sleep 2
        fi

        if [ n = 5 ]
            then echo "Installation engine not found! Please install a distribution appropriate NPM engine." && exit
        fi
    done
fi

#Run Build
if npm ls lerna --global --depth=0 | grep -i "lerna" &> /dev/null
    then 
    echo "Installing Azure-Bake tools and packages via NPM and LERNA HOIST."
        if npm run preinstall
            then echo "Azure-Bake tools and packages have been successfully installed."
            else echo "NPM failed to install LERNA and it's necessary tools. Exiting..." && exit
        fi
fi

echo "Running main LERNA build of Azure Bake."
if npm run clean:build
    then echo "The Azure-Bake Project has built successfully with LERNA."
    else echo "The Azure-Bake Project failed to build. Please view console and logging errors for additional information."
fi
    
