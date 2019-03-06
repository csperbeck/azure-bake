#!/bin/bash
cd /usr/local
git clone --single-branch --branch "${git_branch}" "${git_repo}"
cd azure-bake
npm run clean:build
if [ $? -eq 0 ]
then 
    cd /usr/local/azure-bake/ingredient/ingredient-storage/test
    if [[ -z "${container_uri}" ]]
        then deployment_name="storage-test:dev"
        else deployment_name="$container_uri/storage-test:dev"
    fi
    node /usr/local/azure-bake/system/dist/index.js mix --name "$deployment_name" --runtime "latest" test.yaml
    node /usr/local/azure-bake/system/dist/index.js serve "$deployment_name"
else
    echo "NPM Clean:Build FAILED! Exiting...."
fi
