import { BaseIngredient, IngredientManager } from "@azbake/core"
import { ARMHelper } from "@azbake/arm-helper"
import { ContainerServiceClient } from "@azure/arm-containerservice"

export class AzureKubernetesService extends BaseIngredient {

    public async Execute(): Promise<void> {
        try {
            let util = IngredientManager.getIngredientFunction("coreutils", this._ctx)            
            this._logger.log(`Azure Container Service Plugin Logging: ${this._ingredient.properties.source}`)
            const helper = new ARMHelper(this._ctx);
            let params: any = await helper.BakeParamsToARMParamsAsync(this._name, this._ingredient.properties.parameters)
            let containerClient: ContainerServiceClient = new ContainerServiceClient(this._ctx.AuthToken,this._ctx.Environment.authentication.subscriptionId)
            this._logger.log(`Name: ${util.name}`)
            this._logger.log(`Keys: ${Object.keys(util)}`)

            //containerClient.containerServices.beginCreateOrUpdate(await util.resource_group)
        } catch(error){
            this._logger.error('deployment failed: ' + error)
            throw error
        }
    }
}