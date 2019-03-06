#!/bin/bash
if [[ -z "${BAKE_AUTH_SUBSCRIPTION_ID}" ]]
    then read -p 'Enter the Azure Subscription ID: ' sub_id
    export BAKE_AUTH_SUBSCRIPTION_ID="$sub_id"
    else echo "Azure Subscription ID is already set!"
fi

if [[ -z "${BAKE_AUTH_TENANT_ID}" ]]
    then read -p "Enter the Azure Tenant ID: " tenant_id
    export BAKE_AUTH_TENANT_ID="$tenant_id"
    else echo "Azure Tenant ID is already set!"
fi

if [[ -z "${BAKE_AUTH_SERVICE_ID}" ]]
    then read -p "Enter the Azure Service ID: " svc_id 
    export BAKE_AUTH_SERVICE_ID="$svc_id"
    else echo "Azure Service ID is already set!"
fi

if [ -z "$BAKE_AUTH_SERVICE_KEY" ]
    then read -p "Enter the Azure Service Key: " svc_key 
    export BAKE_AUTH_SERVICE_KEY="$svc_key"
    else echo "Azure Service Key is already set!"
fi

if [ -z "$CONTAINER_URI" ]
    then read -p "Enter container repostiory URL: " cont_uri 
    export CONTAINER_URI="$cont_uri"
    else echo "Container Repository URL is already set!"
fi

docker build .

#Set environment variables as local for Dockerfile
$git_repo = "$BUILD_REPOSITORY_URI"
$git_branch = "$BUILD_SOURCEBRANCH"

#Run different dockerfile depending on run location
if [[ -z "${AGENT_ID}"]]
    then docker build . -t localhost/storage-test:dev --build-arg git_repo="$git_repo" --build-arg git_branch="$git_branch"
    else docker build . -t localhost/storage-test:dev --build-arg git_repo="$git_repo" --build-arg git_branch="$git_branch"
fi

#Run the container with environment secrets
docker run -it -e "container_uri=$CONTAINER_URI" -e "BAKE_AUTH_SUBSCRIPTION_ID=$BAKE_AUTH_SUBSCRIPTION_ID" -e "BAKE_AUTH_SERVICE_ID=$BAKE_AUTH_SERVICE_ID" -e "BAKE_AUTH_SERVICE_KEY=$BAKE_AUTH_SERVICE_KEY" -e "BAKE_AUTH_TENANT_ID=$BAKE_AUTH_TENANT" storage-test:latest