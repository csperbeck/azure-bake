
import { BaseIngredient, IngredientManager } from "@azbake/core"
import { ARMHelper } from "@azbake/arm-helper"
import ARMTemplate from "./storage.json"
import { ServiceBusNamespaceUtils } from "./functions.js";
import { ServiceBusManagementClient } from '@azure/arm-servicebus'

export class ServiceBusQueuePlugIn extends BaseIngredient {
    public async Execute(): Promise<void> {
        try {
            let util = IngredientManager.getIngredientFunction("coreutils", this._ctx)
            this._logger.log("Storage ingredient logging");
            
            const helper = new ARMHelper(this._ctx);
            
            let params = await helper.BakeParamsToARMParamsAsync(this._name, this._ingredient.properties.parameters)
            
            await helper.DeployTemplate(this._name, ARMTemplate, params, await util.resource_group())

        } catch(error){
            this._logger.error('deployment failed: ' + error)
            throw error
        }
    }
}