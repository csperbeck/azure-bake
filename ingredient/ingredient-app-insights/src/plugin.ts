import { BaseIngredient, IngredientManager } from "@azbake/core"
import { ARMHelper } from "@azbake/arm-helper"
import ARMTemplate from "./arm.json"
import stockAlerts from "./stockAlerts.json"

export class AppInsightsPlugIn extends BaseIngredient {
    public async Execute(): Promise<void> {
        try {
            let util = IngredientManager.getIngredientFunction("coreutils", this._ctx)
            this._logger.log('App Insights Plugin Logging: ' + await this._ingredient.properties.source.valueAsync(this._ctx))
            
            const helper = new ARMHelper(this._ctx);
            
            let params = await helper.BakeParamsToARMParamsAsync(this._name, this._ingredient.properties.parameters)
            
            await helper.DeployTemplate(this._name, ARMTemplate, params, await util.resource_group())

            let alertTarget = params["appInsightsName"].value
            let alertOverrides = this._ingredient.properties.alerts
            await helper.DeployAlerts(this._name, await util.resource_group(), alertTarget, stockAlerts, alertOverrides)            
        } catch(error){
            this._logger.error('deployment failed: ' + error)
            throw error
        }
    }
}
