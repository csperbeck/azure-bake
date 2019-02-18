npm install --global --prefix /azure/bake /azure/bake lerna ts-node
cd /azure-bake
npm run clean:build
cd ./system/src 
ts-node index.ts mix --name "my_deployment:latest" --runtime "latest" ../test/devTest/test.yaml
ts-node index.ts serve "my_deployment:latest" --sub 45cbe5a1-d2c6-4e13-ab1e-b72e0b20fe44 --key 2hG5fxQo8dEpBBbeUVI3DBj2YlRUB3WcR+Q0LOwzNBw= --serviceid 087d342a-9eeb-46d5-b15b-3549eb0b9387" --tenant "4719a3d9-5cb0-47d6-a221-f94bf6ed9a98 --env-name development --env-code DEV1 --regions { "name":"East US", "code":"eus", "shortName":"eastus" } --variables { "resource_types": "webapp" }
