#Determine if environment varibles for bake are set
if ([string]::IsNullOrEmpty($ENV:BAKE_AUTH_SUBSCRIPTION_ID)) 
{
    [Environment]::SetEnvironmentVariable('BAKE_AUTH_SUBSCRIPTION_ID', $(Read-Host "Enter the Azure Subscription ID"))
}
else { Write-Host "Azure Subscription ID is already set!" }

if ([string]::IsNullOrEmpty($ENV:BAKE_AUTH_TENANT_ID)) 
{
    [Environment]::SetEnvironmentVariable('BAKE_AUTH_TENANT_ID', $(Read-Host "Enter the Azure Tenant ID"))
}
else { Write-Host "Azure Tenant ID is already set!" }

if ([string]::IsNullOrEmpty($ENV:BAKE_AUTH_SERVICE_ID)) 
{
    [Environment]::SetEnvironmentVariable('BAKE_AUTH_SERVICE_ID', $(Read-Host "Enter the Azure Service Principal ID"))
}
else { Write-Host "Azure Service Principal ID is already set!" }

if ([string]::IsNullOrEmpty($ENV:BAKE_AUTH_SERVICE_KEY)) 
{
    [Environment]::SetEnvironmentVariable('BAKE_AUTH_SERVICE_KEY', $(Read-Host "Enter the Azure Service Principal Key"))
}
else { Write-Host "Azure Service Principal Key is already set!" }

if ([string]::IsNullOrEmpty($ENV:CONTAINER_URI)) 
{
    [Environment]::SetEnvironmentVariable('BAKE_AUTH_SERVICE_KEY', $(Read-Host "Enter container repostiory URL"))
}
else { Write-Host "Container Repository URL is already set!" }

#Run different dockerfile depending on run location
if ([string]::IsNullOrEmpty($ENV:AGENT_ID))
{
    #Set variables for local repo
    $git_repo = $(git config --get remote.origin.url)
    $git_branch = $(git rev-parse --abbrev-ref HEAD)
}
else
{
    #Set environment variables as local for Dockerfile
    $git_repo = "$ENV:BUILD_REPOSITORY_URI"
    $git_branch = "$ENV:BUILD_SOURCEBRANCH"
}

#Run and push the container
docker-compose up
if (![string]::IsNullOrEmpty($ENV:CONTAINER_URI)) 
{ 
    docker push "$ENV:CONTAINER_URI/storage-test" 
}

#Run the container with environment secrets
docker run -e "container_uri=$ENV:CONTAINER_URI"-e "BAKE_AUTH_SUBSCRIPTION_ID=$ENV:BAKE_AUTH_SUBSCRIPTION_ID" -e "BAKE_AUTH_SERVICE_ID=$ENV:BAKE_AUTH_SERVICE_ID" -e "BAKE_AUTH_SERVICE_KEY=$ENV:BAKE_AUTH_SERVICE_KEY" -e "BAKE_AUTH_TENANT_ID=$ENV:BAKE_AUTH_TENANT" -rm storage-test:latest
