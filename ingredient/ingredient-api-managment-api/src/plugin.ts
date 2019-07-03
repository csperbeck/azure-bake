import { BaseIngredient, IngredientManager } from "@azbake/core"
import { ApiManagementClient } from "@azure/arm-apimanagement"

export class ApimApi extends BaseIngredient {

    public async Execute(): Promise<void> {
        try {
            let util = IngredientManager.getIngredientFunction("coreutils", this._ctx)            
            this._logger.log(`Azure API Manamgement - Base Logging: ${this._ingredient.properties.source}`)
            const helper = new ARMHelper(this._ctx);
            let params = await helper.BakeParamsToARMParamsAsync(this._name, this._ingredient.properties.parameters)
            //Deploy Here
        } catch(error){
            this._logger.error('deployment failed: ' + error)
            throw error
        }
    }
}