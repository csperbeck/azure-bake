import { BaseIngredient, IngredientManager } from "@azbake/core"
import { ApiManagementClient } from "@azure/arm-apimanagement"
import { ARMHelper } from "@azbake/arm-helper"

export class ApimApi extends BaseIngredient {

    public async Execute(): Promise<void> {
        try {
            let util = IngredientManager.getIngredientFunction("coreutils", this._ctx)            
            const helper = new ARMHelper(this._ctx);
            this._logger.log(`Azure API Manamgement - Base Logging: ${this._ingredient.properties.source}`)
            let apiClient = new ApiManagementClient(this._ctx.AuthToken, this._ctx.Environment.authentication.subscriptionId);
            let params = await helper.BakeParamsToARMParamsAsync(this._name, this._ingredient.properties.parameters)
            let rg = params['resourceGroup'].value || await util.resource_group()
            //apiClient.api.createOrUpdate(
        } catch(error){
            this._logger.error('deployment failed: ' + error)
            throw error
        }
    }
}