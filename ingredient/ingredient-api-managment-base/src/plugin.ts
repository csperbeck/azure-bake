import { BaseIngredient, IngredientManager } from "@azbake/core"
import { ARMHelper } from "@azbake/arm-helper"
import { ApiManagementClient } from "@azure/arm-apimanagement"
import { ApplicationInsightsManagementClient } from '@azure/arm-appinsights'
import ApimTemplate from "./api-management.json"
import { KeyPairSyncResult } from "crypto";

export class ApimBase extends BaseIngredient {

    public async Execute(): Promise<void> {
        try {
            this._logger.log(`API Manamgement: Base Logging - ${this._ingredient.properties.source}`)
            let util = IngredientManager.getIngredientFunction("coreutils", this._ctx)
            let client = new ApiManagementClient(this._ctx.AuthToken, this._ctx.Environment.authentication.subscriptionId)
            let aiClient = new ApplicationInsightsManagementClient(this._ctx.AuthToken, this._ctx.Environment.authentication.subscriptionId);
            const helper = new ARMHelper(this._ctx);
            let params = await helper.BakeParamsToARMParamsAsync(this._name, this._ingredient.properties.parameters)
            let serviceName = params["apiManagementServiceName"].value
            let properties = params["properties"]
            let loggerProps = params["logger"]
            delete params["properties"]
            delete params["logger"]
            //await helper.DeployTemplate(this._name, ApimTemplate, params, await util.resource_group())             
            if (properties) {
                let keys = Object.keys(properties.value)
                let apimRg = await util.resource_group() || ""         
                let item = ""
                for (let i = 0; i < keys.length; i++) {
                    item = keys[i]
                    this._logger.log(`Property: Deploying anmed value '${item}'`)
                    let subProps = properties.value[item]
                    let name = item
                    let propId = name.charAt(0).toLowerCase() + name.slice(1)
                    let tags = subProps["tags"] || ""
                    let isSecret = subProps["isSecret"] || false
                    let value = subProps["key"] || ""
                    await client.property.createOrUpdate(apimRg, serviceName, propId, {
                        displayName: name,
                        id: propId, 
                        name: name,
                        tags: tags,
                        secret: isSecret,
                        value: value
                    }
                    ).then((result) => {
                        if (result.eTag && result.displayName == name && result.value == value && result.secret == isSecret) {
                            this._logger.log(`Property: The named value '${name}' was successfully deployed`)
                        }
                        else {
                            throw `Property: The named value '${name}' was not correctly deployed`
                        }                        
                    });
                }
            }

            //Create Logger Connection to Application Insights
            if (loggerProps) {
                let aiRg = loggerProps.value.resourceGroup || await util.resource_group()
                let apimRg = await util.resource_group() || ""
                let aiName = loggerProps.value.name || ""
                this._logger.log(`Logger: Getting instrumentation key from '${aiName}' in resource group '${aiRg}'`)
                let response = await aiClient.components.get(aiRg, aiName)
                let aiKey: string = ""
                if (response.instrumentationKey) {
                    aiKey = response.instrumentationKey || ""
                }
                this._logger.log(`Logger: Deploying Connection for '${aiName}' on '${serviceName}'`)
                await client.logger.createOrUpdate(apimRg, serviceName, aiName, {
                    credentials: {instrumentationKey: aiKey},
                    loggerType: 'applicationInsights'
                }).then((result) => {
                    if (result.eTag && result.name == aiName && result.credentials.instrumentationKey && result.loggerType == 'applicationInsights') { 
                        this._logger.log(`Logger: Deployed '${result.name}' for '${result.loggerType}'`)
                        
                    }
                    else {
                        throw `Logger: ${aiName} was not deployed correctly`
                    }
                });
            }
        } catch (error) {
            this._logger.error('deployment failed: ' + error)
            throw error
        }
    }
}
//https://docs.microsoft.com/en-us/javascript/api/azure-arm-apimanagement/propertycontract?view=azure-node-latest