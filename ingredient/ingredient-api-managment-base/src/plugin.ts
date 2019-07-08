import { BaseIngredient, IngredientManager } from "@azbake/core"
import { ARMHelper } from "@azbake/arm-helper"
import { ApiManagementClient } from "@azure/arm-apimanagement"
import { ApplicationInsightsManagementClient } from '@azure/arm-appinsights'
import ApimTemplate from "./api-management.json"
import { KeyPairSyncResult } from "crypto";

export class ApimBase extends BaseIngredient {

    public async Execute(): Promise<void> {
        try {
            let util = IngredientManager.getIngredientFunction("coreutils", this._ctx)            
            let client = new ApiManagementClient(this._ctx.AuthToken, this._ctx.Environment.authentication.subscriptionId)
            let aiClient = new ApplicationInsightsManagementClient(this._ctx.AuthToken, this._ctx.Environment.authentication.subscriptionId);
            this._logger.log(`Azure API Manamgement - Base Logging: ${this._ingredient.properties.source}`)
            const helper = new ARMHelper(this._ctx);
            let params = await helper.BakeParamsToARMParamsAsync(this._name, this._ingredient.properties.parameters)
            await helper.DeployTemplate(this._name, ApimTemplate, params, await util.resource_group())             
            if (params["properties"].value) {
                let serviceName = params["apiManagementServiceName"].value
                let properties = params["properties"]          
                let keys = Object.keys(params["properties"])
                keys.forEach(item => {
                    this._logger.log(`Deploying property ${item}`)
                    let subProps = properties[item].value
                    let name = item
                    let propId = name.charAt(0).toUpperCase() + name.slice(1)
                    let tags = subProps["tags"].value
                    client.property.createOrUpdate(util.resource_group(), serviceName, propId, {displayName: name, 
                                                                                                        id: propId, 
                                                                                                        name: name,
                                                                                                        tags: tags,
                                                                                                        secret: subProps["isSecret"].value,
                                                                                                        value: subProps["value"].value }
                    )                                        
                }); 

                if (params["logger"].value) {
                    let aiInstance = aiClient.components.get(util.resource_group(), params["logger"].value)
                    this._logger.log(`Key ${aiInstance["InstrumentationKey"].value}`)
                    client.logger.createOrUpdate(util.resource_group(), serviceName, params["logger"].value, aiInstance["InstrumentationKey"].value)
                }
            }
        } catch(error){
            this._logger.error('deployment failed: ' + error)
            throw error
        }
    }
}
//https://docs.microsoft.com/en-us/javascript/api/azure-arm-apimanagement/propertycontract?view=azure-node-latest