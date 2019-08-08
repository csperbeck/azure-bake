import { BaseIngredient, IngredientManager, DeploymentContext, BakeVariable, TagGenerator } from "@azbake/core"
import { ARMHelper } from "@azbake/arm-helper"
import { ContainerServiceClient, ContainerServices } from "@azure/arm-containerservice"
import ARMTemplate from "./arm.json"

export class AzureKubernetesService extends BaseIngredient {

    public async Execute(): Promise<void> {
        try {
            let util: any = IngredientManager.getIngredientFunction("coreutils", this._ctx)
            this._logger.log(`Plugin Logging: ${this._ingredient.properties.type}`)
            const helper = new ARMHelper(this._ctx);
            let params: any = await helper.BakeParamsToARMParamsAsync(this._name, this._ingredient.properties.parameters)
            let containerClient: ContainerServiceClient = new ContainerServiceClient(this._ctx.AuthToken, this._ctx.Environment.authentication.subscriptionId)
            await helper.DeployTemplate(this._name, ARMTemplate, params, await util.resource_group())
        } catch (error) {
            this._logger.error('deployment failed: ' + error)
            throw error
        }
    }
}