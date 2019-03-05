#!/bin/bash
cd /usr/local/azure-bake
if npm run clean:build
then 
    cd /ingredient/ingredient-storage/test
    if [[ -z "${container_uri}" ]]
        then $deployment_name = "storage-test:dev"
        else $deployment_name = "$container_uri/storage-test:dev"; fi
    fi
    node /usr/local/azure-bake/system/dist/index.js mix --name "$container_uri/storage-test:dev" --runtime "latest" test.yaml
    node /usr/local/azure-bake/system/dist/index.js serve "$container_uri/storage-test:dev"
else
    echo "NPM Clean:Build FAILED! Exiting...."
fi