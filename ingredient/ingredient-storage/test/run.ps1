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
    [Environment]::SetEnvironmentVariable('CONTAINER_URI', $(Read-Host "Enter container repostiory URL"))
}
else { Write-Host "Container Repository URL is already set!" }

$global:git_repo = $(git config --get remote.origin.url)
$global:git_branch = $(git rev-parse --abbrev-ref HEAD)

Get-Content ./template.yml -Raw | Foreach-Object {
    $_  -replace '\$\{git_repo\}', $git_repo `
    -replace '\$\{git_branch\}', $git_branch `
    -replace '\$\{BAKE_AUTH_SUBSCRIPTION_ID\}', $ENV:BAKE_AUTH_SUBSCRIPTION_ID `
    -replace '\$\{BAKE_AUTH_SERVICE_ID\}', $ENV:BAKE_AUTH_SERVICE_ID `
    -replace '\$\{BAKE_AUTH_SERVICE_KEY\}', $ENV:BAKE_AUTH_SERVICE_KEY `
    -replace '\$\{BAKE_AUTH_TENANT_ID\}', $ENV:BAKE_AUTH_TENANT_ID `
    -replace '\$\{CONTAINER_URI\}', $ENV:CONTAINER_URI `
} | Set-Content ./docker-compose.yml 

docker-compose up --remove-orphans --build --force-recreate
Remove-Item ./docker-compose.yml

#Run and push the container
if (![string]::IsNullOrEmpty($ENV:CONTAINER_URI)) 
{ 
    docker push "$ENV:CONTAINER_URI/storage-test:latest" 
}
